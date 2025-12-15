"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { COLORS } from "@/lib/constants";

type Article = {
  _id: string;
  title?: string;
  author?: string;
  date?: string;
  imageUrl?: string;
  tags?: string[];
  excerpt?: string;
  slug?: string;
};

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const ArticlesHeroSection = () => {
  const [featured, setFeatured] = useState<Article | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetch("/api/articles");
        if (!res.ok) throw new Error("Failed to load articles");
        const data = (await res.json()) as Article[];
        if (!mounted) return;
        setFeatured(Array.isArray(data) && data.length > 0 ? data[0] : null);
      } catch {
        if (!mounted) return;
        setFeatured(null);
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  const title =
    featured?.title ||
    "Neurotracks Bet on Digital Brain Health Meets a Market Ready for Change";
  const author = featured?.author || "Ki Siadatan";
  const date = formatDate(featured?.date) || "Nov 14, 2025";
  const tags = featured?.tags && featured.tags.length > 0
    ? featured.tags
    : ["Neuroscience", "Longevity", "Psychology"];
  const excerpt =
    featured?.excerpt ||
    "For more than four decades, cognitive screening in clinics has leaned on paper-and-pencil tools like the Mini-Mental State Examination, followed by newer tests such as the Montreal Cognitive Assessment. These instruments are familiar, quick, and easy to administer, but they can miss subtle impairment, especially early changes in executive function and language. Meta-analyses and head-to-head";
  const imageUrl =
    featured?.imageUrl || "/article-hero-image.png";

  return (
    <section className="w-full  bg-[#FAF9F8] pb-20 md:pb-24 lg:pb-28 pt-40 md:pt-44 lg:pt-48">
      <div className="relative mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-16">
        {/* Background graphic behind hero (centered horizontally) */}
        <div className="pointer-events-none absolute z-0 -top-[30%] left-1/2 h-[834px] w-[820px] -translate-x-[48%]">
          <img
            src="/article-bg.png"
            alt="Articles background"
            className="h-full w-full object-contain opacity-90"
          />
        </div>
        {/* Top heading + copy + CTA */}
        <div className="flex flex-col items-center justify-center gap-8 text-center mb-16">
          <div className="flex flex-col items-center gap-4 max-w-[1259px]">
            <h1 className="font-sora z-1 text-3xl md:text-4xl lg:text-[56px] font-bold leading-tight text-[#1E293B]">
              <span>Articles &amp; </span>
              <span style={{ color: COLORS.brandRed }}>Interviews</span>
            </h1>
            <p className="font-inter z-1 text-sm md:text-base lg:text-[18px] leading-relaxed text-[#505050] max-w-[951px]">
              Stay informed with expert-backed science and emerging research.
            </p>
          </div>

          <button
            className="inline-flex items-center justify-center gap-3 rounded-full px-10 py-3 text-sm md:text-base font-normal text-white"
            style={{ backgroundColor: COLORS.brandNavy }}
          >
            <span className="flex items-center gap-3">
              {/* Left dropdown arrow icon */}
              <img
                src="/dropdown-arrow.png"
                alt="Open"
                className="h-4 w-4 object-contain"
              />

              <span>Discover all 200+</span>

              {/* Right dropdown arrow icon */}
              <img
                src="/dropdown-arrow.png"
                alt="Open"
                className="h-4 w-4 object-contain"
              />
            </span>
          </button>
        </div>

        {/* Featured article card */}
        <div className="relative mx-auto w-full max-w-[1600px] rounded-[32px] border border-[#E2E8F0] bg-[#E2E8F0] overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src={imageUrl}
              alt={title}
              className="h-[1067px] w-full -translate-y-[207px] object-cover"
            />
            {/* Left gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-80" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center gap-8 px-6 py-10 md:px-12 md:py-12 lg:px-16 lg:py-14 max-w-[792px]">
            {/* Meta chips row 1 */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#D62828] px-3 py-1">
                <span className="inline-block h-3 w-3 rounded-full bg-[#FAF9F8]" />
                <span className="font-inter text-[14px] text-[#FAF9F8]">New Release</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E2E8F0] px-3 py-1">
                <span className="font-inter text-[14px] text-[#1E293B]">{author}</span>
              </div>
              <span className="font-inter text-[14px] text-[#FAF9F8]">{date}</span>
            </div>

            {/* Meta chips row 2: tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-[#FAF9F8] px-3 py-1 font-inter text-[14px] text-[#FAF9F8]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title + excerpt */}
            <div className="flex flex-col gap-4">
              <h2 className="font-sora text-[28px] md:text-[32px] lg:text-[36px] font-semibold leading-[1.25] text-[#FAF9F8]">
                {title}
              </h2>
              <p className="font-inter text-[14px] md:text-[16px] leading-[24px] text-[#E2E8F0] max-w-[792px]">
                {excerpt}
              </p>
            </div>

            {/* Read more button */}
            {featured?.slug ? (
              <Link
                href={`/articles/${featured.slug}`}
                className="inline-flex items-center justify-center gap-2 rounded-[36px] bg-[#FAF9F8] px-8 py-3 text-[16px] font-normal text-[#023047] w-fit"
              >
                Read More
              </Link>
            ) : (
              <button className="inline-flex items-center justify-center gap-2 rounded-[36px] bg-[#FAF9F8] px-8 py-3 text-[16px] font-normal text-[#023047] w-fit">
                Read More
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticlesHeroSection;
