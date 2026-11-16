"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Navbar } from "@/components/ui/Navbar";
import { Hero3DCanvas } from "@/components/3d/Hero3DCanvas";
import { HeroSearch } from "@/components/search/HeroSearch";
import { RecipeCard } from "@/components/feed/RecipeCard";
import { RecipeModal } from "@/components/feed/RecipeModal";
import { CommunitySection } from "@/components/community/CommunitySection";
import { FeaturedBanner } from "@/components/editorial/FeaturedBanner";
import { ChefSpotlight } from "@/components/editorial/ChefSpotlight";
import { HappyDipsBanner } from "@/components/editorial/HappyDipsBanner";
import { DessertsGrid } from "@/components/editorial/DessertsGrid";
import { NewsSection } from "@/components/editorial/NewsSection";
import { SidesSection } from "@/components/editorial/SidesSection";
import {
  ALL_CURATED_RECIPES,
  fetchEditorialFeed,
  searchRecipes,
  sleuthRecipeLive,
  type EditorialResponse,
} from "@/lib/api";
import { Recipe } from "@/types/recipe";
import { Star, Heart, Clock, Sparkles, ArrowRight, Flame, Search, X, Loader2, Globe, CalendarDays } from "lucide-react";

function rotateForCycle(recipes: Recipe[], cycleIndex: number): Recipe[] {
  if (recipes.length === 0) return [];
  const start = ((cycleIndex % recipes.length) + recipes.length) % recipes.length;
  return [...recipes.slice(start), ...recipes.slice(0, start)];
}

function takeMatchingRecipes(
  recipes: Recipe[],
  predicate: (recipe: Recipe) => boolean,
  count: number = 3
): Recipe[] {
  const matches: Recipe[] = [];
  for (const recipe of recipes) {
    if (predicate(recipe)) matches.push(recipe);
    if (matches.length === count) break;
  }
  return matches;
}

