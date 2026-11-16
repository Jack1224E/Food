"use client";

import React from "react";
import Image from "next/image";
import { Recipe } from "@/types/recipe";
import { Heart, Star } from "lucide-react";

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  isSaved?: boolean;
  onToggleSave?: (recipeId: string) => void;
  categoryLabel?: string;
  ratingScore?: string;
  ratingsCount?: string;
  badgeEmoji?: string;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onSelect,
  isSaved = false,
  onToggleSave,
  categoryLabel,
  ratingScore = "4.9",
  ratingsCount = "2.1k",
  badgeEmoji,
}) => {
  const category = categoryLabel || recipe.cuisine || (recipe.tags && recipe.tags[0]) || "FEATURED RECIPE";

  return (
    <div
      onClick={() => onSelect(recipe)}
      className="group flex flex-col cursor-pointer transition-transform duration-200"
    >
      {/* Huge Borderless Food Image with Rounded Corners */}
      <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl bg-stone-100 shadow-2xs">
        <Image
          src={recipe.image_url}
          alt={recipe.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Funky Food Emoji Badge if present */}
        {badgeEmoji && (
          <div className="absolute top-3.5 left-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm text-base">
            {badgeEmoji}
          </div>
        )}

        {/* Heart Bookmark Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave?.(recipe.id);
          }}
          className={`absolute top-3.5 right-3.5 flex h-9 w-9 items-center justify-center rounded-full shadow-md transition ${
            isSaved
              ? "bg-[#e25b27] text-white"
              : "bg-white/95 text-stone-700 hover:text-[#e25b27] hover:bg-white"
          }`}
        >
          <Heart className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Larger, Clean Typography Underneath (Allrecipes Match) */}
      <div className="pt-3 space-y-1.5">
        {/* Category Eyebrow in bold uppercase */}
        <div className="text-xs font-black uppercase tracking-wider text-stone-500">
          {category}
        </div>

        {/* Big Bold Recipe Title */}
        <h3 className="text-lg sm:text-xl font-black text-stone-900 leading-snug group-hover:underline line-clamp-2">
          {recipe.title}
        </h3>

        {/* Larger Rating Stars & Fake Thousands Rating Count */}
        <div className="flex items-center gap-2 text-sm font-bold text-stone-700 pt-0.5">
          <div className="flex text-[#e25b27]">
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
            <Star className="h-4 w-4 fill-current" />
          </div>
          <span className="font-extrabold text-stone-900">{ratingScore}</span>
          <span className="text-stone-500 font-semibold">({ratingsCount} Ratings)</span>
        </div>
      </div>
    </div>
  );
};
