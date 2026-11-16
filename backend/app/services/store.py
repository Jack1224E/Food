import json
import logging
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
from app.models.recipe import Recipe, Ingredient, Nutrition

logger = logging.getLogger(__name__)

DATA_FILE = Path(__file__).resolve().parent.parent.parent / "data" / "recipes.json"

class RecipeStore:
    def __init__(self):
        self._recipes: List[Recipe] = []
        self.load()

    def load(self):
        """Load recipes from disk or fallback to empty."""
        if DATA_FILE.exists():
            try:
                with open(DATA_FILE, "r", encoding="utf-8") as f:
                    raw = json.load(f)
                    self._recipes = [Recipe(**item) for item in raw]
                logger.info(f"Loaded {len(self._recipes)} recipes from {DATA_FILE}")
            except Exception as e:
                logger.error(f"Error loading {DATA_FILE}: {e}")
        else:
            logger.warning(f"{DATA_FILE} not found")

    def save(self):
        """Persist recipes to disk."""
        try:
            DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
            with open(DATA_FILE, "w", encoding="utf-8") as f:
                json.dump([r.model_dump() for r in self._recipes], f, indent=2)
            logger.info(f"Persisted {len(self._recipes)} recipes to {DATA_FILE}")
        except Exception as e:
            logger.error(f"Failed to save recipes to {DATA_FILE}: {e}")

    def get_all(self) -> List[Recipe]:
        return list(self._recipes)

    def get_by_id(self, recipe_id: str) -> Optional[Recipe]:
        for r in self._recipes:
            if r.id == recipe_id:
                return r
        return None

    def add_or_update(self, recipe: Recipe):
        """Add new recipe or update existing, then persist."""
        for idx, r in enumerate(self._recipes):
            if r.id == recipe.id:
                self._recipes[idx] = recipe
                self.save()
                return
        # Prepend so new recipes appear first
        self._recipes.insert(0, recipe)
        self.save()

    def get_periodic_editorial(self, days_per_cycle: int = 3, cycle_offset: int = 0) -> Dict[str, Any]:
        """
        Calculate deterministic period-based editorial lineup.
        Guarantees:
        - Within the 3-day period, refreshes are completely stable (zero flickering).
        - Every 3 days (or when cycle_offset changes), the lineup smoothly advances to a new edition.
        """
        if days_per_cycle < 1:
            raise ValueError("days_per_cycle must be at least 1")

        now = datetime.now(timezone.utc)
        epoch = datetime(1970, 1, 1, tzinfo=timezone.utc)
        epoch_days = (now - epoch).days
        base_cycle = epoch_days // days_per_cycle
        cycle = base_cycle + cycle_offset

        days_in_current = epoch_days % days_per_cycle
        days_remaining = max(1, days_per_cycle - days_in_current)

        cycle_start = epoch + timedelta(days=cycle * days_per_cycle)
        cycle_end = cycle_start + timedelta(days=days_per_cycle - 1)
        edition_label = f"{cycle_start.strftime('%b %d')} – {cycle_end.strftime('%b %d')} Curated Edition"

        recipes = self._recipes
        total = len(recipes)
        if total == 0:
            return {
                "edition_label": edition_label,
                "cycle_index": cycle,
                "days_per_cycle": days_per_cycle,
                "days_remaining": days_remaining,
                "hero_recipe": None,
                "trending_sidebar": [],
                "trending_now": [],
                "starters": [],
                "mains": [],
                "desserts": [],
                "sides": [],
                "all_recipes": []
            }

        # Filter categories
        starters = [r for r in recipes if "Starter" in (r.cuisine or "") or any("Starter" in t for t in r.tags)]
        mains = [r for r in recipes if "Main" in (r.cuisine or "") or "Biryani" in (r.cuisine or "") or any("Main" in t for t in r.tags)]
        desserts = [r for r in recipes if "Dessert" in (r.cuisine or "") or "Bakery" in (r.cuisine or "") or any("Dessert" in t for t in r.tags)]
        sides = [r for r in recipes if "Side" in (r.cuisine or "") or "Casserole" in (r.cuisine or "") or any("Side" in t for t in r.tags)]
        clones = [r for r in recipes if r.is_clone_recipe]

        # Hero pool: Signature feast dishes
        hero_candidates = mains + [r for r in recipes if "Sizzler" in (r.cuisine or "") or "Royal" in r.title]
        if not hero_candidates:
            hero_candidates = recipes

        hero_idx = cycle % len(hero_candidates)
        hero_recipe = hero_candidates[hero_idx]

        # Deterministic rotation for categories
        def rotate_slice(pool: List[Recipe], count: int, shift: int) -> List[Recipe]:
            if not pool:
                return []
            s = shift % len(pool)
            rotated = pool[s:] + pool[:s]
            # Exclude current hero if present
            filtered = [r for r in rotated if r.id != hero_recipe.id]
            return filtered[:count] if filtered else rotated[:count]

        trending_sidebar = rotate_slice(clones + recipes, 4, cycle * 2 + 1)
        trending_now = rotate_slice(recipes, 3, cycle * 3 + 4)
        curated_starters = rotate_slice(starters or recipes, 3, cycle + 2)
        curated_mains = rotate_slice(mains or recipes, 3, cycle + 5)
        curated_desserts = rotate_slice(desserts or recipes, 6, cycle + 1)
        curated_sides = rotate_slice(sides or recipes, 6, cycle + 3)

        return {
            "edition_label": edition_label,
            "cycle_index": cycle,
            "days_per_cycle": days_per_cycle,
            "days_remaining": days_remaining,
            "hero_recipe": hero_recipe.model_dump(),
            "trending_sidebar": [r.model_dump() for r in trending_sidebar],
            "trending_now": [r.model_dump() for r in trending_now],
            "starters": [r.model_dump() for r in curated_starters],
            "mains": [r.model_dump() for r in curated_mains],
            "desserts": [r.model_dump() for r in curated_desserts],
            "sides": [r.model_dump() for r in curated_sides],
            "all_recipes": [r.model_dump() for r in recipes]
        }

recipe_store = RecipeStore()