export default function Home() {
  const [editorial, setEditorial] = useState<EditorialResponse | null>(null);
  const [cycleOffset, setCycleOffset] = useState<number>(0);
  const [isEditorialLoading, setIsEditorialLoading] = useState<boolean>(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isSleuthing, setIsSleuthing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);

  const allRecipes = editorial?.all_recipes?.length
    ? editorial.all_recipes
    : ALL_CURATED_RECIPES;
  const periodRecipes = rotateForCycle(allRecipes, editorial?.cycle_index ?? 0);

  useEffect(() => {
    let isMounted = true;
    setIsEditorialLoading(true);
    fetchEditorialFeed(3, cycleOffset)
      .then((data: EditorialResponse) => {
        if (isMounted) setEditorial(data);
      })
      .finally(() => {
        if (isMounted) setIsEditorialLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [cycleOffset]);

  const handleToggleSave = (recipeId: string) => {
    setSavedIds((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  };

  const handleSearch = async (query: string) => {
    const trimmed = query.trim();
    setSearchQuery(trimmed);

    if (!trimmed) {
      setSearchResults([]);
      setIsSearching(false);
      setIsSleuthing(false);
      return;
    }

    const q = trimmed.toLowerCase();

    // Check instant local curated recipes
    const localMatches = allRecipes.filter((r) => {
      const titleMatch = r.title.toLowerCase().includes(q);
      const descMatch = r.description.toLowerCase().includes(q);
      const cuisineMatch = r.cuisine ? r.cuisine.toLowerCase().includes(q) : false;
      const tagMatch = r.tags.some((t) => t.toLowerCase().includes(q));
      const ingMatch = r.ingredients.some((i) => i.name.toLowerCase().includes(q));
      return titleMatch || descMatch || cuisineMatch || tagMatch || ingMatch;
    });

    if (localMatches.length > 0) {
      setSearchResults(localMatches);
      setIsSearching(false);
      setIsSleuthing(false);

      // Smooth scroll to Search Results Section
      setTimeout(() => {
        const searchResultsElem = document.getElementById("search-results-section");
        if (searchResultsElem) {
          searchResultsElem.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 80);
      return;
    }

    // No local recipe match: Launch Live Internet Scraping + NVIDIA Nemotron Synthesis
    setIsSearching(true);
    setIsSleuthing(true);
    setSearchResults([]);

    setTimeout(() => {
      const searchResultsElem = document.getElementById("search-results-section");
      if (searchResultsElem) {
        searchResultsElem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);

    try {
      const res = await searchRecipes(trimmed);
      if (res && res.items && res.items.length > 0) {
        setSearchResults(res.items);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Live sleuth search failed:", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
      setIsSleuthing(false);
    }
  };

  const handleForceLiveSleuth = async (dishQuery?: string) => {
    const target = (dishQuery || searchQuery).trim();
    if (!target) return;
    setIsSearching(true);
    setIsSleuthing(true);
    setSearchQuery(target);
    setSearchResults([]);

    setTimeout(() => {
      const searchResultsElem = document.getElementById("search-results-section");
      if (searchResultsElem) {
        searchResultsElem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);

    try {
      const live = await sleuthRecipeLive(target);
      if (live) {
        setSearchResults([live]);
      } else {
        const res = await searchRecipes(target);
        setSearchResults(res.items || []);
      }
    } catch (err) {
      console.error("Forced sleuth error:", err);
    } finally {
      setIsSearching(false);
      setIsSleuthing(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
    setIsSleuthing(false);
  };

  const heroRecipe = editorial?.hero_recipe || ALL_CURATED_RECIPES[0];
  const trendingSidebarItems =
    editorial?.trending_sidebar || ALL_CURATED_RECIPES.slice(1, 5);
  const trendingNowItems =
    editorial?.trending_now || ALL_CURATED_RECIPES.slice(4, 7);
  const startersCollection =
    editorial?.starters ||
    takeMatchingRecipes(
      ALL_CURATED_RECIPES,
      (recipe) =>
        recipe.cuisine?.includes("Starter") === true ||
        recipe.tags.some((tag) => tag.includes("Starter"))
    );
  const mainsCollection =
    editorial?.mains ||
    takeMatchingRecipes(
      ALL_CURATED_RECIPES,
      (recipe) =>
        recipe.cuisine?.includes("Main") === true ||
        recipe.cuisine?.includes("Biryani") === true ||
        recipe.tags.some((tag) => tag.includes("Main"))
    );
  const dessertsCollection =
    editorial?.desserts ||
    takeMatchingRecipes(
      ALL_CURATED_RECIPES,
      (recipe) =>
        recipe.cuisine?.includes("Dessert") === true ||
        recipe.cuisine?.includes("Bakery") === true ||
        recipe.tags.some((tag) => tag.includes("Dessert")),
      6
    );
  const sidesCollection =
    editorial?.sides ||
    takeMatchingRecipes(
      ALL_CURATED_RECIPES,
      (recipe) =>
        recipe.cuisine?.includes("Side") === true ||
        recipe.cuisine?.includes("Casserole") === true ||
        recipe.tags.some((tag) => tag.includes("Side")),
      6
    );
  const chineseWokCollection = takeMatchingRecipes(
    periodRecipes,
    (recipe) =>
      recipe.cuisine?.toLowerCase().includes("chinese") === true ||
      recipe.tags.some((tag) => tag.toLowerCase().includes("asian"))
  );
  const continentalCollection = takeMatchingRecipes(
    periodRecipes,
    (recipe) =>
      recipe.cuisine?.toLowerCase().includes("continental") === true ||
      recipe.cuisine?.toLowerCase().includes("italian") === true ||
      recipe.tags.some((tag) => tag.toLowerCase().includes("continental"))
  );
  const clonesCollection = takeMatchingRecipes(
    periodRecipes,
    (recipe) => recipe.is_clone_recipe
  );

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-stone-900 selection:bg-orange-100 selection:text-[#e25b27]">
      {/* Top Allrecipes-Style Navigation with Clear Categories & Integrated Search */}
      <Navbar
        onSearchFocus={() => {
          const searchElem = document.getElementById("search-box");
          if (searchElem) searchElem.scrollIntoView({ behavior: "smooth" });
        }}
        onSearch={handleSearch}
        savedCount={savedIds.length}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          let targetId = "starters-section";
          if (cat === "Mains & Biryani") targetId = "mains-section";
          if (cat === "Chinese & Asian") targetId = "chinese-section";
          if (cat === "Continental") targetId = "continental-section";
          if (cat === "Secret Clones") targetId = "clones-section";
          if (cat === "Desserts & Bakery") targetId = "desserts-section";
          const elem = document.getElementById(targetId);
          if (elem) elem.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-20">
        {/* Search Bar Banner */}
        <section id="search-box">
          <HeroSearch
            onSearch={handleSearch}
            isLoading={isSearching || isSleuthing}
            activeQuery={searchQuery}
          />
        </section>

        {/* DEDICATED SEARCH RESULTS SECTION */}
        {searchQuery && (
          <section
            id="search-results-section"
            className="scroll-mt-28 space-y-6 rounded-3xl bg-white border-2 border-orange-200/90 p-6 sm:p-10 shadow-md animate-in fade-in duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#e25b27]">
                  <Search className="h-4 w-4" />
                  <span>Live Recipe Search Results</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight mt-1 font-serif">
                  Recipes matching &ldquo;{searchQuery}&rdquo;
                </h2>
                <p className="text-sm text-stone-600 mt-1">
                  {searchResults.length > 0
                    ? `Found ${searchResults.length} verified recipe${searchResults.length === 1 ? "" : "s"} with ingredients, instructions, and secret hacks. Click any card to view the recipe.`
                    : `No exact recipes matched "${searchQuery}". Click any suggested category below or try another keyword.`}
                </p>
              </div>

              <button
                type="button"
                onClick={handleClearSearch}
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-stone-50 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-stone-700 hover:border-[#e25b27] hover:text-[#e25b27] hover:bg-orange-50 transition shrink-0"
              >
                <span>Clear Search</span>
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results Grid: Cards have identical properties & clicking opens full recipe */}
            {isSleuthing ? (
              <div className="py-16 text-center space-y-6">
                <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#e25b27] via-orange-500 to-amber-500 text-white shadow-xl">
                  <Sparkles className="h-10 w-10 animate-spin text-white" style={{ animationDuration: "3s" }} />
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
                    <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
                  </span>
                </div>
                <div className="space-y-3 max-w-xl mx-auto">
                  <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 border border-orange-200 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#e25b27]">
                    <span className="h-2 w-2 rounded-full bg-[#e25b27] animate-ping" />
                    <span>NVIDIA Nemotron 3 Ultra 550B & DDG Scraper Active</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-stone-900 font-serif">
                    Sleuthing the web for &ldquo;{searchQuery}&rdquo;...
                  </h3>
                  <p className="text-sm font-medium text-stone-600 leading-relaxed">
                    Live-crawling authentic food sources, extracting ingredients, testing chef secrets, and pulling high-resolution food photography for you right now.
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2 text-xs font-bold text-stone-500">
                    <span className="flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5 text-blue-600" />
                      Web Crawl
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5 text-orange-500" />
                      Recipe Scraper
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      Nemotron Synthesis
                    </span>
                  </div>
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Showing {searchResults.length} Verified Recipe Card{searchResults.length > 1 ? "s" : ""}
                  </span>
                  <button
                    onClick={() => handleForceLiveSleuth(searchQuery)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e25b27] hover:underline"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Re-Sleuth Fresh from Web</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-2">
                  {searchResults.map((recipe, idx) => (
                    <RecipeCard
                      key={`search-${recipe.id}-${idx}`}
                      recipe={recipe}
                      onSelect={setSelectedRecipe}
                      isSaved={savedIds.includes(recipe.id)}
                      onToggleSave={handleToggleSave}
                      ratingScore={["4.9", "4.8", "5.0"][idx % 3]}
                      ratingsCount={["2.1k", "3.4k", "4.2k", "1.9k"][idx % 4]}
                      badgeEmoji={
                        recipe.cuisine?.includes("Biryani") || recipe.tags.includes("Biryani")
                          ? "👑"
                          : recipe.tags.includes("Desserts & Bakery") || recipe.cuisine?.includes("Desserts")
                          ? "🍰"
                          : recipe.cuisine?.includes("Chinese") || recipe.tags.includes("Wok")
                          ? "🥢"
                          : recipe.tags.includes("Burgers") || recipe.id.includes("burger")
                          ? "🍔"
                          : recipe.tags.includes("Pasta") || recipe.title.includes("Spaghetti")
                          ? "🍝"
                          : recipe.tags.includes("Wings")
                          ? "🍗"
                          : recipe.tags.includes("Fries")
                          ? "🍟"
                          : "✨"
                      }
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-[#e25b27]">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-black text-stone-900">
                  No recipes found for &ldquo;{searchQuery}&rdquo;
                </h3>
                <p className="text-sm text-stone-500 max-w-md mx-auto">
                  Try searching for one of these crowd favorites, or force a live web scrape:
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => handleForceLiveSleuth(searchQuery)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#e25b27] hover:bg-[#cf4915] text-white px-5 py-2.5 text-xs font-bold shadow-sm transition"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>⚡ Sleuth Web & Synthesize with NVIDIA Nemotron</span>
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {["Biryani", "Wings", "Burger", "Pasta", "Casserole", "Pie", "Chocolate", "Fries"].map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSearch(term)}
                      className="rounded-full bg-stone-100 hover:bg-[#e25b27] hover:text-white px-4 py-1.5 text-xs font-bold text-stone-700 transition"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* 1. FEATURED SPLIT HERO (Signature Royal Biryani Feature) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-12 flex flex-col gap-4 rounded-3xl border border-orange-200/80 bg-gradient-to-r from-orange-50 via-amber-50 to-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e25b27] text-white shadow-sm">
                {isEditorialLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <CalendarDays className="h-5 w-5" />
                )}
              </span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e25b27]">
                  Periodic Edition
                </p>
                <p className="text-sm font-extrabold text-stone-800 sm:text-base">
                  ✨ {editorial?.edition_label || "Curated Edition"} · Updates in{" "}
                  {editorial?.days_remaining ?? 2} days
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setCycleOffset((prev) => prev - 1)}
                className="rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-black text-stone-700 shadow-xs transition hover:border-[#e25b27] hover:text-[#e25b27]"
              >
                &lt; Prev Edition
              </button>
              <button
                type="button"
                onClick={() => setCycleOffset(0)}
                className={`rounded-full px-4 py-2 text-xs font-black shadow-xs transition ${
                  cycleOffset === 0
                    ? "bg-[#e25b27] text-white"
                    : "border border-stone-300 bg-white text-stone-700 hover:border-[#e25b27] hover:text-[#e25b27]"
                }`}
              >
                Today&apos;s Edition
              </button>
              <button
                type="button"
                onClick={() => setCycleOffset((prev) => prev + 1)}
                className="rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-black text-stone-700 shadow-xs transition hover:border-[#e25b27] hover:text-[#e25b27]"
              >
                Next Edition &gt;
              </button>
            </div>
          </div>

          {/* Left Column (8 cols): Massive Royal Biryani Feature */}
          <div
            onClick={() => setSelectedRecipe(heroRecipe)}
            className="lg:col-span-8 group cursor-pointer space-y-4"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-stone-100 shadow-xs">
              <Image
                src={heroRecipe.image_url}
                alt={heroRecipe.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleSave(heroRecipe.id);
                }}
                className={`absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition ${
                  savedIds.includes(heroRecipe.id)
                    ? "bg-[#e25b27] text-white"
                    : "bg-white/95 text-stone-800 hover:text-[#e25b27]"
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${
                    savedIds.includes(heroRecipe.id) ? "fill-current" : ""
                  }`}
                />
              </button>
            </div>

            <div className="space-y-2 pt-1">
              <div className="text-xs font-black uppercase tracking-wider text-[#e25b27] flex items-center gap-1.5">
                <Flame className="h-4 w-4 fill-current" />
                <span>👑 AMERICA&apos;S FAVORITE ROYAL FEAST</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 group-hover:underline leading-tight tracking-tight font-serif">
                {heroRecipe.title}
              </h1>
              <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal max-w-3xl">
                {heroRecipe.description}
              </p>
              <div className="flex items-center gap-3 text-sm font-bold text-stone-700 pt-1">
                <div className="flex text-[#e25b27]">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <span className="font-extrabold text-stone-900 text-base">4.9</span>
                <span className="text-stone-500 font-semibold">(3.8k Ratings)</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-stone-600">
                  <Clock className="h-4 w-4 text-[#e25b27]" />
                  {heroRecipe.total_time_minutes} mins
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): "The Latest" with Big Thumbnails */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#e25b27] pb-2.5">
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                The Latest
              </h2>
              <span className="text-xs font-black text-[#e25b27] uppercase tracking-wider">
                Trending Wire
              </span>
            </div>

            <div className="divide-y divide-stone-200">
              {trendingSidebarItems.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedRecipe(item)}
                  className="group flex items-center gap-4 py-4 cursor-pointer"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-stone-100 shadow-2xs">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      sizes="96px"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[11px] font-black uppercase tracking-wider text-stone-400">
                      {item.cuisine || item.tags[0] || "Editor's Pick"} ·{" "}
                      {item.total_time_minutes} mins
                    </div>
                    <h3 className="text-base font-bold text-stone-900 leading-snug group-hover:underline line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-[#e25b27] font-bold">
                      <Star className="h-3 w-3 fill-current" />
                      <span>{["4.9", "4.8", "5.0", "4.7"][idx % 4]}</span>
                      <span className="text-stone-400 font-normal">· (2.1k)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. 3D SIGNATURE BURGER SHOWCASE (Fully Draggable in 360°, Realistic Layers & Blurred Depth Background) */}
        <section className="rounded-3xl bg-white border border-stone-200/90 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#e25b27]">
                <Sparkles className="h-4 w-4" />
                <span>3D Interactive Food Studio</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight mt-1 font-serif">
                🍔 Inspect America&apos;s Signature Smashed Burger in 360°
              </h2>
              <p className="text-sm text-stone-600 mt-1 max-w-2xl">
                Click and drag freely to rotate in full 3D! Inspect the warm brioche bun with toasted sesame seeds,
                melted dripping cheddar, seared charred beef patty, crisp garden lettuce, and vine tomatoes.
              </p>
            </div>
            <button
              onClick={() => {
                const burgerRecipe = ALL_CURATED_RECIPES.find((r) => r.id.includes("burger"));
                if (burgerRecipe) setSelectedRecipe(burgerRecipe);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#e25b27] px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-xs hover:bg-[#cf4915] transition shrink-0"
            >
              <span>Get Secret Burger Recipe</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="w-full">
            <Hero3DCanvas />
          </div>
        </section>

        {/* 3. SECTION: Trending Now on CraveLab (Cowboy Soup, One-Pan Dirty Spaghetti, Million Dollar Soup) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-stone-200 pb-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight flex items-center gap-3 group cursor-pointer">
              <span>🔥 Trending Now on CraveLab</span>
              <ArrowRight className="h-6 w-6 text-[#e25b27] group-hover:translate-x-1.5 transition-transform" />
            </h2>
            <span className="text-xs font-black text-[#e25b27] uppercase tracking-wider">
              Viral Hits
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingNowItems.map((recipe, idx) => (
              <RecipeCard
                key={`trending-${recipe.id}`}
                recipe={recipe}
                onSelect={setSelectedRecipe}
                isSaved={savedIds.includes(recipe.id)}
                onToggleSave={handleToggleSave}
                ratingScore={["4.9", "4.8", "5.0"][idx % 3]}
                ratingsCount={["3.8k", "2.4k", "4.1k"][idx % 3]}
                badgeEmoji={["🍲", "🍝", "🧀"][idx % 3]}
              />
            ))}
          </div>
        </section>

        {/* 4. SECTION: Popular Holiday Sides & Comfort Casseroles (Mashed Potatoes, Sweet Potato, Stuffing, Mac & Cheese) */}
        <SidesSection
          recipes={sidesCollection}
          onSelectRecipe={setSelectedRecipe}
          savedIds={savedIds}
          onToggleSave={handleToggleSave}
        />

        {/* 5. FULL-WIDTH BANNER 1: Fast Food Favorites & Drive-Thru Hacks (Screenshot 1 Match) */}
        <FeaturedBanner
          eyebrow="FOOD NEWS AND TRENDS"
          title="Fast Food Favorites & Leaked Ordering Hacks"
          description="Learn about new menu items, can't-miss deals and promotions, and must-try ordering hacks to get the most out of your drive-thru run."
          imageUrl="/images/allrecipes/AllRecipes-Happy-Meal-Toys-VAT-3x1-a539c1604e204ff88caeab5470167bc2.jpg"
          buttonText="Explore Secret Menu Clones"
          onClick={() => {
            const match = ALL_CURATED_RECIPES.find((r) => r.id.includes("kfc"));
            if (match) setSelectedRecipe(match);
          }}
        />

        {/* 6. SECTION: Starters, Wings & Craveable Dips (Distinct items) */}
        <section id="starters-section" className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-stone-200 pb-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight flex items-center gap-3 group cursor-pointer">
              <span>🍤 Starters, Wings & Craveable Appetizers</span>
              <ArrowRight className="h-6 w-6 text-[#e25b27] group-hover:translate-x-1.5 transition-transform" />
            </h2>
            <span className="text-xs font-black text-[#e25b27] uppercase tracking-wider">
              Crowd Starters
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {startersCollection.map((recipe, idx) => (
              <RecipeCard
                key={`starters-${recipe.id}`}
                recipe={recipe}
                onSelect={setSelectedRecipe}
                isSaved={savedIds.includes(recipe.id)}
                onToggleSave={handleToggleSave}
                ratingScore={["4.9", "4.8", "5.0"][idx % 3]}
                ratingsCount={["2.5k", "1.8k", "3.1k"][idx % 3]}
                badgeEmoji={["🍤", "🍗", "🧄"][idx % 3]}
              />
            ))}
          </div>
        </section>

        {/* 7. SECTION: Mains, Curries & Royal Tandoori (Butter Chicken, Rogan Josh, Tandoori - NO Duplicates!) */}
        <section id="mains-section" className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-stone-200 pb-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight flex items-center gap-3 group cursor-pointer">
              <span>🍛 Mains, Rich Curries & Smoky Tandoori</span>
              <ArrowRight className="h-6 w-6 text-[#e25b27] group-hover:translate-x-1.5 transition-transform" />
            </h2>
            <span className="text-xs font-black text-[#e25b27] uppercase tracking-wider">
              Family Feasts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainsCollection.map((recipe, idx) => (
              <RecipeCard
                key={`mains-${recipe.id}`}
                recipe={recipe}
                onSelect={setSelectedRecipe}
                isSaved={savedIds.includes(recipe.id)}
                onToggleSave={handleToggleSave}
                ratingScore={["4.9", "4.9", "4.8"][idx % 3]}
                ratingsCount={["3.8k", "2.1k", "2.9k"][idx % 3]}
                badgeEmoji={["🍛", "🥩", "🍗"][idx % 3]}
              />
            ))}
          </div>
        </section>

        {/* 8. FULL-WIDTH BANNER 2: "Happy Dips-Giving!" (Exact Screenshot 3 Match with Dipping Pita into Dip!) */}
        <HappyDipsBanner
          onClick={() => {
            const dipRecipe = ALL_CURATED_RECIPES.find((r) => r.id.includes("dip"));
            if (dipRecipe) setSelectedRecipe(dipRecipe);
          }}
        />

        {/* 9. CHEF SPOTLIGHT: Nicole's Perfect Bite (Exact Screenshot 2 Match with Smiling Woman Chef holding Grocery Bag!) */}
        <ChefSpotlight
          onSelectRecipe={setSelectedRecipe}
          savedIds={savedIds}
          onToggleSave={handleToggleSave}
        />

        {/* 10. SECTION: Chinese & Asian Wok Specials (Distinct items) */}
        <section id="chinese-section" className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-stone-200 pb-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight flex items-center gap-3 group cursor-pointer">
              <span>🥢 Chinese & Asian Wok Specials</span>
              <ArrowRight className="h-6 w-6 text-[#e25b27] group-hover:translate-x-1.5 transition-transform" />
            </h2>
            <span className="text-xs font-black text-[#e25b27] uppercase tracking-wider">
              20-Min Wok Meals
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {chineseWokCollection.map((recipe, idx) => (
              <RecipeCard
                key={`asian-${recipe.id}`}
                recipe={recipe}
                onSelect={setSelectedRecipe}
                isSaved={savedIds.includes(recipe.id)}
                onToggleSave={handleToggleSave}
                ratingScore={["4.8", "4.9", "4.7"][idx % 3]}
                ratingsCount={["1.9k", "2.3k", "1.4k"][idx % 3]}
                badgeEmoji={["🥢", "🍜", "🥡"][idx % 3]}
              />
            ))}
          </div>
        </section>

        {/* 11. SECTION: Continental Sizzlers & Italian Pastas (Distinct items) */}
        <section id="continental-section" className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-stone-200 pb-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight flex items-center gap-3 group cursor-pointer">
              <span>🥩 Continental Sizzlers & Italian Pastas</span>
              <ArrowRight className="h-6 w-6 text-[#e25b27] group-hover:translate-x-1.5 transition-transform" />
            </h2>
            <span className="text-xs font-black text-[#e25b27] uppercase tracking-wider">
              European Comforts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {continentalCollection.map((recipe, idx) => (
              <RecipeCard
                key={`continental-${recipe.id}`}
                recipe={recipe}
                onSelect={setSelectedRecipe}
                isSaved={savedIds.includes(recipe.id)}
                onToggleSave={handleToggleSave}
                ratingScore={["4.9", "4.8", "4.9"][idx % 3]}
                ratingsCount={["2.8k", "1.9k", "3.4k"][idx % 3]}
                badgeEmoji={["🥩", "🍝", "🍄"][idx % 3]}
              />
            ))}
          </div>
        </section>

        {/* 12. DEDICATED DESSERTS SECTION: Easy Thanksgiving Desserts (Exact Screenshot 3 Match with 2.1k+ Ratings) */}
        <DessertsGrid
          recipes={dessertsCollection}
          onSelectRecipe={setSelectedRecipe}
          savedIds={savedIds}
          onToggleSave={handleToggleSave}
        />

        {/* 13. FAST FOOD NEWS SECTION: McDonald's, Popeyes, A&W (Exact Screenshot 4 Match!) */}
        <NewsSection />

        {/* 14. SECTION: Secret Fast-Food Clones (KFC, In-N-Out, Chipotle Barbacoa) */}
        <section id="clones-section" className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-stone-200 pb-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight flex items-center gap-3 group cursor-pointer">
              <span>🍟 Top Secret Fast-Food Clones</span>
              <ArrowRight className="h-6 w-6 text-[#e25b27] group-hover:translate-x-1.5 transition-transform" />
            </h2>
            <span className="text-xs font-black text-[#e25b27] uppercase tracking-wider">
              Leaked Formulas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {clonesCollection.map((recipe, idx) => (
              <RecipeCard
                key={`clones-${recipe.id}`}
                recipe={recipe}
                onSelect={setSelectedRecipe}
                isSaved={savedIds.includes(recipe.id)}
                onToggleSave={handleToggleSave}
                ratingScore={["4.9", "4.9", "4.8"][idx % 3]}
                ratingsCount={["3.1k", "4.2k", "2.2k"][idx % 3]}
                badgeEmoji={["🍗", "🍔", "🌮"][idx % 3]}
              />
            ))}
          </div>
        </section>

        {/* 15. COMMUNITY SECTION: "HOME OF THE HOME COOK & OUR PEOPLE" (Screenshot 2 Match) */}
        <CommunitySection />
      </main>

      {/* Recipe Detail Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        isSaved={selectedRecipe ? savedIds.includes(selectedRecipe.id) : false}
        onToggleSave={handleToggleSave}
      />

      {/* Allrecipes-Style Comprehensive Foodie Footer */}
      <footer className="mt-28 border-t border-stone-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-stone-200 pb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e25b27] text-white font-black text-lg shadow-sm">
                CL
              </div>
              <span className="text-3xl font-black text-stone-900 font-serif">
                CRAVE<span className="text-[#e25b27]">LAB</span>
              </span>
              <span className="text-xs text-stone-500 font-bold ml-2">
                · The World&apos;s AI Secret Recipe Kitchen
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-xs font-black text-stone-600 uppercase tracking-wider">
              <a href="#starters-section" className="hover:text-[#e25b27]">Starters</a>
              <a href="#mains-section" className="hover:text-[#e25b27]">Mains</a>
              <a href="#chinese-section" className="hover:text-[#e25b27]">Chinese</a>
              <a href="#continental-section" className="hover:text-[#e25b27]">Continental</a>
              <a href="#desserts-section" className="hover:text-[#e25b27]">Bakery</a>
              <a href="#clones-section" className="hover:text-[#e25b27]">Secret Clones</a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 font-medium gap-4">
            <p>
              © 2026 CRAVELAB Recipes. Tested, verified, and reverse-engineered recipes for home cooks everywhere.
            </p>
            <p className="flex items-center gap-2 text-stone-500 font-bold">
              <span>America&apos;s #1 Trusted AI Culinary Resource</span>
              <span>·</span>
              <span>51K+ Original Tested Formulas</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
