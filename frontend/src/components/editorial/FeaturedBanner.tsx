"use client";

import React from "react";
import Image from "next/image";

interface FeaturedBannerProps {
  eyebrow: string;
  title: string;
  description: string;
  imageUrl: string;
  buttonText?: string;
  onClick?: () => void;
}

export const FeaturedBanner: React.FC<FeaturedBannerProps> = ({
  eyebrow,
  title,
  description,
  imageUrl,
  buttonText = "Explore Collection",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="group relative w-full h-[360px] sm:h-[440px] lg:h-[480px] overflow-hidden rounded-3xl cursor-pointer shadow-sm"
    >
      {/* Huge Background Photo */}
      <Image
        src={imageUrl}
        alt={title}
        fill
        sizes="100vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
      />

      {/* Floating White Content Card (Allrecipes Signature Look) */}
      <div className="absolute inset-y-0 left-4 sm:left-12 flex items-center max-w-lg z-10 pointer-events-none">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl space-y-3 pointer-events-auto border border-stone-200/80">
          <div className="text-xs font-black uppercase tracking-wider text-stone-500">
            {eyebrow}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight group-hover:underline">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
            {description}
          </p>
          <div className="pt-1">
            <span className="text-xs font-bold text-[#e25b27] group-hover:underline">
              {buttonText} →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

