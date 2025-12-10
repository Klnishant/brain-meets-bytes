"use client";

import { useEffect, useState } from "react";
import { COLORS } from "@/lib/constants";

type AboutKiContent = {
  badgeLabel?: string;
  heading?: string;
  body?: string;
  ctaLabel?: string;
  imageUrl?: string;
};

const FALLBACK_ABOUT: AboutKiContent = {
  badgeLabel: "About Ki",
  heading: "Hi, I’m Ki, CO-founder of brain meets bytes",
  body:
    "As a dementia certified specialist, futurist and gerontechnologist, I’ve spent years immersed in both the tech and healthcare worlds. This unique perspective allows me to shed light on how advancements in these fields are shaping the future of aging – and how we can all harness their power to live longer, healthier, and more fulfilling lives.\n\nConsider this your front-row seat to the revolution in brain health and longevity. I’ll be sharing my thoughts on the latest research, innovations, and trends that are transforming the way we age. Whether you’re a healthcare professional, a tech enthusiast, or simply curious about the future, join us as we unlock the Age of Possibility together.\n\nLet’s explore, learn, and reimagine what it means to grow older in a world brimming with potential.",
  ctaLabel: "Learn More",
};

const AboutKiSection = () => {
  const [content, setContent] = useState<AboutKiContent | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetch("/api/about-ki");
        if (!res.ok) throw new Error("Failed to load About Ki content");
        const data = (await res.json()) as AboutKiContent | null;
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

  const badgeLabel = content?.badgeLabel || FALLBACK_ABOUT.badgeLabel!;
  const heading = content?.heading || FALLBACK_ABOUT.heading!;
  const body = content?.body || FALLBACK_ABOUT.body!;
  const ctaLabel = content?.ctaLabel || FALLBACK_ABOUT.ctaLabel!;
  const imageUrl = content?.imageUrl || "/ki.png";

  const bodyParagraphs = body.split(/\n\n+/);

  const renderHeading = () => {
    // Support both straight and curly apostrophes
    const targets: string[] = ["I'm Ki", "I’m Ki"];
    let target: string | null = null;
    let idx = -1;

    for (const t of targets) {
      const found = heading.indexOf(t);
      if (found !== -1) {
        target = t;
        idx = found;
        break;
      }
    }

    if (idx === -1 || !target) {
      return heading;
    }

    return (
      <>
        {heading.slice(0, idx)}
        <span style={{ color: COLORS.brandRed }}>{target}</span>
        {heading.slice(idx + target.length)}
      </>
    );
  };

  return (
    <section className="w-full py-16 md:py-20 lg:py-24 ">
      <div className="mx-auto px-4 sm:px-6 lg:px-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Left: layered image block */}
        <div className="relative w-full max-w-[632px] aspect-square shrink-0">
          {/* Dark navy shadow block */}
          <div
            className="absolute w-[80%] h-[80%] bg-[#023047] rounded-3xl"
            style={{ left: 0, bottom: "3rem" }}
          />

          {/* Light slate block with white border (same size as navy block) */}
          <div
            className="absolute w-[80%] h-[80%] rounded-3xl border-[6px] border-[#FAF9F8] bg-[#64748B] overflow-hidden"
            style={{ left: "2rem", top: "3rem" }}
          >
            <img
              src={imageUrl}
              alt="Ki portrait"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right: content */}
        <div className="w-full max-w-xl flex flex-col items-start gap-8">
          {/* Badge */}
          <button className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#E2E8F0]">
            <span className="font-inter text-sm md:text-base font-light text-[#64748B]">
              {badgeLabel}
            </span>
          </button>

          <div className="flex flex-col gap-6">
            {/* Heading */}
            <h2 className="font-sora text-2xl md:text-3xl lg:text-4xl font-bold text-[#1E293B]">
              {renderHeading()}
            </h2>

            {/* Body copy */}
            <div className="font-inter text-[15px] md:text-[16px] leading-[26px] md:leading-[28px] text-[#505050] space-y-4">
              {bodyParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            className="mt-2 inline-flex items-center justify-center px-8 md:px-10 py-3 rounded-full text-sm md:text-base text-white"
            style={{ backgroundColor: COLORS.brandNavy }}
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutKiSection;
