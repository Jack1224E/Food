"use client";

import React from "react";
import Image from "next/image";

interface HappyDipsBannerProps {
  onClick?: () => void;
}

export const HappyDipsBanner: React.FC<HappyDipsBannerProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-3xl bg-amber-50 cursor-pointer shadow-sm"
    >
      {/* Background Banner Image */}
      <div className="relative h-[320px] sm:h-[400px] lg:h-[460px] w-full">
        <Image
          src="/images/allrecipes/ar-dipsgiving-2026-hero-3x1-a4198007058c4b13a5b43f49a60d29af.jpg"
          alt="Happy Dips-Giving"
          fill
          priority
          sizes="100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
        />

        {/* Floating White Editorial Card (Exact Allrecipes screenshot match) */}
        <div className="absolute top-1/2 left-6 sm:left-12 lg:left-16 -translate-y-1/2 max-w-sm sm:max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-xl space-y-2 border border-stone-100">
          <div className="text-[11px] font-black uppercase tracking-widest text-stone-500">
            FEATURES
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight leading-tight group-hover:underline">
            Happy Dips-Giving!
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
            Here&apos;s everything you need to host a feast made entirely of crowd-pleasing dips, plus
            the secrets behind pastelón dip, garlicky skordalia, warm queso, and more.
          </p>
        </div>
      </div>
    </div>
  );
};

