"use client";

import { useEffect, useState } from "react";
import { COLORS } from "@/lib/constants";

type Podcast = {
  _id: string;
  title?: string;
  author?: string;
  date?: string;
  imageUrl?: string;
  tags?: string[];
  podcastCount?: number;
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

const PodcastsHeroSection = () => {
  const [featured, setFeatured] = useState<Podcast | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetch("/api/featured-podcasts");
        if (!res.ok) {
          throw new Error("Failed to load podcasts");
        }

        const data = (await res.json()) as Podcast[];
        if (!mounted) return;
        setFeatured(Array.isArray(data) && data.length > 0 ? data[0] : null);
      } catch (e: any) {
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
    "The New Light Frontier: How Photonic Computing Could Transform Brain Health and the Future of Care";
  const author = featured?.author || "Ki Siadatan";
  const date = formatDate(featured?.date) || "Nov 14, 2025";
  const imageUrl = featured?.imageUrl || "/podcast-hero-image.png";
  const tags = featured?.tags || ["Neuroscience", "Longetivity", "Psychology"];
  const podcastCount = featured?.podcastCount || 0;

  const newLocal = "flex items-center gap-3";
  return (
    <section className=" w-full  bg-[#FAF9F8] pb-20 md:pb-24 lg:pb-28 pt-40 md:pt-44 lg:pt-48">
      <div className="relative mx-auto  max-w-[1920px]  px-4 sm:px-6 lg:px-16">
        <div className="w-full md:w-[1857px] h-[1016px] absolute -top-[30%] left-[-426px] opacity-[30%] rotate-0">
          <img
            src="/article-bg.png"
            alt="Podcasts Background"
            className=" h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
          <div className=" w-full max-w-[1259px] max-h-[213px]">
            <h2 className="font-sora z-1 text-3xl md:text-4xl lg:text-[56px] font-bold text-start text-[#1E293B]">
              Explore{" "}
              <span style={{ color: COLORS.brandRed }}>Breakthroughs</span> in
              Brain Health & Longevity
            </h2>
          </div>
          <div className="h-[213px] flex flex-col gap-8 ">
            <p className="font-inter md:w-[600px] z-1 text-sm md:text-base lg:text-[18px] leading-relaxed text-start text-[#505050] max-w-[951px] font-400">
              Explore conversations with leading experts advancing brain health,
              neuroscience, and human longevity. Listen, learn, and discover the
              ideas shaping the future of how we think, age, and thrive.
            </p>
            <button
              className="inline-flex items-center w-[295px] h-[50px] justify-center gap-3 rounded-full px-10 py-3 text-sm md:text-base font-normal text-white"
              style={{ backgroundColor: COLORS.brandRed }}
            >
              <span className={newLocal}>
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
        </div>
        {/* Featured card */}
        <div className="relative z-10 flex flex-col justify-center gap-8 px-6 py-8 md:px-12 md:py-10 lg:px-13 lg:py-12">
          {/* Background image */}
          <div className="absolute inset-0 w-full h-[470px]">
            <img
              src="/podcast-demo.png"
              alt={title}
              className="h-full w-full rounded-2xl"
            />
            <div />
          </div>
          {/* content */}
          <div className="relative z-10 flex flex-col px-6  w-full">
            {/* Meta chips row 1 */}
            <div className="flex flex-wrap justify-between w-full">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#D62828] px-3 py-1">
                <span className="inline-block h-3 w-3 rounded-full bg-[#FAF9F8]" />
                <span className="font-inter text-[14px] text-[#FAF9F8]">
                  New Release
                </span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E2E8F0] px-3 py-1">
                <span className="font-inter text-[14px] text-[#1E293B]">
                  {author}
                </span>
              </div>
            </div>
            <div className="w-full h-[256px] mt-8 flex flex-col items-center justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center w-full mb-2">
                  <span className="font-inter text-[14px] text-[#FAF9F8]">
                    {date}
                  </span>
                </div>
                {/* Meta chips row 2: tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3 w-full justify-center">
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
                {/* Title */}
                <div className="flex flex-col gap-4">
                  <h2 className="font-sora text-[28px] md:text-[32px] lg:text-[36px] font-semibold leading-[1.25] text-[#FAF9F8] text-center">
                    {title}
                  </h2>
                </div>
              </div>
              {/* Play Now button */}
              <div className="w-full flex justify-center">
                <button className="inline-flex items-center justify-center gap-4 rounded-[36px] bg-[#FAF9F8] px-8 py-3 text-[16px] font-normal text-[#D62828] w-fit">
                  <span>Play Now!</span>
                  <span
                    className="inline-block w-2.5 h-3.5 [clip-path:polygon(0%_0%,100%_50%,0%_100%)]"
                    style={{ backgroundColor: COLORS.brandRed }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PodcastsHeroSection;
