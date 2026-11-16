"use client";

import React, { useState, useEffect } from "react";
import { Search, Flame, ArrowRight, X } from "lucide-react";

interface HeroSearchProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  activeQuery?: string;
}

const POPULAR_INVESTIGATIONS = [
  { label: "Biryani", icon: "👑" },
  { label: "KFC Fried Chicken", icon: "🍗" },
  { label: "In-N-Out Burger", icon: "🍔" },
  { label: "Pasta & Spaghetti", icon: "🍝" },
  { label: "Mashed Potatoes", icon: "🥔" },
  { label: "Pumpkin Pie & Cake", icon: "🍰" },
  { label: "Cajun Fries", icon: "🍟" },
  { label: "Chipotle Barbacoa", icon: "🌮" },
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  onSearch,
  isLoading = false,
  activeQuery = "",
}) => {
  const [query, setQuery] = useState(activeQuery);

  useEffect(() => {
    setQuery(activeQuery);
  }, [activeQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleChipClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      {/* Search Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="group relative flex items-center rounded-2xl bg-white border-2 border-stone-200 p-1.5 shadow-sm transition-all focus-within:border-[#e25b27] focus-within:shadow-md"
      >
        <div className="flex h-11 w-11 items-center justify-center text-[#e25b27] shrink-0">
          <Search className="h-5 w-5" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search any recipe, secret clone, dish, or craving..."
          className="w-full bg-transparent px-2 py-2 text-sm sm:text-base text-stone-900 placeholder-stone-400 focus:outline-none font-medium"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-2 text-stone-400 hover:text-stone-600 transition"
            title="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 rounded-xl bg-[#e25b27] hover:bg-[#cf4915] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition active:scale-95 disabled:opacity-50 shrink-0"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Searching...</span>
            </span>
          ) : (
            <>
              <span>Search</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Popular Recipe Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-stone-500 pt-1">
        <span className="flex items-center gap-1 font-bold text-stone-800">
          <Flame className="h-3.5 w-3.5 text-[#e25b27]" />
          Popular:
        </span>
        {POPULAR_INVESTIGATIONS.map((item) => (
          <button
            key={item.label}
            onClick={() => handleChipClick(item.label)}
            className="flex items-center gap-1 rounded-full bg-white border border-stone-200 px-3 py-1 text-stone-700 font-semibold hover:border-[#e25b27] hover:text-[#e25b27] transition shadow-2xs"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
