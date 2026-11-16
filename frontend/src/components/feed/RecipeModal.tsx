"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Recipe } from "@/types/recipe";
import { X, Clock, Users, Flame, Lock, Sparkles, Check, Bookmark, ChefHat } from "lucide-react";

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  onClose,
  isSaved = false,
  onToggleSave,
}) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  if (!recipe) return null;

  const toggleIngredient = (name: string) => {
    setCheckedIngredients((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleStep = (index: number) => {
    setCheckedSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white border border-culinary-border shadow-2xl space-y-6">
        {/* Header Hero Image */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-culinary-subtle">
          <Image
            src={recipe.image_url}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Action buttons on top of image */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            {recipe.is_clone_recipe ? (
              <span className="flex items-center gap-1.5 rounded-full bg-culinary-primary text-white px-3.5 py-1 text-xs font-bold shadow-md">
                <Lock className="h-3.5 w-3.5" />
                Secret Clone Formula
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-full bg-white/95 text-culinary-dark px-3.5 py-1 text-xs font-bold shadow-md">
                <ChefHat className="h-3.5 w-3.5 text-culinary-primary" />
                Original Recipe
              </span>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleSave?.(recipe.id)}
                className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition ${
                  isSaved
                    ? "bg-culinary-primary text-white"
                    : "bg-white/90 text-culinary-dark hover:bg-white"
                }`}
              >
                <Bookmark className="h-4 w-4" />
              </button>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-culinary-dark hover:bg-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Title on bottom of image */}
          <div className="absolute bottom-4 left-6 right-6 z-10 space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-sm">
              {recipe.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-white/90 drop-shadow-sm">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-culinary-amber" />
                Prep: {recipe.prep_time_minutes}m · Cook: {recipe.cook_time_minutes}m
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-white" />
                {recipe.servings} Servings
              </span>
              <span>·</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5">
                {recipe.difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 pt-0">
          <p className="text-sm text-stone-700 leading-relaxed font-normal">
            {recipe.description}
          </p>

          {/* Secret Hack Callout Box */}
          {recipe.secret_hacks && recipe.secret_hacks.length > 0 && (
            <div className="rounded-2xl bg-orange-50 border border-orange-200 p-5 space-y-2">
              <div className="flex items-center gap-1.5 text-sm font-bold text-culinary-primary">
                <Sparkles className="h-4 w-4" />
                <span>The Culinary Secret Hack:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-stone-800">
                {recipe.secret_hacks.map((hack, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-culinary-primary shrink-0" />
                    <span>{hack}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Ingredients & Steps */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Ingredients (2 cols) */}
            <div className="md:col-span-2 space-y-3">
              <h3 className="text-base font-bold text-culinary-dark border-b border-culinary-border pb-2 flex items-center justify-between">
                <span>Ingredients</span>
                <span className="text-xs font-semibold text-culinary-muted">
                  {recipe.ingredients.length} items
                </span>
              </h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ing, i) => {
                  const isChecked = checkedIngredients[ing.name];
                  return (
                    <li
                      key={i}
                      onClick={() => toggleIngredient(ing.name)}
                      className={`flex items-start gap-2.5 text-xs p-2 rounded-lg cursor-pointer transition ${
                        isChecked
                          ? "bg-stone-100 text-stone-400 line-through"
                          : "hover:bg-orange-50 text-stone-800"
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                          isChecked
                            ? "bg-culinary-green border-culinary-green text-white"
                            : "border-stone-300 bg-white"
                        }`}
                      >
                        {isChecked && <Check className="h-3 w-3" />}
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-culinary-primary">
                          {ing.amount} {ing.unit}{" "}
                        </span>
                        <span>{ing.name}</span>
                        {ing.notes && (
                          <span className="block text-[11px] text-stone-500 italic">
                            ({ing.notes})
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Directions (3 cols) */}
            <div className="md:col-span-3 space-y-3">
              <h3 className="text-base font-bold text-culinary-dark border-b border-culinary-border pb-2">
                Step-by-Step Directions
              </h3>
              <div className="space-y-3">
                {recipe.instructions.map((step, idx) => {
                  const isDone = checkedSteps[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStep(idx)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border transition cursor-pointer ${
                        isDone
                          ? "bg-stone-50 border-stone-200 text-stone-400"
                          : "bg-white border-culinary-border hover:border-orange-200 text-stone-800"
                      }`}
                    >
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          isDone
                            ? "bg-culinary-green text-white"
                            : "bg-orange-100 text-culinary-primary"
                        }`}
                      >
                        {isDone ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                      </div>
                      <p className={`text-xs leading-relaxed ${isDone ? "line-through text-stone-400" : ""}`}>
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Estimated Nutrition */}
          {recipe.nutrition && (
            <div className="rounded-xl bg-culinary-subtle border border-culinary-border p-4">
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2">
                Nutrition Facts (Per Serving)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="rounded-lg bg-white p-2 border border-culinary-border shadow-2xs">
                  <span className="text-[10px] text-stone-500 block">Calories</span>
                  <span className="text-sm font-bold text-culinary-primary">{recipe.nutrition.calories}</span>
                </div>
                <div className="rounded-lg bg-white p-2 border border-culinary-border shadow-2xs">
                  <span className="text-[10px] text-stone-500 block">Protein</span>
                  <span className="text-sm font-bold text-stone-800">{recipe.nutrition.protein}</span>
                </div>
                <div className="rounded-lg bg-white p-2 border border-culinary-border shadow-2xs">
                  <span className="text-[10px] text-stone-500 block">Carbs</span>
                  <span className="text-sm font-bold text-stone-800">{recipe.nutrition.carbs}</span>
                </div>
                <div className="rounded-lg bg-white p-2 border border-culinary-border shadow-2xs">
                  <span className="text-[10px] text-stone-500 block">Fat</span>
                  <span className="text-sm font-bold text-stone-800">{recipe.nutrition.fat}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
