"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Flame } from "lucide-react";

export const NewsSection: React.FC = () => {
  const newsArticles = [
    {
      id: "mcdonalds-iconic-meal",
      category: "FAST FOOD",
      time: "2 HOURS AGO",
      headline: "McDonald's Is Bringing Back the Iconic Meal Fans Have Waited 8 Long Years For",
      image: "/images/allrecipes/AR-McDonalds-Batch-Adobe-02-4x3-394ca09e995f4548be39367760fcce18.jpg",
      summary: "After almost a decade of customer petitions, the golden arches are officially reviving the beloved combo nationwide this November.",
    },
    {
      id: "popeyes-discontinued-side",
      category: "FAST FOOD",
      time: "4 HOURS AGO",
      headline: "Popeyes Is Bringing Back a Discontinued Side for the First Time in More Than a Decade",
      image: "/images/allrecipes/ar-popeyes-new-menu-item-ar-getty-popeyes-4x3-d8cde76439ec4ffb996ed6da82201ee5.jpg",
      summary: "The Louisiana-inspired chain confirms the return of the fan-favorite side dish featuring their signature Cajun spice blend.",
    },
    {
      id: "aw-dairy-queen-rival",
      category: "FAST FOOD",
      time: "6 HOURS AGO",
      headline: "A&W Is Coming for Dairy Queen With Its Latest Menu Item",
      image: "/images/allrecipes/ar-aw-new-menu-items-ar-aw-4x3-15f8184923cb4e1a9415d71dc494ed25.jpg",
      summary: "A creamy new soft-serve blend with real root beer syrup and malt crumble promises to challenge the Blizzard crown.",
    },
    {
      id: "arbys-curly-fries",
      category: "FAST FOOD",
      time: "1 DAY AGO",
      headline: "Arby's Just Revealed the Secret Seasoning Blend Behind Their Legendary Curly Fries",
      image: "/images/allrecipes/ar-arbys-batch-4-ar-adobe-4x3-8c447013df3440d3a71b32725d2e4dcd.jpg",
      summary: "Home cooks can now recreate the onion, garlic, and cayenne crust with this reverse-engineered pantry hack.",
    },
  ];

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-stone-200 pb-3">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight flex items-center gap-3 group cursor-pointer">
          <span>📰 Fast Food News & Trending Drive-Thru Hacks</span>
          <ArrowRight className="h-6 w-6 text-[#e25b27] group-hover:translate-x-1.5 transition-transform" />
        </h2>
        <span className="text-xs font-black text-[#e25b27] uppercase tracking-wider flex items-center gap-1">
          <Flame className="h-3.5 w-3.5" />
          <span>Live Food Wire</span>
        </span>
      </div>

      {/* Grid: 8 cols news feed + 4 cols skyscraper vertical banner (Screenshot 4 match) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Stacked News Article Cards with Dividers */}
        <div className="lg:col-span-8 divide-y divide-stone-200">
          {newsArticles.map((article) => (
            <article
              key={article.id}
              className="group flex flex-col sm:flex-row items-start sm:items-center gap-5 py-6 cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full sm:w-56 shrink-0 overflow-hidden rounded-2xl bg-stone-100 shadow-2xs">
                <Image
                  src={article.image}
                  alt={article.headline}
                  fill
                  sizes="(max-width: 640px) 100vw, 224px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Text Info */}
              <div className="space-y-2">
                <div className="text-xs font-black uppercase tracking-wider text-[#e25b27]">
                  {article.category} · <span className="text-stone-400 font-semibold">{article.time}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug group-hover:underline">
                  {article.headline}
                </h3>
                <p className="text-sm text-stone-600 line-clamp-2 leading-relaxed">
                  {article.summary}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Right Column (4 cols): Vertical Skyscraper Banner (Screenshot 4 Match) */}
        <div className="lg:col-span-4 sticky top-6 space-y-4">
          <div className="relative h-[580px] w-full overflow-hidden rounded-3xl bg-linear-to-b from-[#8b2346] via-[#631835] to-[#3a0d1f] p-8 text-white shadow-md flex flex-col justify-between">
            {/* Top Branding */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">
                CRAVELAB TASTE OF ARABIA
              </span>
              <h3 className="text-3xl font-black font-serif leading-tight">
                The culinary treasures of Saudi are yours to discover
              </h3>
              <p className="text-sm text-rose-100/90 leading-relaxed pt-2">
                Explore aromatic Kabsa spices, camel milk gelato, date delicacies, and royal feasts.
              </p>
            </div>

            {/* Travel Illustration / Badge */}
            <div className="space-y-4">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/15">
                <div className="text-xs font-bold text-amber-200">CURATED SPICE MARKET TOUR</div>
                <div className="text-base font-extrabold text-white mt-1">
                  Riyadh & Jeddah Foodie Expeditions
                </div>
              </div>

              <button className="w-full rounded-full bg-white text-stone-900 py-3 text-xs font-black uppercase tracking-wider hover:bg-amber-100 transition shadow-sm">
                Explore Foodie Journeys
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

