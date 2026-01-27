'use client';

import { COLORS } from "@/lib/constants";
import { ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";

type ForumContent = {
  _id: string;
  heading: string;
  descriptionTag: string;
  description: string;
  Card: {
    title: string;
    description: string;
    user: string;
    role: string;
    tags: string[];
    date: string;
    repliesCount: number;
    reactionCount: number;
    profileImageUrl: string;
  }
};

type ForumCardProps = {
  faded?: boolean;
  className?: string;
  Card: {
    title: string;
    description: string;
    user: string;
    role: string;
    tags: string[];
    date: string;
    repliesCount: number;
    reactionCount: number;
    profileImageUrl: string;
  }
};

const FALL_BACK_CONTENT: ForumContent = {
  _id: "",
  heading: "",
  descriptionTag: "",
  description: "",
  Card: {
    title: "",
    description: "",
    user: "",
    role: "",
    tags: [],
    date: "",
    repliesCount: 0,
    reactionCount: 0,
    profileImageUrl: "",
  },
}

const ForumCard = ({ faded, className, Card }: ForumCardProps) => {
  return (
    <div
      className={`rounded-2xl border border-[#E2E8F0] bg-white shadow-md px-4 md:px-8 py-4 md:py-8 flex flex-col gap-3 md:gap-6 ${
        faded ? "opacity-60" : ""
      } ${className ?? ""}`}
    >
      {/* Header: avatar + meta + flag */}
      <div className="flex items-start justify-between gap-3 md:gap-6">
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-12 md:h-12 rounded-full border-2 border-[#F77F00] overflow-hidden">
              <img
                src={`${Card?.profileImageUrl}`}
                alt="Sara Jones avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <span className="font-inter text-base font-normal text-[#1E293B]">
                 {Card?.user}
                </span>
                <span className="hidden md:inline-block w-px h-4 bg-[#64748B] rounded-full" />
                <span className="hidden md:block font-inter text-sm font-light text-[#64748B]">3 days ago</span>
              </div>
              <span className="font-inter text-xs font-semibold text-[#505050]">{Card?.role}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center justify-center px-2.5 md:px-3 py-1 rounded-full bg-[#64748B] text-[10px] md:text-[11px] text-white font-inter">
              {Card?.tags?.join(", ")}
            </span>
            <span className="inline-flex items-center justify-center px-2.5 md:px-3 py-1 rounded-full border border-[#64748B] text-[10px] md:text-[11px] text-[#64748B] font-inter">
              {Card?.repliesCount} replies
            </span>
          </div>
        </div>

        <button className="flex items-center justify-center w-6 h-6 md:w-10 md:h-10 rounded-full bg-[#D62828]">
          <img src="/flag.png" alt="Flag post" className="w-2.5 h-2.5 md:w-4 md:h-4 object-contain" />
        </button>
      </div>

      {/* Title + body */}
      <div className="flex flex-col gap-2 md:gap-3">
        <h3 className="font-sora text-[16px] md:text-2xl font-semibold text-black">
          {
            Card?.title?.split(" ").map((word, index) => (
              <span key={index} className={`${index >= 2 ? "italic" : ""}`}>
                {word}{" "}
              </span>
            ))
          }
        </h3>
        <p className="font-inter text-xs md:text-base text-[#333333] md:leading-7 line-clamp-7">
          {Card?.description}
        </p>
      </div>

      {/* Footer buttons */}
      <div className="flex items-center justify-between flex-wrap gap-3 md:gap-4">
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-3 md:px-4 py-1 md:py-2 rounded-full border border-[#64748B] bg-white">
            <ThumbsUp
              className="w-2.5 h-2.5 text-[#64748B] md:w-3.5 md:h-3.5 object-contain"
            />
            <span className="font-inter text-[10px] md:text-sm text-[#64748B]">{Card?.reactionCount}</span>
          </button>

          <button className="inline-flex items-center gap-2 px-3 md:px-4 py-1 md:py-2 rounded-full border border-[#64748B] bg-white">
            <img
              src="/comment.png"
              alt="Comments"
              className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 object-contain"
            />
            <span className="font-inter text-[10px] md:text-sm text-[#64748B]">{Card?.repliesCount}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-3 md:px-4 py-1 md:py-2 rounded-full border border-[#64748B] bg-white">
            <span className="font-inter text-[10px] md:text-sm text-[#64748B]">Share</span>
          </button>
          <button className="inline-flex items-center justify-center gap-2 w-5.5 h-5.5 md:w-9 md:h-9 rounded-full border border-[#64748B] bg-white">
            <img src="/save.png" alt="Save post" className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 object-contain" />
          </button>
        </div>
      </div>
    </div>
  );
};

const AboutJoinCommunitySection = () => {
  const [content, setContent] = useState<ForumContent | null>(null);
    
    useEffect(() => {
      const fetchContent = async () => {
        const response = await fetch("/api/about-forum");
        const data = await response.json() as ForumContent;
        setContent(data);
        console.log(data);
        
      };
      fetchContent();
    }, []);
  return (
    <section className="w-full bg-[#FAF9F8] py-20 md:py-30 lg:py-40">
      <div className="mx-auto px-4 sm:px-6 lg:px-16 flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
        {/* Left: text + CTA */}
        <div className="w-full max-w-xl flex flex-col items-start gap-8 order-1 lg:order-0">
          <div className="flex flex-col gap-4">
            <h2 className="font-sora text-2xl md:text-3xl lg:text-4xl font-bold text-black">
              {
                content?.heading?.split(" ").map((word, index) => (
                  <span key={index} className={`${index  === 1 ? "text-[#D62828]" : ""}`}>
                    {word}{" "}
                  </span>
                ))
              }
            </h2>
            <p className="font-inter text-sm md:text-base text-[#505050] leading-7">
              {content?.descriptionTag}
            </p>
            <p className="font-inter text-sm md:text-base text-[#505050] leading-7">
              {content?.description}
            </p>
          </div>

          <button
            className="w-full md:w-autoinline-flex items-center justify-center px-8 md:px-10 py-3 rounded-full text-sm md:text-base text-white"
            style={{ backgroundColor: COLORS.brandRed }}
          >
            Join Now!
          </button>
        </div>

        {/* Right: stacked forum cards (horizontal fan) */}
        <div className="relative w-full max-w-[662px] h-[400px] md:h-[420px] order-2 lg:order-none">
          {/* Back left card */}
          <ForumCard
            faded
            className="absolute top-0 -left-1.5 md:left-10 w-[276px] md:w-full max-w-sm scale-90"
            Card={content?.Card || FALL_BACK_CONTENT.Card}
          />

          {/* Back right card */}
          <ForumCard
            faded
            className="absolute top-0 -right-1 md:right-10 w-[276px] md:h-auto md:w-full max-w-sm scale-90"
            Card={content?.Card || FALL_BACK_CONTENT.Card}
          />

          {/* Front center card */}
          <ForumCard
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[276px] md:w-full max-w-sm z-10"
            Card={content?.Card || FALL_BACK_CONTENT.Card}
          />
        </div>
      </div>
    </section>
  );
};

export default AboutJoinCommunitySection;
