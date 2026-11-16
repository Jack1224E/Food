"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export const CommunitySection: React.FC = () => {
  const editorialAvatars = [
    { name: "Jack", role: "Lead Editorial Director", image: "/images/jack_kolkata.jpg", location: "Lives in Kolkata", border: "border-[#e25b27] ring-4 ring-orange-300" },
    { name: "Elena R.", role: "Senior Culinary Editor", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80", border: "border-purple-400" },
    { name: "Maya T.", role: "Food Stylist", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80", border: "border-amber-400" },
    { name: "Chloe K.", role: "Nutritionist", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80", border: "border-emerald-400" },
    { name: "David L.", role: "Executive Chef", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", border: "border-orange-400" },
    { name: "Marcus B.", role: "Spice Specialist", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80", border: "border-red-400" },
  ];

  const contributorAvatars = [
    { name: "Priya S.", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80", border: "border-amber-400" },
    { name: "Rachel G.", image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=150&q=80", border: "border-blue-400" },
    { name: "Tom H.", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80", border: "border-red-400" },
  ];

  const testKitchenAvatars = [
    { name: "Chef Ken", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80", border: "border-emerald-400" },
    { name: "Grandma Bea", image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80", border: "border-orange-400" },
    { name: "Chef Sam", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80", border: "border-purple-400" },
  ];

  return (
    <section className="w-full rounded-3xl border-4 border-orange-400/90 bg-white p-6 sm:p-10 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Home of the Home Cook */}
        <div className="lg:col-span-6 space-y-6 lg:border-r lg:border-stone-200 lg:pr-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-orange-950 font-serif">
              Home of the Home Cook
            </h2>
            <p className="mt-2 text-sm text-stone-600 font-medium leading-relaxed">
              We know our community (that&apos;s you!) is the key ingredient that sets us apart.{" "}
              <a href="#feed" className="font-bold text-[#e25b27] hover:underline inline-flex items-center gap-1">
                LEARN MORE <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </p>
          </div>

          {/* Featured Cook Profile Box */}
          <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl bg-amber-50/60 p-5 border border-amber-200/70">
            <div className="relative h-24 w-24 shrink-0 rounded-2xl overflow-hidden shadow-sm border-2 border-emerald-600">
              <Image
                src="/images/jack_kolkata.jpg"
                alt="Jack, Editorial Lead in Kolkata"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <div className="font-extrabold text-stone-900 text-base">
                Mastering Authentic Bengali Alu Posto &amp; Royal Wok Feasts
              </div>
              <p className="text-xs italic text-stone-600">
                &quot;Cooking with high-flame wok technique and authentic stone-ground poppy seed paste brings out pure Kolkata flavor magic.&quot;
              </p>
              <div className="text-[11px] font-black uppercase tracking-wider text-stone-500 pt-1">
                JACK, LIVES IN KOLKATA · EDITORIAL LEAD
              </div>
            </div>
          </div>

          {/* Community Social Stats Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-200 text-xs font-black text-stone-700">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-blue-600">f</span> 3.9M
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-pink-600">IG</span> 2.2M
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-red-600">P</span> 1.3M
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-black">TT</span> 678.4K
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-red-600">YT</span> 1.8M
            </div>
          </div>
        </div>

        {/* Right Column: Our People */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-orange-950 font-serif">
              Our People
            </h2>
            <p className="mt-2 text-sm text-stone-600 font-medium leading-relaxed">
              Testing, tasting, editing, and tasting again—our food pros are dedicated to showcasing the best
              of what you, our home cook heroes, are doing in your kitchens.
            </p>
          </div>

          {/* Editorial Leadership Avatars */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#e25b27]">
              <span>Editorial Leadership →</span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-4 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 shadow-sm">
                <div className={`relative h-20 w-20 shrink-0 rounded-full border-3 ${editorialAvatars[0].border} shadow-sm`}>
                  <Image
                    src={editorialAvatars[0].image}
                    alt={editorialAvatars[0].name}
                    fill
                    className="rounded-full object-cover"
                  />
                  <span className="absolute -right-2 -top-2 rounded-full bg-[#e25b27] px-2 py-1 text-[9px] font-black tracking-wider text-white shadow-sm">
                    LEAD
                  </span>
                </div>
                <div>
                  <div className="font-black text-stone-900">Jack, lives in Kolkata</div>
                  <div className="mt-0.5 text-xs font-bold uppercase tracking-wide text-[#e25b27]">
                    {editorialAvatars[0].role}
                  </div>
                </div>
              </div>
              {editorialAvatars.slice(1).map((person, i) => (
                <div key={i} className={`relative h-14 w-14 rounded-full overflow-hidden border-3 ${person.border} shadow-xs`}>
                  <Image src={person.image} alt={person.name} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Contributors & Test Kitchen Avatars */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-[#e25b27]">
                Contributors →
              </div>
              <div className="flex items-center gap-2">
                {contributorAvatars.map((person, i) => (
                  <div key={i} className={`relative h-12 w-12 rounded-full overflow-hidden border-2 ${person.border} shadow-xs`}>
                    <Image src={person.image} alt={person.name} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-[#e25b27]">
                Test Kitchen →
              </div>
              <div className="flex items-center gap-2">
                {testKitchenAvatars.map((person, i) => (
                  <div key={i} className={`relative h-12 w-12 rounded-full overflow-hidden border-2 ${person.border} shadow-xs`}>
                    <Image src={person.image} alt={person.name} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

