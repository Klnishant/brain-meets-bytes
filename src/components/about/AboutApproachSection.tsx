"use client";

import { useEffect, useState } from "react";

type ApproachPoint = {
  title?: string;
  description?: string;
  iconUrl?: string;
};

type ApproachContent = {
  heading?: string;
  body?: string;
  points?: ApproachPoint[];
};

const FALLBACK_APPROACH: ApproachContent = {
  heading: "Science First. Human Always.",
  body:
    "And we’re just getting started. Join us as we uncover new knowledge, challenge assumptions, and explore what’s truly possible for the future of human health.",
  points: [
    {
      title: "Conversations with top global experts",
      description:
        "Neuroscientists, longevity pioneers, physicians, researchers & technologists.",
      iconUrl: "./broadcast-mic.png",
    },
    {
      title: "Accessible to everyone",
      description: "Clear, engaging content you can actually apply.",
      iconUrl: "./click 1.png",
    },
    {
      title: "Evidence-based exploration",
      description: "We verify facts — no hype, no misinformation.",
      iconUrl: "./fingerprint 1.png",
    },
    {
      title: "Curated insights from every episode",
      description: "Key takeaways, resources, and actionable learnings.",
      iconUrl: "./idea 1.png",
    },
  ],
};

const AboutApproachSection = () => {
  const [content, setContent] = useState<ApproachContent | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetch("/api/about-approach");
        if (!res.ok) throw new Error("Failed to load About approach content");
        const data = (await res.json()) as ApproachContent | null;
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

  const heading = content?.heading ?? FALLBACK_APPROACH.heading!;
  const body = content?.body ?? FALLBACK_APPROACH.body!;
  const points =
    Array.isArray(content?.points) && content.points.length > 0
      ? content.points
      : FALLBACK_APPROACH?.points!;

  return (
    <section className="w-full bg-[#FAF9F8] py-16 md:py-20 lg:py-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-16 flex flex-col lg:flex-row gap-12 lg:gap-20 items-start lg:items-center">
        {/* Left: points list */}
        <div className="w-full  flex flex-col gap-4">
          {points.map((point, idx) => (
            <article
              key={idx}
              className="group flex items-center gap-6 bg-white border border-[#E2E8F0] rounded-2xl px-4 py-4 md:px-6 md:py-5 transition-shadow duration-200 hover:shadow-md"
            >
              {point?.iconUrl && (
                <img
                  src={point?.iconUrl}
                  alt={point?.title || "Icon"}
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                />
              )}

              <div className="flex flex-col justify-center flex-1 overflow-hidden">
                <h3 className="font-sora text-lg md:text-xl lg:text-2xl font-bold text-[#1E293B] transition-transform transition-colors duration-200 group-hover:text-[#D62828] group-hover:-translate-y-1.5">
                  {point.title}
                </h3>
                {point.description && (
                  <p className="font-inter text-sm md:text-base text-[#505050] max-h-0 opacity-0 group-hover:max-h-16 group-hover:opacity-100 transition-all duration-200">
                    {point.description}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Right: heading + body */}
        <div className="w-full lg:max-w-xl flex flex-col gap-6">
          <h2 className="font-sora text-2xl md:text-3xl lg:text-4xl font-bold text-[#D62828]">
            {heading}
          </h2>
          <p className="font-inter text-sm md:text-base leading-7 text-[#505050] max-w-[653px]">
            {body}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutApproachSection;
