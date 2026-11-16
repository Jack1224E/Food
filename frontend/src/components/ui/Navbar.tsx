"use client";

import React, { useState } from "react";
import { ChefHat, Search, Bookmark, Sparkles, X } from "lucide-react";

interface NavbarProps {
  onSearchFocus?: () => void;
  onSearch?: (query: string) => void;
  savedCount?: number;
  onSelectCategory?: (cat: string) => void;
  activeCategory?: string;
  onOpenSaved?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchFocus,
  onSearch,
  savedCount = 0,
  onSelectCategory,
  activeCategory = "All",
  onOpenSaved,
}) => {
  const [navQuery, setNavQuery] = useState("");

  const navCategories = [
    { label: "All Recipes", id: "All" },
    { label: "Starters & Dips", id: "Starters" },
    { label: "Mains & Biryani", id: "Mains & Biryani" },
    { label: "Chinese & Asian", id: "Chinese & Asian" },
    { label: "Continental", id: "Continental" },
    { label: "Secret Clones", id: "Secret Clones" },
    { label: "Bakery & Desserts", id: "Desserts & Bakery" },
  ];

  const handleNavSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(navQuery.trim());
    } else if (onSearchFocus) {
      onSearchFocus();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs">
      {/* Top Blue Trust Bar (Allrecipes signature) */}
      <div className="bg-[#1e3a8a] text-white py-1 px-4 text-center text-xs font-semibold tracking-wide flex items-center justify-center gap-4 sm:gap-8">
        <span className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          America&apos;s #1 Trusted AI Recipe Kitchen
        </span>
        <span className="hidden sm:inline-block opacity-80">·</span>
        <span className="hidden sm:inline-block">51K Original Recipes</span>
        <span className="hidden md:inline-block opacity-80">·</span>
        <span className="hidden md:inline-block">7M+ Ratings & Reviews</span>
        <span className="hidden lg:inline-block opacity-80">·</span>
        <span className="hidden lg:inline-block">67M Home Cooks</span>
      </div>

      {/* Main Navbar */}
      <div className="border-b border-stone-200">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <div
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              onSelectCategory?.("All");
              if (onSearch) onSearch("");
            }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e25b27] text-white shadow-sm">
              <ChefHat className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-stone-900 font-serif">
                  CRAVE<span className="text-[#e25b27]">LAB</span>
                </span>
                <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-black text-[#e25b27] uppercase tracking-wider">
                  Kitchen
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-bold -mt-0.5">
                Everyday Cooks · Secret Clones · Flavor Sleuth
              </p>
            </div>
          </div>

          {/* Center Search Input */}
          <form onSubmit={handleNavSearchSubmit} className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full flex items-center rounded-full bg-[#fbf9f5] border border-stone-300 px-4 py-2 text-sm text-stone-500 focus-within:border-[#e25b27] focus-within:ring-2 focus-within:ring-orange-100 transition shadow-2xs">
              <Search className="h-4 w-4 text-[#e25b27] mr-2.5 shrink-0" />
              <input
                type="text"
                value={navQuery}
                onChange={(e) => setNavQuery(e.target.value)}
                placeholder="Search biryani, chicken, pasta, burger, cake..."
                className="w-full bg-transparent text-stone-800 placeholder-stone-400 focus:outline-none font-medium text-sm"
              />
              {navQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setNavQuery("");
                    if (onSearch) onSearch("");
                  }}
                  className="mr-2 text-stone-400 hover:text-stone-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="submit"
                className="shrink-0 rounded-full bg-[#e25b27] text-white p-1 hover:bg-[#cf4915] transition"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenSaved}
              className="relative flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-stone-700 hover:border-[#e25b27] hover:text-[#e25b27] transition shadow-2xs"
            >
              <Bookmark className="h-4 w-4 text-[#e25b27]" />
              <span>Saved</span>
              {savedCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e25b27] text-[10px] font-black text-white">
                  {savedCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="border-t border-stone-100 bg-[#fbf9f5]">
          <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8 text-xs font-black uppercase tracking-wider text-stone-600 no-scrollbar">
            {navCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory?.(cat.id)}
                className={`shrink-0 rounded-full px-4 py-1.5 transition ${
                  activeCategory === cat.id
                    ? "bg-[#e25b27] text-white shadow-xs"
                    : "bg-white text-stone-700 hover:bg-orange-50 hover:text-[#e25b27] border border-stone-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
