"use client";

import React from "react";
import Image from "next/image";
import { Recipe } from "@/types/recipe";
import { Star, Heart, ArrowRight } from "lucide-react";

interface SidesSectionProps {
  recipes?: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const SidesSection: React.FC<SidesSectionProps> = ({
  recipes,
  onSelectRecipe,
  savedIds,
  onToggleSave,
}) => {
  const sidesList = [
    {
      id: "best-mashed-potatoes",
      title: "Best Mashed Potatoes",
      category: "MASHED POTATO RECIPES",
      rating: "4.9",
      ratingsCount: "2.8k",
      image: "/images/allrecipes/24771-basic-mashed-potatoes-PICS-Beauty-3x2-8ffd8f88eab24eb380fc809bbb53e404.jpg",
      recipeData: {
        id: "best-mashed-potatoes",
        title: "Chef's Velvet Garlic & Butter Mashed Potatoes",
        description: "Fluffy Yukon Gold potatoes passed through a ricer, whipped with steaming heavy cream, melted butter, roasted garlic, and a hint of white pepper.",
        image_url: "/images/allrecipes/24771-basic-mashed-potatoes-PICS-Beauty-3x2-8ffd8f88eab24eb380fc809bbb53e404.jpg",
        prep_time_minutes: 15,
        cook_time_minutes: 25,
        total_time_minutes: 40,
        servings: 8,
        difficulty: "Easy" as const,
        cuisine: "Popular Sides & Casseroles",
        tags: ["Holiday Sides", "Comfort Food", "Gluten-Free"],
        is_clone_recipe: false,
        secret_hacks: ["Dry out the boiled potato cubes on low heat in the empty pot for 2 minutes before mashing to remove moisture"],
        ingredients: [
          { name: "Yukon Gold potatoes, peeled and cubed", amount: "5", unit: "lbs" },
          { name: "Unsalted butter, softened", amount: "1", unit: "cup" },
          { name: "Heavy whipping cream, warm", amount: "1", unit: "cup" },
          { name: "Roasted garlic cloves", amount: "6", unit: "cloves" }
        ],
        instructions: [
          "Boil potatoes in salted water until fork tender, drain thoroughly.",
          "Dry in warm pot, pass through ricer.",
          "Fold in warm cream, melted butter, and roasted garlic until silk smooth."
        ],
        nutrition: { calories: "320 kcal", protein: "4g", carbs: "38g", fat: "18g" }
      }
    },
    {
      id: "yummy-sweet-potato-casserole",
      title: "Yummy Sweet Potato Casserole",
      category: "SWEET POTATO CASSEROLE RECIPES",
      rating: "5.0",
      ratingsCount: "4.2k",
      image: "/images/allrecipes/21261-yummy-sweet-potato-casserole-PreethiVenkatramAllrecipes-4x3-d4a57286ea07483fb0cc386f5def07a5.jpg",
      recipeData: {
        id: "yummy-sweet-potato-casserole",
        title: "Pecan Streusel Brown Sugar Sweet Potato Casserole",
        description: "Smooth spiced sweet potato souffle baked with a crisp, crunchy brown sugar and roasted pecan butter crumble on top.",
        image_url: "/images/allrecipes/21261-yummy-sweet-potato-casserole-PreethiVenkatramAllrecipes-4x3-d4a57286ea07483fb0cc386f5def07a5.jpg",
        prep_time_minutes: 20,
        cook_time_minutes: 35,
        total_time_minutes: 55,
        servings: 10,
        difficulty: "Easy" as const,
        cuisine: "Popular Sides & Casseroles",
        tags: ["Holiday Sides", "Thanksgiving", "Sweet Potatoes"],
        is_clone_recipe: false,
        secret_hacks: ["Roast sweet potatoes whole in their skins instead of boiling to concentrate natural sugars"],
        ingredients: [
          { name: "Roasted sweet potatoes, mashed", amount: "4", unit: "cups" },
          { name: "Brown sugar", amount: "1", unit: "cup" },
          { name: "Chopped pecans", amount: "1.5", unit: "cups" },
          { name: "Pure vanilla & nutmeg", amount: "1", unit: "tsp" }
        ],
        instructions: [
          "Whip sweet potatoes with butter, milk, vanilla, and eggs.",
          "Spread in baking dish, top with pecan brown sugar crumble.",
          "Bake at 350°F for 35 minutes until golden and bubbling."
        ],
        nutrition: { calories: "380 kcal", protein: "4g", carbs: "52g", fat: "18g" }
      }
    },
    {
      id: "best-homemade-stuffing",
      title: "Best Homemade Stuffing",
      category: "BREAD STUFFING AND DRESSING RECIPES",
      rating: "4.8",
      ratingsCount: "1.9k",
      image: "/images/allrecipes/23412-old-fashioned-stuffing-VAT-010-4x3-c1cf03bc7d20494d81d8e536380bcdfe.jpg",
      recipeData: {
        id: "best-homemade-stuffing",
        title: "Traditional Golden Herb & Sausage Stuffing",
        description: "Crispy-edged toasted sourdough and brioche bread cubes tossed with sage, fresh thyme, caramelized onions, celery, and savory herb broth.",
        image_url: "/images/allrecipes/23412-old-fashioned-stuffing-VAT-010-4x3-c1cf03bc7d20494d81d8e536380bcdfe.jpg",
        prep_time_minutes: 25,
        cook_time_minutes: 45,
        total_time_minutes: 70,
        servings: 10,
        difficulty: "Medium" as const,
        cuisine: "Popular Sides & Casseroles",
        tags: ["Holiday Sides", "Thanksgiving", "Bread Dressing"],
        is_clone_recipe: false,
        secret_hacks: ["Dry your bread cubes in a 250°F oven until bone-dry so they drink up rich broth without getting mushy"],
        ingredients: [
          { name: "Dried sourdough & brioche bread cubes", amount: "12", unit: "cups" },
          { name: "Fresh sage & thyme leaves", amount: "3", unit: "tbsp" },
          { name: "Rich poultry broth", amount: "3", unit: "cups" },
          { name: "Finely diced celery and onion", amount: "2", unit: "cups" }
        ],
        instructions: [
          "Saute celery and onions in butter with fresh herbs until aromatic.",
          "Toss bread cubes with herb mixture and warm broth.",
          "Bake covered at 375°F for 30 mins, uncover for 15 mins for crispy top."
        ],
        nutrition: { calories: "290 kcal", protein: "6g", carbs: "38g", fat: "12g" }
      }
    },
    {
      id: "green-bean-casserole",
      title: "Classic French Onion Green Bean Casserole",
      category: "CASSEROLE RECIPES",
      rating: "4.9",
      ratingsCount: "3.1k",
      image: "/images/allrecipes/ALR-13660-green-bean-casserole-i-VAT-4x3-c6fafe7e10c1430e9965a40e814b8840.jpg",
      recipeData: {
        id: "green-bean-casserole",
        title: "Crispy French Onion Creamy Green Bean Casserole",
        description: "Crisp-tender green beans folded in a rich creamy mushroom garlic sauce, topped with an extra thick mound of crunchy fried onions.",
        image_url: "/images/allrecipes/ALR-13660-green-bean-casserole-i-VAT-4x3-c6fafe7e10c1430e9965a40e814b8840.jpg",
        prep_time_minutes: 15,
        cook_time_minutes: 30,
        total_time_minutes: 45,
        servings: 8,
        difficulty: "Easy" as const,
        cuisine: "Popular Sides & Casseroles",
        tags: ["Holiday Sides", "Green Beans", "Casseroles"],
        is_clone_recipe: true,
        secret_hacks: ["Blanch fresh green beans in ice water first so they stay vibrant green and maintain a snappy crunch"],
        ingredients: [
          { name: "Fresh green beans, trimmed", amount: "2", unit: "lbs" },
          { name: "French fried onions", amount: "2", unit: "cups" },
          { name: "Cream of mushroom with garlic", amount: "2", unit: "cans" },
          { name: "Soy sauce & Worcestershire", amount: "1", unit: "tbsp" }
        ],
        instructions: [
          "Blanch green beans, mix with mushroom soup, soy sauce, and 1 cup onions.",
          "Bake at 350°F for 25 mins, top with remaining onions and bake 5 mins more."
        ],
        nutrition: { calories: "210 kcal", protein: "4g", carbs: "22g", fat: "12g" }
      }
    },
    {
      id: "homemade-cranberry-sauce",
      title: "Fresh Orange Cranberry Sauce",
      category: "SAUCE RECIPES",
      rating: "4.8",
      ratingsCount: "1.4k",
      image: "/images/allrecipes/9111-cranberry-sauce-DDMFS-4x3-09d16e1a548145cea22d7d43f04c44d8.jpg",
      recipeData: {
        id: "homemade-cranberry-sauce",
        title: "Zesty Blood Orange & Spiced Cranberry Sauce",
        description: "Fresh tart cranberries burst in a simmering bath of fresh orange juice, ruby zest, cinnamon stick, and pure cane sugar.",
        image_url: "/images/allrecipes/9111-cranberry-sauce-DDMFS-4x3-09d16e1a548145cea22d7d43f04c44d8.jpg",
        prep_time_minutes: 10,
        cook_time_minutes: 15,
        total_time_minutes: 25,
        servings: 10,
        difficulty: "Easy" as const,
        cuisine: "Popular Sides & Casseroles",
        tags: ["Holiday Sides", "Sauces", "Quick"],
        is_clone_recipe: false,
        secret_hacks: ["Add a pinch of salt and a splash of bourbon at the end to round out the tartness"],
        ingredients: [
          { name: "Fresh cranberries", amount: "12", unit: "oz" },
          { name: "Fresh orange juice & zest", amount: "1/2", unit: "cup" },
          { name: "Granulated sugar", amount: "3/4", unit: "cup" }
        ],
        instructions: [
          "Combine juice, zest, and sugar in saucepan, bring to boil.",
          "Add cranberries and simmer 10 mins until berries burst.",
          "Cool completely to thicken into jelly."
        ],
        nutrition: { calories: "110 kcal", protein: "0g", carbs: "28g", fat: "0g" }
      }
    },
    {
      id: "ultra-cheesy-mac-and-cheese",
      title: "Ultra-Cheesy Homemade Mac & Cheese",
      category: "PASTA CASSEROLES",
      rating: "5.0",
      ratingsCount: "6.5k",
      image: "/images/allrecipes/11679-homemade-mac-and-cheese-VAT-022-4x3-4b84cfe8a2234cfda3d936a5333fe292.jpg",
      recipeData: {
        id: "ultra-cheesy-mac-and-cheese",
        title: "Southern Three-Cheese Baked Macaroni & Cheese",
        description: "Elbow pasta drenched in a rich roux-based cheddar, Gruyere, and Colby Jack cheese sauce, baked with a golden bubbling cheese crust.",
        image_url: "/images/allrecipes/11679-homemade-mac-and-cheese-VAT-022-4x3-4b84cfe8a2234cfda3d936a5333fe292.jpg",
        prep_time_minutes: 20,
        cook_time_minutes: 30,
        total_time_minutes: 50,
        servings: 8,
        difficulty: "Easy" as const,
        cuisine: "Popular Sides & Casseroles",
        tags: ["Holiday Sides", "Comfort Food", "Pasta"],
        is_clone_recipe: true,
        secret_hacks: ["Shred your own cheese blocks: pre-shredded cheese contains cellulose that prevents a silky smooth melt"],
        ingredients: [
          { name: "Elbow macaroni, cooked al dente", amount: "1", unit: "lb" },
          { name: "Sharp yellow cheddar, shredded", amount: "3", unit: "cups" },
          { name: "Gruyere cheese, shredded", amount: "1.5", unit: "cups" },
          { name: "Whole milk & heavy cream", amount: "3", unit: "cups" }
        ],
        instructions: [
          "Make a butter-flour roux, whisk in milk and simmer until thick.",
          "Melt in shredded cheeses, fold in cooked macaroni.",
          "Pour into baking dish, top with extra cheese, bake at 375°F for 25 mins."
        ],
        nutrition: { calories: "580 kcal", protein: "24g", carbs: "52g", fat: "32g" }
      }
    },
  ];

  const displayedSides = recipes?.length
    ? recipes.map((recipe, index) => ({
        id: recipe.id,
        title: recipe.title,
        category: (recipe.cuisine || recipe.tags[0] || "Sides & Casseroles").toUpperCase(),
        rating: ["4.9", "5.0", "4.8"][index % 3],
        ratingsCount: ["2.8k", "4.2k", "1.9k"][index % 3],
        image: recipe.image_url,
        recipeData: recipe,
      }))
    : sidesList;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-stone-200 pb-3">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight flex items-center gap-3 group cursor-pointer">
          <span>🥔 Popular Holiday Sides & Comfort Casseroles</span>
          <ArrowRight className="h-6 w-6 text-[#e25b27] group-hover:translate-x-1.5 transition-transform" />
        </h2>
        <span className="text-xs font-black text-[#e25b27] uppercase tracking-wider">
          Crowd Pleasers
        </span>
      </div>

      {/* Grid: 6 borderless large cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedSides.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectRecipe(item.recipeData)}
            className="group flex flex-col cursor-pointer transition-transform duration-200"
          >
            {/* Image */}
            <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl bg-stone-100 shadow-2xs">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(item.id);
                }}
                className={`absolute top-3.5 right-3.5 flex h-9 w-9 items-center justify-center rounded-full shadow-md transition ${
                  savedIds.includes(item.id)
                    ? "bg-[#e25b27] text-white"
                    : "bg-white/95 text-stone-700 hover:text-[#e25b27]"
                }`}
              >
                <Heart className={`h-5 w-5 ${savedIds.includes(item.id) ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Typography */}
            <div className="pt-3 space-y-1.5">
              <div className="text-xs font-black uppercase tracking-wider text-stone-500">
                {item.category}
              </div>
              <h3 className="text-xl font-black text-stone-900 leading-snug group-hover:underline">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 text-sm font-bold text-stone-700 pt-0.5">
                <div className="flex text-[#e25b27]">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <span className="font-extrabold text-stone-900">{item.rating}</span>
                <span className="text-stone-500 font-semibold">({item.ratingsCount} Ratings)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

