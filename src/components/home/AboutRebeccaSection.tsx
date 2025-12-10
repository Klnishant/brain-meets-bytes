"use client";

import { useEffect, useState } from "react";
import { COLORS } from "@/lib/constants";

type AboutRebeccaContent = {
  badgeLabel?: string;
  heading?: string;
  body?: string;
  ctaLabel?: string;
  imageUrl?: string;
};

const FALLBACK_ABOUT_REBECCA: AboutRebeccaContent = {
  badgeLabel: "About Rebecca",
  heading:
    "Hi, I’m REBECCA, CO-founder of brain meets bytes AND A MASTERS EDUCATED FORENSIC NURSE",
  body:
    "My area of expertise is in gerontology, population health, and forensic nursing. My career is fueled by an innate desire to decipher the complex adaptive systems that shape us as individuals and communities. I am passionately curious about what drives our behavior, sustains our health, and enhances our well-being. With a focus on the intricacies of the human body and the dynamics of collective human behavior, I aim to bridge the gap between healthcare and technological innovation. Through the curated content on this page, I aspire to shed light on the profound connections between human behavior, emerging technologies, and groundbreaking innovations. My goal is to revolutionize the aging process, promoting resilience and vitality.\n\nJoin us as we explore what it means to age resiliently, leveraging insights and advancements to foster a thriving population. Whether you’re a healthcare professional, caregiver, or simply interested in the evolving landscape of your future health, I invite you to engage with the insights and perspectives shared here. Together, we can transform the journey of aging, embracing innovation to enhance the quality of life for all.",
  ctaLabel: "Learn More",
};

const AboutRebeccaSection = () => {
  const [content, setContent] = useState<AboutRebeccaContent | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetch("/api/about-rebecca");
        if (!res.ok) throw new Error("Failed to load About Rebecca content");
        const data = (await res.json()) as AboutRebeccaContent | null;
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

  const badgeLabel = content?.badgeLabel || FALLBACK_ABOUT_REBECCA.badgeLabel!;
  const heading = content?.heading || FALLBACK_ABOUT_REBECCA.heading!;
  const body = content?.body || FALLBACK_ABOUT_REBECCA.body!;
  const ctaLabel = content?.ctaLabel || FALLBACK_ABOUT_REBECCA.ctaLabel!;
  const imageUrl = content?.imageUrl || "/rebecca.png";

  const bodyParagraphs = body.split(/\n\n+/);

  const renderHeading = () => {
    // highlight "I’m REBECCA" / "I'm REBECCA" in red
    const targets: string[] = ["I'm REBECCA", "I’m REBECCA"];
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
    <section className="w-full py-16 md:py-20 lg:py-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Left: content (mirrors About Ki but swapped) */}
        <div className="w-full max-w-xl flex flex-col items-start gap-8 order-2 lg:order-1">
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

        {/* Right: layered image block (mirrored from About Ki) */}
        <div className="relative w-full max-w-[632px] aspect-square shrink-0 order-1 lg:order-2">
          {/* Red shadow block */}
          <div
            className="absolute w-[80%] h-[80%] bg-[#D62828] rounded-3xl"
            style={{ right: 0, bottom: "3rem" }}
          />

          {/* Slate block with white border */}
          <div
            className="absolute w-[80%] h-[80%] rounded-3xl border-[6px] border-[#FAF9F8] bg-[#64748B] overflow-hidden"
            style={{ right: "2rem", top: "3rem" }}
          >
            <img
              src={imageUrl}
              alt="Rebecca portrait"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutRebeccaSection;
