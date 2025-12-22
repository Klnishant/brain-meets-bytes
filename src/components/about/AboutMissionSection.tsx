"use client";

import { useEffect, useState } from "react";

type AboutMissionContent = {
  title?: string;
  body?: string[];
  ctaLabel?: string;
  imageUrl?: string;
};

const FALLBACK_MISSION: AboutMissionContent = {
  title: "Our Mission",
  body: [
    "We believe lasting brain health should be within everyones reach. Our mission is to bridge the gap between cutting-edge scientific research and everyday people — by speaking with leading experts across neuroscience, aging science, cognition, biotechnology, and more.",
    "Through thoughtful conversations and curated insights, we aim to demystify complex science and inspire informed decisions that support lifelong brain performance.",
  ],
  ctaLabel: "Learn More",
  imageUrl: "/about-mission.png",
};

const AboutMissionSection = () => {
  const [content, setContent] = useState<AboutMissionContent | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetch("/api/about-mission");
        if (!res.ok) throw new Error("Failed to load About mission");
        const data = (await res.json()) as AboutMissionContent | null;
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

  const title = content?.title ?? FALLBACK_MISSION.title!;
  const body = Array.isArray(content?.body) && content?.body.length > 0 ? content.body : FALLBACK_MISSION.body!;
  const ctaLabel = content?.ctaLabel ?? FALLBACK_MISSION.ctaLabel!;
  const imageUrl = content?.imageUrl ?? FALLBACK_MISSION.imageUrl!;

  return (
    <section className="w-full bg-[#FAF9F8] py-16 md:py-20 lg:py-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Left: text content */}
        <div className="w-full max-w-xl flex flex-col items-start gap-8 order-2 lg:order-1">
          <div className="flex flex-col gap-6">
            <h2 className="font-sora text-2xl md:text-3xl lg:text-4xl font-bold text-[#1E293B]">
              {title?.replace("Mission", "").trim() || "Our"} <span className="text-[#D62828]">Mission</span>
            </h2>
            <div className="font-inter text-[15px] md:text-[16px] leading-[26px] md:leading-[28px] text-[#505050] space-y-4 max-w-[653px]">
              {body.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          <button className="w-full md:w-auto mt-2 inline-flex items-center justify-center px-8 md:px-10 py-3 rounded-full bg-[#023047] text-sm md:text-base text-[#FAF9F8]">
            {ctaLabel}
          </button>
        </div>

        {/* Right: layered mission image block */}
        <div className="relative w-full max-w-[632px] aspect-square shrink-0 order-1 lg:order-2">
          {/* Red shadow block */}
          <div
            className="absolute w-[80%] h-[80%] bg-[#D62828] rounded-3xl"
            style={{ right: 0, top: "1.5rem" }}
          />

          {/* Slate block with white border and mission image */}
          <div
            className="absolute w-[80%] h-[80%] rounded-3xl border-[6px] border-[#FAF9F8] bg-[#011627] overflow-hidden"
            style={{ right: "1.75rem", top: "3.25rem" }}
          >
            <img
              src={imageUrl}
              alt="Illustration of a brain representing our mission"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMissionSection;
