"use client";

import React from "react";
import { Recipe } from "@/types/recipe";
import { RecipeCard } from "./RecipeCard";
import { ArrowRight, Flame, Sparkles, Utensils, Zap, Clock } from "lucide-react";

interface RecipeFeedProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const RecipeFeed: React.FC<RecipeFeedProps> = ({
  recipes,
  onSelectRecipe,
  savedIds,
  onToggleSave,
}) => {
  // Slicing recipes into thematic curated rows like Allrecipes
  const clones = recipes.filter((r) => r.is_clone_recipe);
  const quickMeals = recipes.filter((r) => (r.total_time_minutes || 0) <= 35);
  const comfortSides = recipes.filter(
    (r) =>
      r.tags.some((t) => t.includes("Comfort") || t.includes("Sides") || t.includes("Dips"))
  );

  return (
    <div id="feed" className="w-full space-y-16 pt-4">
      {/* SECTION 1: Top Secret Restaurant Clones (Allrecipes Style) */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2 group cursor-pointer">
            <span>Popular Secret Clones</span>
            <ArrowRight className="h-5 w-5 text-[#e25b27] group-hover:translate-x-1 transition-transform" />
          </h2>
          <span className="text-xs font-bold text-[#e25b27] uppercase tracking-wider">
            Reverse-Engineered
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {clones.slice(0, 4).map((recipe, idx) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={onSelectRecipe}
              isSaved={savedIds.includes(recipe.id)}
              onToggleSave={onToggleSave}
              categoryLabel="SECRET CLONE FORMULA"
              ratingScore={["4.9", "4.8", "4.9", "4.7"][idx % 4]}
              ratingsCount={["1,842", "4,210", "649", "930"][idx % 4]}
            />
          ))}
        </div>
      </section>

      {/* SECTION 2: Oozing Party Dips & Crowd Pleasers */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2 group cursor-pointer">
            <span>Craveable Dips & Comfort Appetizers</span>
            <ArrowRight className="h-5 w-5 text-[#e25b27] group-hover:translate-x-1 transition-transform" />
          </h2>
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Party Starters
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {recipes.slice(0, 4).map((recipe, idx) => (
            <RecipeCard
              key={`dips-${recipe.id}`}
              recipe={recipe}
              onSelect={onSelectRecipe}
              isSaved={savedIds.includes(recipe.id)}
              onToggleSave={onToggleSave}
              categoryLabel="APPETIZER & PARTY DIPS"
              ratingScore={["4.9", "4.9", "4.8", "5.0"][idx % 4]}
              ratingsCount={["2,450", "3,110", "890", "1,520"][idx % 4]}
            />
          ))}
        </div>
      </section>

      {/* SECTION 3: 20-Minute Weeknight Dinners */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2 group cursor-pointer">
            <span>20-Minute Quick Dinners</span>
            <ArrowRight className="h-5 w-5 text-[#e25b27] group-hover:translate-x-1 transition-transform" />
          </h2>
          <span className="text-xs font-bold text-[#e25b27] uppercase tracking-wider">
            Fast Weeknights
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {(quickMeals.length > 0 ? quickMeals : recipes).slice(0, 4).map((recipe, idx) => (
            <RecipeCard
              key={`quick-${recipe.id}`}
              recipe={recipe}
              onSelect={onSelectRecipe}
              isSaved={savedIds.includes(recipe.id)}
              onToggleSave={onToggleSave}
              categoryLabel="QUICK & EASY DINNER"
              ratingScore={["4.8", "4.9", "4.7", "4.9"][idx % 4]}
              ratingsCount={["780", "1,420", "512", "2,840"][idx % 4]}
            />
          ))}
        </div>
      </section>

      {/* SECTION 4: Holiday Sides & Soul Comforts */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2 group cursor-pointer">
            <span>Holiday Sides & Soul Comforts</span>
            <ArrowRight className="h-5 w-5 text-[#e25b27] group-hover:translate-x-1 transition-transform" />
          </h2>
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Home Classics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {recipes.slice(4, 8).map((recipe, idx) => (
            <RecipeCard
              key={`sides-${recipe.id}`}
              recipe={recipe}
              onSelect={onSelectRecipe}
              isSaved={savedIds.includes(recipe.id)}
              onToggleSave={onToggleSave}
              categoryLabel="FAVORITE SIDES & BAKERY"
              ratingScore={["5.0", "4.9", "4.8", "4.9"][idx % 4]}
              ratingsCount={["4,236", "649", "1,102", "3,890"][idx % 4]}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
