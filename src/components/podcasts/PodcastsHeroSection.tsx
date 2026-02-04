"use client";

import { useEffect, useState } from "react";
import { COLORS } from "@/lib/constants";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Redux/store";
import { openLogIn } from "@/Redux/slices/LogInSlice";
import { getUser } from "@/lib/getUser";
import { openMembership } from "@/Redux/slices/MemberShipSlice";

type Podcast = {
  _id: string;
  title?: string;
  author?: string;
  date?: string;
  imageUrl?: string;
  tags?: string[];
  podcastCount?: number;
};

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  RoleId: number;
  Rolename: string;
  hasmembership: boolean;
  userId: number;
  ProfilePic: string;
};

type PodcastHeroContent = {
  heading: string;
  description: string;
  slug?: string;
  newReleasePodcastTitle: string;
  author: string;
  imageUrl: string;
  date: string;
  tags: string[];
  podcastCount: number;
};

const FALL_BACK_CONTENT: PodcastHeroContent = {
  heading: "Explore Breakthroughs in Brain Health & Longevity",
  description:
    "Explore conversations with leading experts advancing brain health, neuroscience, and human longevity. Listen, learn, and discover the ideas shaping the future of how we think, age, and thrive.",
  slug: "",
  newReleasePodcastTitle:
    "The New Light Frontier: How Photonic Computing Could Transform Brain Health and the Future of Care",
  author: "Ki Siadatan",
  imageUrl: "./podcast-demo.png",
  date: "2025-12-25 21:53",
  tags: ["NueroScience", "Longevity", "Psycology"],
  podcastCount: 200,
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
  const [content, setContent] = useState<PodcastHeroContent | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setToken(auth?.auth?.token);
    setUserId(auth?.auth?.userId);
  }, [auth]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const contentRes = await fetch("/api/podcast-hero");
        if (!contentRes.ok) {
          throw new Error("Failed to load podcast hero content");
        }

        const contentData = (await contentRes.json()) as PodcastHeroContent;
        if (!mounted) return;
        setContent(contentData);
        console.log(contentData);
      } catch (e: any) {
        if (!mounted) return;
        setContent(null);
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
      const user = async () => {
        if (!token) return;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/one?userId=${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        const data = await res.json();
  
        if (res.ok) {
          setUser(data?.data);
        }
      };
      user();
    }, [token]);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

  const {
    newReleasePodcastTitle,
    author,
    date,
    imageUrl,
    tags = [],
    podcastCount,
  } = content || {};

  const newLocal = "flex items-center gap-3";
  return (
    <section className=" w-full  bg-[#FAF9F8] pb-20 md:pb-24 lg:pb-28 pt-20 md:pt-44 lg:pt-48">
      <div className="relative mx-auto  max-w-[1920px]  px-4 sm:px-6 lg:px-16">
        <div className="w-full sm:w-[1070px] xl:w-[1857px] h-[392px] xl:h-[1016px] absolute -top-[118px] left-[-90px] lg:-top-[30%] lg:left-[-426px] opacity-[30%] rotate-90 lg:rotate-0 overflow-hidden">
          <img
            src="/article-bg.png"
            alt="Podcasts Background"
            className=" h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:mb-16">
          <div className=" w-full max-w-[1259px] max-h-[213px]">
            <h2 className="font-sora z-1 text-[32px] md:text-4xl xl:text-[56px] font-bold text-center md:text-start text-[#1E293B]">
              {content?.heading.split(" ").map((word, i) => (
                <span key={i} className={i === 1 ? "text-[#D62828]" : ""}>
                  {word}{" "}
                </span>
              )) ??
                FALL_BACK_CONTENT.heading.split(" ").map((word, i) => (
                  <span key={i} className={i === 1 ? "text-[#D62828]" : ""}>
                    {word}{" "}
                  </span>
                ))}
            </h2>
          </div>
          <div className="h-[213px] flex flex-col gap-8 ">
            <p className="font-inter md:w-[600px] z-1 text-[12px] md:text-base xl:text-[18px] leading-relaxed text-center md:text-start text-[#505050] max-w-[951px] font-400">
              {content?.description ?? FALL_BACK_CONTENT.description}
            </p>
            <button
              onClick={() => {
                document
                  .getElementById("podcasts-list")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center w-full z-10 md:w-[295px] h-[50px] justify-center gap-3 rounded-full px-10 py-3 text-sm md:text-base font-normal text-white"
              style={{ backgroundColor: COLORS.brandRed }}
            >
              <span className={newLocal}>
                {/* Left dropdown arrow icon */}
                <img
                  src="/dropdown-arrow.png"
                  alt="Open"
                  className="h-4 w-4 object-contain"
                />

                <span>
                  Discover all{" "}
                  {String(
                    content?.podcastCount ?? FALL_BACK_CONTENT?.podcastCount,
                  )}
                  +
                </span>

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
              src={content?.imageUrl ?? FALL_BACK_CONTENT.imageUrl}
              alt={"Podcast Hero"}
              className="h-full w-full rounded-2xl"
            />
            <div />
          </div>
          {/* content */}
          <div className="relative z-10 flex flex-col px-3 md:px-6  w-full">
            {/* Meta chips row 1 */}
            <div className="flex flex-wrap justify-between w-full">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#D62828] px-3 py-1">
                <span className="inline-block h-3 w-3 rounded-full bg-[#FAF9F8]" />
                <span className="font-inter text-[10px] md:text-[14px] text-[#FAF9F8]">
                  New Release
                </span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E2E8F0] px-3 py-1">
                <span className="font-inter text-[10px] md:text-[14px] text-[#1E293B]">
                  {content?.author ?? FALL_BACK_CONTENT.author}
                </span>
              </div>
            </div>
            <div className="w-full h-[256px] mt-8 flex flex-col items-center justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center w-full mb-2">
                  <span className="font-inter text-[10px] md:text-[14px] text-[#FAF9F8]">
                    {content?.date
                      ? formatDate(content.date)
                      : formatDate(FALL_BACK_CONTENT.date)}
                  </span>
                </div>
                {/* Meta chips row 2: tags */}
                {content?.tags && content?.tags?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3 w-full justify-center">
                    {content?.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full border border-[#FAF9F8] px-3 py-1 font-inter text-[10px] md:text-[14px] text-[#FAF9F8]"
                      >
                        {tag}
                      </span>
                    )) ?? (
                      <div>
                        {FALL_BACK_CONTENT.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center rounded-full border border-[#FAF9F8] px-3 py-1 font-inter text-[10px] md:text-[14px] text-[#FAF9F8]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {/* Title */}
                <div className="flex flex-col gap-4">
                  <h2 className="font-sora text-[20px] md:text-[28px] md:text-[32px] lg:text-[36px] font-semibold leading-[1.25] text-[#FAF9F8] text-center">
                    {content?.newReleasePodcastTitle ??
                      FALL_BACK_CONTENT.newReleasePodcastTitle}
                  </h2>
                </div>
              </div>
              {/* Play Now button */}
              <div className="w-full flex justify-center">
                {content?.slug ? (
                  <Link href={`/podcasts/${content?.slug}`}>
                    <button className="inline-flex items-center justify-center gap-4 rounded-[36px] bg-[#FAF9F8] px-8 py-3 text-[16px] font-normal text-[#D62828] w-full md:w-fit">
                      <span>Play Now!</span>
                      <span
                        className="inline-block w-2.5 h-3.5 [clip-path:polygon(0%_0%,100%_50%,0%_100%)]"
                        style={{ backgroundColor: COLORS.brandRed }}
                      />
                    </button>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      dispatch(openLogIn());
                    }}
                    className="inline-flex items-center justify-center gap-4 rounded-[36px] bg-[#FAF9F8] px-8 py-3 text-[16px] font-normal text-[#D62828] w-full md:w-fit"
                  >
                    <span>Play Now!</span>
                    <span
                      className="inline-block w-2.5 h-3.5 [clip-path:polygon(0%_0%,100%_50%,0%_100%)]"
                      style={{ backgroundColor: COLORS.brandRed }}
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
          {/*Membership Button*/}
            {!user?.hasmembership && (
              <div className="absolute inset-0 w-full h-[470px] z-20 flex items-center justify-center rounded-2xl bg-black/40 backdrop-blur-sm">
                <button
                  onClick={() => {
                    dispatch(openMembership());
                  }}
                 className="group relative bg-[#D62828] text-[#F9FAFB] font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3">
                  {/* Lock Icon */}
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <img src="./lock.png" alt="" />
                  </div>

                  <span className="text-base pr-2">
                    Become a member to unlock
                  </span>
                </button>
              </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default PodcastsHeroSection;
