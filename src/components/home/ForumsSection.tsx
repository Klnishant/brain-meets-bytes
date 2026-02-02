'use client';

import { COLORS } from "@/lib/constants";
import { intervalToDuration } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";

type ForumContent = {
  _id: string;
  heading: string;
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
  heading: "Join the Brain Meets Bytes Community",
  description: "Connect with listeners, researchers, and practitioners who care about brain health and longevity. Ask questions, share ideas, and continue the conversations that start in each episode.",
  Card: {
    title: "Key takeaways from ‘The Future of Cognitive Enhancement’",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc interdum egestas eleifend. Nulla est tortor, iaculis eu iaculis ut, congue at sapien. Mauris gravida congue vulputate. Suspendisse vitae magna at sem vehicula porttitor. Suspendisse eget pretium elit, ut dapibus massa. Sed vulputate dolor mattis, pretium lorem quis, ullamcorper justo.",
    user: "Sara Jones",
    role: "Member",
    tags: ["Episode Discussion"],
    date: "",
    repliesCount: 18,
    reactionCount: 6,
    profileImageUrl: "forum-user-1.jpg",
  },
};

const ForumCard = ({ faded, className, Card }: ForumCardProps) => {
  const duration = intervalToDuration({
      start: new Date(Card?.date),
      end: new Date(),
    });
  
    let time = "just now";
  
    if (duration?.years) {
      time = `${duration.years} years ago`;
    } else if (duration?.months) {
      time = `${duration.months} months ago`;
    } else if (duration?.weeks) {
      time = `${duration.weeks} weeks ago`;
    } else if (duration?.days) {
      time = `${duration.days} days ago`;
    } else if (duration?.hours) {
      time = `${duration.hours} hours ago`;
    } else if (duration?.minutes) {
      time = `${duration.minutes} minutes ago`;
    }
  return (
    <div
      className={`rounded-2xl border border-[#E2E8F0] bg-white shadow-md px-6 md:px-8 py-6 md:py-8 flex flex-col gap-6 ${
        faded ? "opacity-60" : ""
      } ${className ?? ""}`}
    >
      {/* Header: avatar + meta + flag */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-[#F77F00] overflow-hidden">
              <img
                src={Card?.profileImageUrl}
                alt="Sara Jones avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <span className="font-inter text-base font-normal text-[#1E293B]">
                  {Card?.user}
                </span>
                <span className="inline-block w-px h-4 bg-[#64748B] rounded-full" />
                <span className="font-inter text-sm font-light text-[#64748B]">{time}</span>
              </div>
              <span className="font-inter text-xs font-semibold text-[#505050]">{Card?.role}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#64748B] text-[11px] text-white font-inter">
              {Card?.tags.join(", ")}
            </span>
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-[#64748B] text-[11px] text-[#64748B] font-inter">
             {Card?.repliesCount} replies
            </span>
          </div>
        </div>

        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-[#D62828]">
          <img src="/flag.png" alt="Flag post" className="w-4 h-4 object-contain" />
        </button>
      </div>

      {/* Title + body */}
      <div className="flex flex-col gap-3">
        <h3 className="font-sora text-xl md:text-2xl font-semibold text-black">
          {Card?.title}
        </h3>
        <p className="font-inter text-sm md:text-base text-[#333333] leading-7">
          {Card?.description}
        </p>
      </div>

      {/* Footer buttons */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#64748B] bg-white">
            <img
              src="/comment.png"
              alt="Comments"
              className="w-3.5 h-3.5 object-contain"
            />
            <span className="font-inter text-xs md:text-sm text-[#64748B]">{Card?.repliesCount}</span>
          </button>

          {/* Upvote / downvote pill */}
          <button className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#64748B] bg-white">
            <img
              src="/vote-arrow.png"
              alt="Upvote"
              className="w-3.5 h-3.5 object-contain"
            />
            <span className="font-inter text-xs md:text-sm text-[#64748B]">{Card?.reactionCount}</span>
            <img
              src="/vote-arrow.png"
              alt="Downvote"
              className="w-3.5 h-3.5 object-contain rotate-180"
            />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#64748B] bg-white">
            <span className="font-inter text-xs md:text-sm text-[#64748B]">Share</span>
          </button>
          <button className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#64748B] bg-white">
            <img src="/save.png" alt="Save post" className="w-3.5 h-3.5 object-contain" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ForumsSection = () => {
  const [content, setContent] = useState<ForumContent | null>(null);
  
  useEffect(() => {
    const fetchContent = async () => {
      const response = await fetch("/api/home-forum");
      const data = await response.json() as ForumContent;
      setContent(data);
      console.log(data);
      
    };
    fetchContent();
  }, []);
  return (
    <section className="w-full py-16 md:py-20 lg:py-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-16 flex flex-col lg:flex-row items-center gap-50 lg:gap-20">
        {/* Left: stacked forum cards */}
        <div className="relative w-full max-w-2xl h-[360px] md:h-[420px]">
          {/* Back top card */}
          <ForumCard faded className="absolute w-full md:w-auto md:left-4 md:right-4 -top-22 md:-top-20 scale-95" Card={content?.Card || FALL_BACK_CONTENT.Card} />

          {/* Back bottom card */}
          <ForumCard faded className="absolute w-full md:w-auto md:left-4 md:right-4 top-20 md:top-16 scale-95" Card={content?.Card || FALL_BACK_CONTENT.Card} />

          {/* Front main card */}
          <ForumCard className="relative z-10" Card={content?.Card || FALL_BACK_CONTENT.Card} />
        </div>

        {/* Right: text + CTA */}
        <div className="w-full max-w-lg flex flex-col md:items-start gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="font-sora text-2xl md:text-3xl lg:text-4xl font-bold text-[#1E293B]">
              {
                content?.heading?.split(" ")?.map((word, index) => (
                  <span key={index} className={`${index  === 5 ? "text-[#D62828]" : ""}`}>
                    {word}{" "}
                  </span>
                )) ?? FALL_BACK_CONTENT.heading.split(" ")?.map((word, index) => (
                  <span key={index} className={`${index  === 5 ? "text-[#D62828]" : ""}`}>
                    {word}{" "}
                  </span>
                ))
              }
            </h2>
            <p className="font-inter text-sm md:text-base text-[#505050] leading-7">
              {content?.description ?? FALL_BACK_CONTENT.description}
            </p>
          </div>

          <Link href="/about">
              <button
            className="inline-flex items-center justify-center px-8 md:px-10 py-3 rounded-full text-sm md:text-base text-white"
            style={{ backgroundColor: COLORS.brandNavy }}
          >
            Learn More
          </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ForumsSection;
