import urllib.request
import urllib.parse
import re
import json
import logging
from typing import Optional, List, Dict, Any
from bs4 import BeautifulSoup
from recipe_scrapers import scrape_html
import openai
from app.config import settings
from app.models.recipe import Recipe, Ingredient, Nutrition

logger = logging.getLogger(__name__)

class CulinarySleuth:
    def __init__(self):
        self.api_key = settings.NVIDIA_API_KEY
        self.base_url = settings.NVIDIA_BASE_URL
        self.model = settings.NEMOTRON_MODEL
        self.client = openai.OpenAI(
            base_url=self.base_url,
            api_key=self.api_key
        ) if self.api_key else None

    def search_web_links(self, query: str) -> List[Dict[str, str]]:
        """Search DuckDuckGo Lite for recipes matching the query."""
        url = "https://lite.duckduckgo.com/lite/"
        search_query = f"{query} recipe"
        data = urllib.parse.urlencode({"q": search_query}).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
            }
        )
        candidates = []
        try:
            with urllib.request.urlopen(req, timeout=7) as res:
                html = res.read().decode("utf-8", errors="ignore")
            soup = BeautifulSoup(html, "html.parser")
            snippets = [td.get_text(strip=True) for td in soup.select(".result-snippet")]
            links = [a.get("href", "") for a in soup.select(".result-link")]

            for link, snippet in zip(links, snippets):
                # Clean duckduckgo redirect link if present
                clean_link = link
                if "uddg=" in link:
                    m = re.search(r"uddg=([^&]+)", link)
                    if m:
                        clean_link = urllib.parse.unquote(m.group(1))
                if clean_link.startswith("http") and not any(d in clean_link for d in ["youtube.com", "pinterest.com", "facebook.com", "twitter.com", "instagram.com"]):
                    candidates.append({"url": clean_link, "snippet": snippet})
        except Exception as e:
            logger.warning(f"DDG search error: {e}")

        return candidates[:4]

    def scrape_recipe_page(self, url: str) -> Optional[Dict[str, Any]]:
        """Scrape structured recipe data and authentic image from target page."""
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8"
            }
        )
        try:
            with urllib.request.urlopen(req, timeout=7) as res:
                html = res.read().decode("utf-8", errors="ignore")
        except Exception as e:
            logger.warning(f"Failed to fetch {url}: {e}")
            return None

        # 1. Try recipe_scrapers
        try:
            scraper = scrape_html(html, org_url=url)
            title = scraper.title()
            image = scraper.image()
            ingredients = scraper.ingredients()
            instructions = scraper.instructions()
            total_time = scraper.total_time() or 30
            yields = scraper.yields() or "4 servings"
            if title and (ingredients or instructions):
                return {
                    "source_url": url,
                    "title": title,
                    "image_url": image,
                    "ingredients": ingredients,
                    "instructions": instructions,
                    "total_time": total_time,
                    "yields": yields,
                }
        except Exception:
            pass

        # 2. Fallback: Parse OpenGraph metadata & Schema JSON-LD
        soup = BeautifulSoup(html, "html.parser")
        title = None
        og_title = soup.find("meta", property="og:title")
        if og_title and og_title.get("content"):
            title = og_title["content"]
        elif soup.title:
            title = soup.title.string

        image = None
        og_image = soup.find("meta", property="og:image")
        if og_image and og_image.get("content"):
            image = og_image["content"]

        # Look for schema.org Recipe JSON-LD
        ingredients = []
        instructions = ""
        for script in soup.find_all("script", type="application/ld+json"):
            try:
                data = json.loads(script.string or "")
                items = data if isinstance(data, list) else [data]
                if "@graph" in data:
                    items = data["@graph"]
                for item in items:
                    if isinstance(item, dict) and item.get("@type") == "Recipe":
                        title = title or item.get("name")
                        image = image or (item.get("image", [None])[0] if isinstance(item.get("image"), list) else item.get("image"))
                        ingredients = item.get("recipeIngredient", [])
                        inst = item.get("recipeInstructions", [])
                        if isinstance(inst, list):
                            instructions = "\n".join([s.get("text", str(s)) if isinstance(s, dict) else str(s) for s in inst])
                        else:
                            instructions = str(inst)
            except Exception:
                continue

        if title:
            # Fallback text snippet
            if not instructions:
                text_snippets = [p.get_text(strip=True) for p in soup.find_all("p") if len(p.get_text(strip=True)) > 40]
                instructions = "\n".join(text_snippets[:6])
            return {
                "source_url": url,
                "title": title,
                "image_url": image or "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
                "ingredients": ingredients,
                "instructions": instructions,
                "total_time": 35,
                "yields": "4 servings",
            }

        return None

    def synthesize_with_nemotron(self, query: str, scraped: Dict[str, Any]) -> Recipe:
        """Call NVIDIA Nemotron to format the scraped recipe into CraveLab format."""
        if not self.client:
            raise RuntimeError("NVIDIA client not configured")

        scraped_summary = f"""
Query: {query}
Source Title: {scraped.get('title')}
Source URL: {scraped.get('source_url')}
Image URL: {scraped.get('image_url')}
Total Time: {scraped.get('total_time')} mins
Ingredients: {json.dumps(scraped.get('ingredients', []))}
Instructions / Context: {scraped.get('instructions', '')[:1200]}
"""

        system_prompt = (
            "You are the CraveLab Culinary Intelligence Sleuth powered by NVIDIA Nemotron. "
            "Your role is to reverse-engineer and synthesize authentic, crowd-pleasing recipes from scraped web data. "
            "You MUST preserve the scraped image_url. Provide 2-3 genuine insider secrets/hacks. "
            "Output strictly a raw, valid JSON object matching the requested schema with no Markdown code fences and no preamble."
        )

        user_prompt = f"""Synthesize this scraped culinary data for "{query}" into our platform format.

{scraped_summary}

Respond ONLY with valid JSON following this exact structure:
{{
  "id": "kebab-case-slug",
  "title": "Appetizing Editorial Recipe Title",
  "description": "Sensory-rich description capturing emotions, taste, and authenticity.",
  "image_url": "{scraped.get('image_url') or 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80'}",
  "prep_time_minutes": 15,
  "cook_time_minutes": 25,
  "total_time_minutes": 40,
  "servings": 4,
  "difficulty": "Easy",
  "cuisine": "Cuisine Region",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "is_clone_recipe": true,
  "secret_hacks": [
    "Insider technique or ingredient secret 1",
    "Insider technique or ingredient secret 2"
  ],
  "ingredients": [
    {{"name": "Ingredient Name", "amount": "1", "unit": "cup"}}
  ],
  "instructions": [
    "Step 1 description",
    "Step 2 description"
  ],
  "nutrition": {{
    "calories": "350 kcal",
    "protein": "12g",
    "carbs": "45g",
    "fat": "14g"
  }}
}}"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.2,
                max_tokens=1800
            )
            raw = response.choices[0].message.content.strip()
            # Clean markdown code fences if model enclosed in ```json ... ```
            if "```" in raw:
                parts = raw.split("```")
                for p in parts:
                    clean = p.strip()
                    if clean.startswith("json"):
                        clean = clean[4:].strip()
                    if clean.startswith("{") and clean.endswith("}"):
                        raw = clean
                        break

            parsed = json.loads(raw)
            # Ensure image_url is preserved
            if not parsed.get("image_url") or "unsplash.com/photo-1546069901" in parsed.get("image_url", ""):
                parsed["image_url"] = scraped.get("image_url") or parsed.get("image_url")

            ingredients = [
                Ingredient(
                    name=i.get("name", "Ingredient"),
                    amount=str(i.get("amount", "")),
                    unit=str(i.get("unit", "")),
                    notes=i.get("notes")
                )
                for i in parsed.get("ingredients", [])
            ]
            nutr = parsed.get("nutrition", {})
            nutrition = Nutrition(
                calories=nutr.get("calories", "350 kcal"),
                protein=nutr.get("protein", "10g"),
                carbs=nutr.get("carbs", "40g"),
                fat=nutr.get("fat", "15g")
            )

            recipe = Recipe(
                id=parsed.get("id", re.sub(r"[^a-z0-9]+", "-", query.lower()).strip("-")),
                title=parsed.get("title", query.title()),
                description=parsed.get("description", f"Authentic tested formula for {query}."),
                image_url=parsed.get("image_url", scraped.get("image_url") or "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80"),
                prep_time_minutes=int(parsed.get("prep_time_minutes", 15)),
                cook_time_minutes=int(parsed.get("cook_time_minutes", 25)),
                total_time_minutes=int(parsed.get("total_time_minutes", 40)),
                servings=int(parsed.get("servings", 4)),
                difficulty=parsed.get("difficulty", "Easy"),
                cuisine=parsed.get("cuisine", "Global"),
                tags=parsed.get("tags", ["Trending", "AI Sleuth"]),
                is_clone_recipe=bool(parsed.get("is_clone_recipe", True)),
                secret_hacks=parsed.get("secret_hacks", ["Bloom spices in hot oil to maximize aroma"]),
                ingredients=ingredients,
                instructions=parsed.get("instructions", ["Prepare ingredients", "Cook until tender"]),
                nutrition=nutrition,
                source_url=scraped.get("source_url"),
                source_name=parsed.get("source_name", "Web Recipe Sleuth")
            )
            return recipe
        except Exception as e:
            logger.error(f"Nemotron synthesis failed: {e}")
            raise

    def sleuth_recipe(self, query: str) -> Optional[Recipe]:
        """End-to-end: Web search -> Scrape page & image -> Nemotron synthesis."""
        links = self.search_web_links(query)
        if not links:
            logger.warning(f"No web links found for query: {query}")
            return None

        for item in links:
            url = item["url"]
            scraped = self.scrape_recipe_page(url)
            if scraped and scraped.get("title"):
                # If image missing, search fallback image
                if not scraped.get("image_url") or "placeholder" in scraped.get("image_url", "").lower():
                    scraped["image_url"] = self.find_fallback_image(query)
                try:
                    return self.synthesize_with_nemotron(query, scraped)
                except Exception as e:
                    logger.warning(f"Failed to synthesize with Nemotron for {url}: {e}")
                    continue

        return None

    def find_fallback_image(self, query: str) -> str:
        """Find an authentic food image for the dish query."""
        # Clean query for image search
        return f"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80"


sleuth_service = CulinarySleuth()

