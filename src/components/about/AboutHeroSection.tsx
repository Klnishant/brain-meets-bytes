"use client";

import { useEffect, useState } from "react";

type AboutHeroContent = {
  heading?: string;
  highlightText?: string;
  body?: string;
  primaryCtaLabel?: string;
};

const FALLBACK_HERO: AboutHeroContent = {
  heading: "Where Brain Science Meets a Healthier Future for Everyone",
  highlightText: "Healthier Future",
  body:
    "Brain Meets Bytes explores breakthroughs in neuroscience, healthy aging, and human longevity—translating emerging science into insights that help us all live longer, healthier, and sharper lives.",
  primaryCtaLabel: "Watch Latest Episode",
};

const AboutHeroSection = () => {
  const [content, setContent] = useState<AboutHeroContent | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetch("/api/about-hero");
        if (!res.ok) throw new Error("Failed to load About hero");
        const data = (await res.json()) as AboutHeroContent | null;
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

  const heading = content?.heading ?? FALLBACK_HERO.heading!;
  const highlightText = content?.highlightText ?? FALLBACK_HERO.highlightText!;
  const body = content?.body ?? FALLBACK_HERO.body!;
  const primaryCtaLabel = content?.primaryCtaLabel ?? FALLBACK_HERO.primaryCtaLabel!;

  const [beforeHighlight, afterHighlight] = (() => {
    if (!heading || !highlightText) return [heading, ""] as const;
    const idx = heading.indexOf(highlightText);
    if (idx === -1) return [heading, ""] as const;
    return [heading.slice(0, idx), heading.slice(idx + highlightText.length)] as const;
  })();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/about-wave.svg"
          alt="Decorative wave background"
          className="w-[802px] h-[759px] opacity-90 max-w-none motion-safe:wave-float"
        />
      </div>

      <div className="relative mx-auto flex flex-col items-center justify-center px-4 sm:px-6 lg:px-16 py-24 lg:py-32 gap-10 max-w-5xl text-center">
        <div className="flex flex-col gap-6">
          <h1 className="font-sora text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#1E293B]">
            {beforeHighlight}
            {highlightText && <span className="text-[#D62828]">{highlightText}</span>}
            {afterHighlight}
          </h1>
          <p className="font-inter text-sm sm:text-base md:text-lg leading-7 md:leading-8 text-[#505050] mx-auto max-w-3xl">
            {body}
          </p>
        </div>

        <div className="flex justify-center">
          <button className="inline-flex items-center gap-4 px-10 py-4 rounded-full bg-[#D62828] text-white font-sora text-base md:text-lg shadow-md hover:bg-[#b81f1f] transition-colors">
            <span>{primaryCtaLabel}</span>
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white">
              <span className="inline-block w-0 h-0 border-y-[6px] border-y-transparent border-l-8 border-l-[#D62828] ml-[2px]" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
