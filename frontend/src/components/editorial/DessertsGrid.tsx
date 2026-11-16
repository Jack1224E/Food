"use client";

import React from "react";
import Image from "next/image";
import { Recipe } from "@/types/recipe";
import { Star, Heart, ArrowRight } from "lucide-react";

interface DessertsGridProps {
  recipes?: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const DessertsGrid: React.FC<DessertsGridProps> = ({
  recipes,
  onSelectRecipe,
  savedIds,
  onToggleSave,
}) => {
  const desserts: {
    id: string;
    title: string;
    category: string;
    rating: string;
    ratingsCount: string;
    image: string;
    recipeData: Recipe;
  }[] = [
    {
      id: "pumpkin-dump-cake",
      title: "Pumpkin Dump Cake",
      category: "PUMPKIN CAKE RECIPES",
      rating: "4.9",
      ratingsCount: "2.1k",
      image: "/images/allrecipes/26060-pumpkin-dump-cake-PICS-Beauty-3x2-f88bf3dc93b14c55b03846c0a1cb8ead.jpg",
      recipeData: {
        id: "pumpkin-dump-cake",
        title: "Classic Spiced Pumpkin Dump Cake",
        description: "An effortless autumnal crowd-pleaser: rich spiced pumpkin custard topped with crunchy yellow cake mix, melted butter, and toasted pecans.",
        image_url: "/images/allrecipes/26060-pumpkin-dump-cake-PICS-Beauty-3x2-f88bf3dc93b14c55b03846c0a1cb8ead.jpg",
        prep_time_minutes: 10,
        cook_time_minutes: 50,
        total_time_minutes: 60,
        servings: 12,
        difficulty: "Easy",
        cuisine: "Desserts & Bakery",
        tags: ["Desserts", "Thanksgiving", "Cakes"],
        is_clone_recipe: false,
        secret_hacks: ["Drizzle cold thinly sliced butter evenly over every square inch of dry cake mix to ensure zero dry flour spots"],
        ingredients: [
          { name: "Canned pure pumpkin puree", amount: "15", unit: "oz" },
          { name: "Evaporated milk", amount: "12", unit: "oz" },
          { name: "Yellow cake mix", amount: "1", unit: "box" },
          { name: "Unsalted butter, sliced thin", amount: "1", unit: "cup" },
          { name: "Chopped pecans", amount: "1", unit: "cup" },
          { name: "Pumpkin pie spice", amount: "1.5", unit: "tsp" }
        ],
        instructions: [
          "Whisk pumpkin puree, evaporated milk, eggs, sugar, and spice in bowl.",
          "Pour into greased 9x13 dish, sprinkle dry cake mix over top.",
          "Layer sliced butter and pecans on top, bake at 350°F for 55 mins until golden."
        ],
        nutrition: { calories: "360 kcal", protein: "4g", carbs: "48g", fat: "18g" }
      }
    },
    {
      id: "easy-chocolate-cream-pie",
      title: "Easy Chocolate Cream Pie",
      category: "NO-BAKE PIE RECIPES",
      rating: "4.8",
      ratingsCount: "3.4k",
      image: "/images/allrecipes/12154-chocolate-cream-pie-i-DDMFS-4x3-14890-498a3bb4688e4ea69d6cf668b4101402.jpg",
      recipeData: {
        id: "easy-chocolate-cream-pie",
        title: "Silky No-Bake Chocolate Cream Pie",
        description: "Velvety dark chocolate pudding poured into a buttery flaky crust, crowned with billowing homemade vanilla whipped cream and dark chocolate curls.",
        image_url: "/images/allrecipes/12154-chocolate-cream-pie-i-DDMFS-4x3-14890-498a3bb4688e4ea69d6cf668b4101402.jpg",
        prep_time_minutes: 20,
        cook_time_minutes: 0,
        total_time_minutes: 20,
        servings: 8,
        difficulty: "Easy",
        cuisine: "Desserts & Bakery",
        tags: ["Desserts", "Pies", "Chocolate"],
        is_clone_recipe: true,
        secret_hacks: ["Fold in 2 ounces of melted 70% dark bittersweet chocolate into the pudding base for deep gourmet flavor"],
        ingredients: [
          { name: "Baked 9-inch pastry pie crust", amount: "1", unit: "crust" },
          { name: "Whole milk", amount: "2.5", unit: "cups" },
          { name: "Semi-sweet chocolate chips", amount: "1", unit: "cup" },
          { name: "Heavy whipping cream", amount: "1.5", unit: "cups" }
        ],
        instructions: [
          "Cook chocolate custard on medium until thickened, pour into crust.",
          "Chill in refrigerator for 4 hours until firmly set.",
          "Top with whipped cream and chocolate shavings."
        ],
        nutrition: { calories: "410 kcal", protein: "6g", carbs: "44g", fat: "24g" }
      }
    },
    {
      id: "peanut-butter-pie",
      title: "Peanut Butter Pie",
      category: "PEANUT BUTTER PIE RECIPES",
      rating: "5.0",
      ratingsCount: "4.2k",
      image: "/images/allrecipes/9174-peanut-butter-pie-pics_0166_3x2-bec7ecfe6dfc48feae78469abb9db5af.jpeg",
      recipeData: {
        id: "peanut-butter-pie",
        title: "Fluffy Reese's Peanut Butter Cream Pie",
        description: "An irresistible cloud-like peanut butter mousse filling loaded inside an Oreo cookie crust, topped with fresh whipped cream and chopped peanut butter cups.",
        image_url: "/images/allrecipes/9174-peanut-butter-pie-pics_0166_3x2-bec7ecfe6dfc48feae78469abb9db5af.jpeg",
        prep_time_minutes: 15,
        cook_time_minutes: 0,
        total_time_minutes: 15,
        servings: 10,
        difficulty: "Easy",
        cuisine: "Desserts & Bakery",
        tags: ["Desserts", "Pies", "No-Bake"],
        is_clone_recipe: true,
        secret_hacks: ["Beat cream cheese and peanut butter until completely fluffy before folding whipped topping to avoid clumps"],
        ingredients: [
          { name: "Creamy peanut butter", amount: "1", unit: "cup" },
          { name: "Cream cheese, softened", amount: "8", unit: "oz" },
          { name: "Powdered sugar", amount: "1", unit: "cup" },
          { name: "Chocolate cookie crust", amount: "1", unit: "crust" }
        ],
        instructions: [
          "Beat peanut butter, cream cheese, and sugar until fluffy.",
          "Fold in whipped cream, spoon into crust, chill 2 hours."
        ],
        nutrition: { calories: "480 kcal", protein: "10g", carbs: "38g", fat: "32g" }
      }
    },
    {
      id: "gingersnap-pumpkin-trifle",
      title: "Gingersnap Pumpkin Trifle",
      category: "TRIFLE RECIPES",
      rating: "4.9",
      ratingsCount: "1.8k",
      image: "/images/allrecipes/240146_gingersnap-pumpkin-trifle-4x3-f4025525b4ce4384afb13c488255622e.jpg",
      recipeData: {
        id: "gingersnap-pumpkin-trifle",
        title: "Layered Spiced Gingersnap Pumpkin Trifle",
        description: "Showstopping layers of crunchy spiced gingersnap cookies, silky cinnamon pumpkin mousse, and sweet vanilla mascarpone cream.",
        image_url: "/images/allrecipes/240146_gingersnap-pumpkin-trifle-4x3-f4025525b4ce4384afb13c488255622e.jpg",
        prep_time_minutes: 25,
        cook_time_minutes: 0,
        total_time_minutes: 25,
        servings: 12,
        difficulty: "Easy",
        cuisine: "Desserts & Bakery",
        tags: ["Desserts", "Showstoppers", "Holiday"],
        is_clone_recipe: false,
        secret_hacks: ["Let the trifle sit chilled for at least 6 hours so the gingersnap cookies soften into cake-like texture"],
        ingredients: [
          { name: "Crispy gingersnap cookies", amount: "1", unit: "package" },
          { name: "Pumpkin puree", amount: "15", unit: "oz" },
          { name: "Vanilla pudding", amount: "2", unit: "boxes" },
          { name: "Whipped topping", amount: "3", unit: "cups" }
        ],
        instructions: [
          "Mix pumpkin with prepared vanilla pudding and spices.",
          "Layer cookies, pumpkin mousse, and whipped cream in trifle glass.",
          "Repeat layers and finish with crushed gingersnaps and pecans."
        ],
        nutrition: { calories: "320 kcal", protein: "4g", carbs: "46g", fat: "14g" }
      }
    },
    {
      id: "old-fashioned-apple-crisp",
      title: "Apple Crisp",
      category: "APPLE CRISPS AND CRUMBLES RECIPES",
      rating: "4.9",
      ratingsCount: "5.1k",
      image: "/images/allrecipes/12409-apple-crisp-II-MFS-033-beauty1-4x3-e7f6d6c193484e0daa43e571723ff16e.jpg",
      recipeData: {
        id: "old-fashioned-apple-crisp",
        title: "Warm Golden Old-Fashioned Apple Crisp",
        description: "Tender caramelized Honeycrisp apple slices tossed in cinnamon and brown sugar, blanketed by a crispy, buttery golden rolled oat streusel and vanilla bean ice cream.",
        image_url: "/images/allrecipes/12409-apple-crisp-II-MFS-033-beauty1-4x3-e7f6d6c193484e0daa43e571723ff16e.jpg",
        prep_time_minutes: 20,
        cook_time_minutes: 40,
        total_time_minutes: 60,
        servings: 8,
        difficulty: "Easy",
        cuisine: "Desserts & Bakery",
        tags: ["Desserts", "Apple Crisp", "Fall Comfort"],
        is_clone_recipe: false,
        secret_hacks: ["Toss apples with a splash of fresh lemon juice and 1 tbsp cornstarch so the bubbling juices form a thick caramel sauce"],
        ingredients: [
          { name: "Tart & sweet apples (peeled and sliced)", amount: "6", unit: "cups" },
          { name: "Rolled oats", amount: "1", unit: "cup" },
          { name: "All-purpose flour", amount: "1", unit: "cup" },
          { name: "Brown sugar", amount: "1", unit: "cup" },
          { name: "Cold butter, cubed", amount: "1/2", unit: "cup" }
        ],
        instructions: [
          "Toss sliced apples with cinnamon and place in baking dish.",
          "Mix oats, flour, brown sugar, and cut in butter until crumbly.",
          "Scatter over apples and bake at 375°F for 40 mins until bubbling."
        ],
        nutrition: { calories: "340 kcal", protein: "3g", carbs: "56g", fat: "12g" }
      }
    },
    {
      id: "simple-pumpkin-pie",
      title: "Simple Pumpkin Pie",
      category: "CANNED PUMPKIN RECIPES",
      rating: "4.8",
      ratingsCount: "2.9k",
      image: "/images/allrecipes/229932-Simple-Pumpkin-Pie-VAT-Beauty-3x2-bc0cda7f87ab41cdade2de88b49e7e66.jpg",
      recipeData: {
        id: "simple-pumpkin-pie",
        title: "Traditional Blue-Ribbon Simple Pumpkin Pie",
        description: "The time-honored traditional spiced custard pie with a silken texture, warm nutmeg and ginger notes, and a flaky all-butter pastry crust.",
        image_url: "/images/allrecipes/229932-Simple-Pumpkin-Pie-VAT-Beauty-3x2-bc0cda7f87ab41cdade2de88b49e7e66.jpg",
        prep_time_minutes: 15,
        cook_time_minutes: 55,
        total_time_minutes: 70,
        servings: 8,
        difficulty: "Easy",
        cuisine: "Desserts & Bakery",
        tags: ["Desserts", "Thanksgiving", "Pies"],
        is_clone_recipe: false,
        secret_hacks: ["Bake for the first 15 minutes at 425°F, then reduce heat to 350°F to guarantee a crisp bottom crust with no sogginess"],
        ingredients: [
          { name: "Pure pumpkin puree", amount: "15", unit: "oz" },
          { name: "Sweetened condensed milk", amount: "14", unit: "oz" },
          { name: "Large eggs", amount: "2", unit: "eggs" },
          { name: "Pumpkin pie spice", amount: "1.5", unit: "tsp" },
          { name: "Unbaked 9-inch pie crust", amount: "1", unit: "crust" }
        ],
        instructions: [
          "Whisk pumpkin, condensed milk, eggs, and spice together.",
          "Pour into pie crust, bake 15 mins at 425°F, then 40 mins at 350°F.",
          "Cool completely before slicing."
        ],
        nutrition: { calories: "310 kcal", protein: "6g", carbs: "42g", fat: "13g" }
      }
    },
  ];

  const displayedDesserts = recipes?.length
    ? recipes.map((recipe, index) => ({
        id: recipe.id,
        title: recipe.title,
        category: (recipe.cuisine || recipe.tags[0] || "Desserts & Bakery").toUpperCase(),
        rating: ["4.9", "4.8", "5.0"][index % 3],
        ratingsCount: ["2.1k", "3.4k", "1.8k"][index % 3],
        image: recipe.image_url,
        recipeData: recipe,
      }))
    : desserts;

  return (
    <section id="desserts-section" className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b-2 border-stone-200 pb-3">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight flex items-center gap-3 group cursor-pointer">
          <span>🍰 Easy Thanksgiving Desserts</span>
          <ArrowRight className="h-6 w-6 text-[#e25b27] group-hover:translate-x-1.5 transition-transform" />
        </h2>
        <span className="text-xs font-black text-[#e25b27] uppercase tracking-wider">
          Sweet Cravings
        </span>
      </div>

      {/* 3x2 Grid (Exact match of screenshot 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedDesserts.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectRecipe(item.recipeData)}
            className="group flex flex-col cursor-pointer transition-transform duration-200"
          >
            {/* Borderless Large Food Image */}
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

