"use client";

import React from "react";
import Image from "next/image";
import { Recipe } from "@/types/recipe";
import { Star, Heart, ArrowRight, Sparkles } from "lucide-react";

interface ChefSpotlightProps {
  onSelectRecipe: (recipe: Recipe) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const ChefSpotlight: React.FC<ChefSpotlightProps> = ({
  onSelectRecipe,
  savedIds,
  onToggleSave,
}) => {
  const leftCards = [
    {
      id: "crunchwrap-casserole",
      title: "Crunchwrap Casserole",
      rating: "4.9",
      ratingsCount: "2.4k",
      image: "/images/allrecipes/ar-best-recipies-24-7563621-crunchwrap-casserole-0908-3x2-7f8bddb16a9c44f39a4884c98fd1c215.jpg",
      category: "CASSEROLE RECIPES",
      recipeData: {
        id: "crunchwrap-casserole",
        title: "Taco Bell Copycat Crunchwrap Casserole",
        description: "Layers of seasoned lean ground beef, creamy nacho cheese sauce, crunchy tostadas, sour cream, shredded lettuce, and diced tomatoes baked until melted perfection.",
        image_url: "/images/allrecipes/ar-best-recipies-24-7563621-crunchwrap-casserole-0908-3x2-7f8bddb16a9c44f39a4884c98fd1c215.jpg",
        prep_time_minutes: 20,
        cook_time_minutes: 25,
        total_time_minutes: 45,
        servings: 8,
        difficulty: "Easy" as const,
        cuisine: "Budget Cooking Recipes",
        tags: ["Nicole's Perfect Bite", "Casseroles", "Mexican-Inspired"],
        is_clone_recipe: true,
        secret_hacks: ["Toast the corn tostada discs in the oven for 5 minutes before layering so they stay ultra-crisp inside the casserole"],
        ingredients: [
          { name: "Ground beef (80/20)", amount: "1.5", unit: "lbs" },
          { name: "Taco seasoning packet", amount: "1", unit: "packet" },
          { name: "Warm nacho cheese sauce", amount: "15", unit: "oz" },
          { name: "Crispy corn tostadas", amount: "8", unit: "discs" },
          { name: "Flour tortillas", amount: "6", unit: "large" },
          { name: "Sour cream & shredded cheddar", amount: "2", unit: "cups" }
        ],
        instructions: [
          "Brown ground beef with taco seasoning and drain fat.",
          "Layer tortillas in a 9x13 baking dish, spread meat and nacho cheese.",
          "Add crunchy tostadas, spread sour cream and cheese, fold tortillas.",
          "Bake at 375°F for 25 minutes until golden and bubbly."
        ],
        nutrition: { calories: "520 kcal", protein: "32g", carbs: "38g", fat: "28g" }
      }
    },
    {
      id: "swamp-potatoes-sausage",
      title: "Swamp Potatoes and Sausage",
      rating: "4.8",
      ratingsCount: "1.8k",
      image: "/images/allrecipes/11763852-Swamp-Potatoes-and-Sausage-Peyton-Beckwith-4x3-2f22e1bca59c457abc798120d1ab620d.jpg",
      category: "SOUTHERN SKILLET",
      recipeData: {
        id: "swamp-potatoes-sausage",
        title: "Smoky Cajun Swamp Potatoes and Sausage",
        description: "Tender cubed potatoes simmered in a rich Cajun-spiced garlic butter sauce with smoky andouille sausage, sweet peppers, and sweet corn medallions.",
        image_url: "/images/allrecipes/11763852-Swamp-Potatoes-and-Sausage-Peyton-Beckwith-4x3-2f22e1bca59c457abc798120d1ab620d.jpg",
        prep_time_minutes: 15,
        cook_time_minutes: 30,
        total_time_minutes: 45,
        servings: 6,
        difficulty: "Easy" as const,
        cuisine: "Budget Cooking Recipes",
        tags: ["Nicole's Perfect Bite", "One-Pan", "Southern Comfort"],
        is_clone_recipe: false,
        secret_hacks: ["Par-microwave potatoes for 4 minutes so they develop a golden sear in the skillet without burning the garlic butter"],
        ingredients: [
          { name: "Smoked Andouille sausage, sliced", amount: "1", unit: "lb" },
          { name: "Yukon gold potatoes, cubed", amount: "2", unit: "lbs" },
          { name: "Cajun seasoning", amount: "2", unit: "tbsp" },
          { name: "Butter & minced garlic", amount: "4", unit: "tbsp" }
        ],
        instructions: [
          "Brown sausage in cast-iron skillet, remove and reserve dripping.",
          "Sear potatoes in drippings with butter and Cajun spice until tender.",
          "Toss sausage back in and simmer with broth for 10 minutes."
        ],
        nutrition: { calories: "440 kcal", protein: "22g", carbs: "36g", fat: "24g" }
      }
    },
    {
      id: "mississippi-chicken-spaghetti",
      title: "Stick of Butter Mississippi Chicken Spaghetti",
      rating: "4.9",
      ratingsCount: "3.1k",
      image: "/images/allrecipes/11785800-Mississippi-Chicken-Spaghetti-Beauty-4x3-a7bc1ed3c7ad4f9d94b464aa909fee8d.jpg",
      category: "PASTA CASSEROLE",
      recipeData: {
        id: "mississippi-chicken-spaghetti",
        title: "Stick of Butter Mississippi Chicken Spaghetti",
        description: "Tender shredded chicken and spaghetti baked in an ultra-luxurious sauce made with a whole stick of butter, cream of chicken, ranch seasoning, tangy pepperoncini, and melted Monterey Jack.",
        image_url: "/images/allrecipes/11785800-Mississippi-Chicken-Spaghetti-Beauty-4x3-a7bc1ed3c7ad4f9d94b464aa909fee8d.jpg",
        prep_time_minutes: 20,
        cook_time_minutes: 30,
        total_time_minutes: 50,
        servings: 8,
        difficulty: "Easy" as const,
        cuisine: "Budget Cooking Recipes",
        tags: ["Nicole's Perfect Bite", "Pasta", "Weeknight Dinner"],
        is_clone_recipe: false,
        secret_hacks: ["Add 3 tablespoons of tangy pepperoncini brine directly to the cream sauce to cut through the rich butteriness"],
        ingredients: [
          { name: "Spaghetti pasta, cooked al dente", amount: "1", unit: "lb" },
          { name: "Shredded rotisserie chicken", amount: "3", unit: "cups" },
          { name: "Unsalted butter", amount: "1", unit: "stick" },
          { name: "Ranch seasoning packet", amount: "1", unit: "packet" },
          { name: "Sliced pepperoncini peppers", amount: "1/2", unit: "cup" },
          { name: "Monterey Jack cheese", amount: "2", unit: "cups" }
        ],
        instructions: [
          "Melt butter in a large pot, whisk in cream of chicken and ranch seasoning.",
          "Fold in shredded chicken, pepperoncini, and cooked spaghetti.",
          "Transfer to 9x13 baking dish, top with Monterey Jack, bake at 350°F for 30 mins."
        ],
        nutrition: { calories: "560 kcal", protein: "36g", carbs: "48g", fat: "26g" }
      }
    },
    {
      id: "hawaiian-roll-donuts",
      title: "Apple Cider Hawaiian Roll Donuts",
      rating: "4.9",
      ratingsCount: "1.5k",
      image: "/images/allrecipes/11786958-Apple-Cider-Hawaiian-Roll-Donuts-DDMFS-Beauty-4x3-eb340c9789354d3e923e53df2b4759de.jpg",
      category: "SWEET TREATS",
      recipeData: {
        id: "hawaiian-roll-donuts",
        title: "15-Minute Apple Cider Hawaiian Roll Donuts",
        description: "Sweet Hawaiian sweet rolls fried to golden perfection, dipped in spiced reduced apple cider butter, and rolled generously in cinnamon sugar.",
        image_url: "/images/allrecipes/11786958-Apple-Cider-Hawaiian-Roll-Donuts-DDMFS-Beauty-4x3-eb340c9789354d3e923e53df2b4759de.jpg",
        prep_time_minutes: 10,
        cook_time_minutes: 10,
        total_time_minutes: 20,
        servings: 12,
        difficulty: "Easy" as const,
        cuisine: "Budget Cooking Recipes",
        tags: ["Nicole's Perfect Bite", "Dessert", "15-Min Treat"],
        is_clone_recipe: true,
        secret_hacks: ["Reduce 1 cup of apple cider on high heat down to 3 tablespoons for intense orchard apple essence"],
        ingredients: [
          { name: "King's Hawaiian sweet rolls", amount: "1", unit: "pack (12 rolls)" },
          { name: "Pure apple cider", amount: "1", unit: "cup (reduced)" },
          { name: "Melted butter", amount: "4", unit: "tbsp" },
          { name: "Granulated sugar & cinnamon", amount: "1", unit: "cup" }
        ],
        instructions: [
          "Cut holes in center of rolls, fry in 350°F oil for 1 min per side.",
          "Brush with warm cider butter, dredge immediately in cinnamon sugar."
        ],
        nutrition: { calories: "230 kcal", protein: "3g", carbs: "34g", fat: "9g" }
      }
    },
  ];

  const featuredDinnerRecipe: Recipe = {
    id: "50-dollar-grocery-budget-dinners",
    title: "3 Easy Dinner Recipes To Make With $50 Worth of Groceries",
    description: "Allrecipes chef Nicole McLaughlin shares how to stretch a single $50 grocery haul into three cozy, crowd-pleasing skillet and pasta dinners without sacrificing flavor or quality.",
    image_url: "/images/allrecipes/ar-1-bag-3-dinners-ar-peyton-beckwith-4x3-4d72f7a3633f4955a0812e6e23785088.jpg",
    prep_time_minutes: 25,
    cook_time_minutes: 35,
    total_time_minutes: 60,
    servings: 6,
    difficulty: "Easy",
    cuisine: "Budget Cooking Recipes",
    tags: ["Nicole's Perfect Bite", "Budget Cooking", "Family Meals"],
    is_clone_recipe: false,
    secret_hacks: [
      "Buy bone-in chicken thighs and save the bones in the freezer for homemade rich stock",
      "Cook your pasta directly in the simmering cheesy skillet sauce to absorb all seasoned starches"
    ],
    ingredients: [
      { name: "Skillet pasta noodles", amount: "1", unit: "lb" },
      { name: "Rotisserie or roasted chicken thighs", amount: "1.5", unit: "lbs" },
      { name: "Fresh green scallions & parsley", amount: "1", unit: "bunch" },
      { name: "Sharp cheddar & Monterey Jack", amount: "3", unit: "cups" }
    ],
    instructions: [
      "Sear chicken in deep skillet, saute aromatics, add broth and noodles.",
      "Simmer covered until noodles are tender and sauce is creamy.",
      "Fold in cheese and scallions, broil 2 minutes for golden top."
    ],
    nutrition: { calories: "510 kcal", protein: "38g", carbs: "42g", fat: "22g" }
  };

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-2 border-stone-200 pb-3">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight flex items-center gap-3 group cursor-pointer">
          <span>👩‍🍳 Nicole&apos;s Perfect Bite</span>
          <ArrowRight className="h-6 w-6 text-[#e25b27] group-hover:translate-x-1.5 transition-transform" />
        </h2>
        <span className="text-xs font-black text-[#e25b27] uppercase tracking-wider">
          Chef Spotlight
        </span>
      </div>

      {/* Main Grid: Left 4 Stacked Thumbnails + Right Featured Skillet with Chef */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 cols): 4 Stacked Mini Cards */}
        <div className="lg:col-span-5 divide-y divide-stone-200 space-y-3">
          {leftCards.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectRecipe(item.recipeData)}
              className="group flex items-center gap-4 pt-3 first:pt-0 cursor-pointer"
            >
              {/* Thumbnail with Heart button */}
              <div className="relative h-24 w-28 sm:h-26 sm:w-32 shrink-0 overflow-hidden rounded-2xl bg-stone-100 shadow-2xs">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="128px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave(item.id);
                  }}
                  className={`absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full shadow-xs transition ${
                    savedIds.includes(item.id)
                      ? "bg-[#e25b27] text-white"
                      : "bg-white/90 text-stone-700 hover:text-[#e25b27]"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${savedIds.includes(item.id) ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Text Info */}
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug group-hover:underline">
                  {item.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
                  <div className="flex text-[#e25b27]">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                  </div>
                  <span className="text-stone-500 font-semibold">({item.ratingsCount} Ratings)</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column (7 cols): Large Featured Skillet Dish with Nicole smiling with grocery bag */}
        <div
          onClick={() => onSelectRecipe(featuredDinnerRecipe)}
          className="lg:col-span-7 group cursor-pointer space-y-4"
        >
          <div className="relative aspect-[16/11] w-full overflow-hidden rounded-3xl bg-stone-100 shadow-sm">
            <Image
              src={featuredDinnerRecipe.image_url}
              alt={featuredDinnerRecipe.title}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(featuredDinnerRecipe.id);
              }}
              className={`absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition ${
                savedIds.includes(featuredDinnerRecipe.id)
                  ? "bg-[#e25b27] text-white"
                  : "bg-white/95 text-stone-800 hover:text-[#e25b27]"
              }`}
            >
              <Heart
                className={`h-5 w-5 ${
                  savedIds.includes(featuredDinnerRecipe.id) ? "fill-current" : ""
                }`}
              />
            </button>
          </div>

          <div className="space-y-2 pt-1">
            <div className="text-xs font-black uppercase tracking-wider text-stone-500">
              BUDGET COOKING RECIPES
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 group-hover:underline leading-tight tracking-tight">
              {featuredDinnerRecipe.title}
            </h3>
            <p className="text-base text-stone-600 font-normal leading-relaxed">
              {featuredDinnerRecipe.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

