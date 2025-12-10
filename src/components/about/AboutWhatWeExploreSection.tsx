"use client";

import { useEffect, useState } from "react";

type WhatTile = {
  label?: string;
  description?: string;
  accentColor?: string;
  iconUrl?: string;
};

type WhatWeExploreContent = {
  title?: string;
  items?: WhatTile[];
};

const FALLBACK_WHAT: WhatWeExploreContent = {
  title: "What We Explore",
  items: [
    {
      label: "Neuroscience",
      description: "The science of how the brain evolves and adapts",
      accentColor: "#2E58FF",
      iconUrl: "/about-what-neuroscience.png",
    },
    {
      label: "Longevity",
      description: "Extending healthspan through lifestyle & research",
      accentColor: "#DA8E13",
      iconUrl: "/about-what-longevity.png",
    },
    {
      label: "Cognitive Enhancement",
      description: "Tools & habits that strengthen mental performance",
      accentColor: "#EB5463",
      iconUrl: "/about-what-cognitive.png",
    },
    {
      label: "Tech & Innovation",
      description: "AI, wearables, and breakthroughs shaping future healthcare",
      accentColor: "#27A2CC",
      iconUrl: "/about-what-tech.png",
    },
  ],
};

const AboutWhatWeExploreSection = () => {
  const [content, setContent] = useState<WhatWeExploreContent | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetch("/api/about-what-we-explore");
        if (!res.ok) throw new Error("Failed to load What We Explore content");
        const data = (await res.json()) as WhatWeExploreContent | null;
        if (!mounted) return;
        setContent(data);
      } catch {
        if (!mounted) return;
        setContent(null);
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  const title = content?.title ?? FALLBACK_WHAT.title!;
  const items =
    Array.isArray(content?.items) && content.items.length > 0
      ? content.items
      : FALLBACK_WHAT.items!;

  return (
    <section className="w-full bg-[#FAF9F8] py-16 md:py-20 lg:py-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-16 flex flex-col items-center gap-12">
        <h2 className="font-sora text-2xl md:text-3xl lg:text-4xl font-bold text-[#1E293B] text-center">
          {title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full">
          {items.map((item, idx) => {
            const accent = item.accentColor || "#2E58FF";
            return (
              <article
                key={idx}
                className="flex flex-col items-center border border-[#E2E8F0] rounded-2xl bg-[#FAF9F8] px-6 py-10 gap-8 text-center"
              >
                {item.iconUrl && (
                  <img
                    src={item.iconUrl}
                    alt={item.label || "Icon"}
                    className="w-20 h-20 object-contain"
                  />
                )}

                <div className="flex flex-col items-center gap-3 max-w-xs">
                  <h3
                    className="font-sora text-2xl font-bold"
                    style={{ color: accent }}
                  >
                    {item.label}
                  </h3>
                  <p className="font-inter text-sm md:text-base leading-7 text-[#505050]">
                    {item.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutWhatWeExploreSection;
