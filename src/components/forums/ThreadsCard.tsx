"use client";

import { COLORS } from "@/lib/constants";
import { Share2, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { intervalToDuration } from "date-fns";
import Link from "next/link";

type Category = {
  CategoryId: number;
  title: string;
  route: string;
  color: string;
};
type Thread = {
  _id: string;
  title: string;
  content: string;
  CategoryId: Array<Number>;
  images: Array<string>;
  userId: Number;
  likesCount: Number;
  commentsCount: Number;
  createdAt: string;
  updatedAt: string;
  ThreadId: Number;
  user: {
    userId: Number;
    name: string;
    email: string;
    ProfilePic: string;
  };
  categories: Array<Category>;
};

type ThreadsCardProps = {
  thread: Thread;
}

const ThreadsCard: React.FC<ThreadsCardProps> = ({thread})=> {
  const duration = intervalToDuration({
    start: new Date(thread?.createdAt),
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
    <Link href={`/forums/${thread?.ThreadId}`}>
      <div className="flex flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5">
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex  items-center justify-between">
          <div className="flex gap-3 items-center md:items-start">
            <div className="h-9 w-9 md:h-15 md:w-15 overflow-hidden rounded-full">
              <img
                src={"./ki.png"}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-sora font-semibold text-[#1E293B] text-[16px] md:text-xl leading-6">
                {thread?.user?.name}{" "}
                <span className="font-sora font-light text-[#1E293B] text-[16px] md:text-xl leading-6">
                  #{`${thread?.ThreadId}`}
                </span>
              </h1>
              <p className="font-inter font-light text-[#64748B] text-[12px] md:text-sm leading-[18px]">
                {time}
              </p>
            </div>
          </div>
          <div>
            <button className="flex items-center justify-center h-8 w-8 md:h-auto md:w-auto  md:px-4 gap-2.5 rounded-full border border-[#D62828] bg-[#D62828] md:bg-white py-2">
              <img
                src="/red-flag.png"
                alt="Flag post"
                className="w-[14px] h-[14px] hidden md:block md:w-4 md:h-4 object-contain"
              />
              <img
                src="/flag.png"
                alt="Flag post"
                className="w-[14px] h-[14px] block md:hidden md:w-4 md:h-4 object-contain"
              />
              <span className="hidden md:block text-[#D62828]">Report</span>
            </button>
          </div>
        </div>
        <div className="w-fit flex gap-3 text-[#64748B] items-center justify-center">
          {thread?.categories &&
            thread?.categories.map((category) => (
              <>
                <div
                  className="rounded-full border text-[10px] md:text-base gap-2.5 px-2.5 py-1 md:py-2 opacity-100"
                >
                  {category.title}
                </div>
              </>
            ))}
        </div>
        <div>
          <div className="flex flex-col gap-4">
            <h1 className="font-sora font-semibold text-[#1E293B] text-[16px] md:text-2xl leading-6">
              {thread?.title}
            </h1>
            <div>
              {thread?.images &&
                thread?.images.map((image) => (
                  <>
                    <img src={image} alt="" className="w-full h-full rounded-xl" />
                  </>
                ))}
            </div>
            <p className="font-inter font-light text-[#64748B] text-[12px] md:text-sm leading-[18px]">
              {thread?.content}
            </p>
          </div>
        </div>
        <div>
          {/*BTNS*/}
          <div className="w-full">
            <div className="w-full flex items-center justify-between gap-3 md:gap-6">
              <div className="flex items-center gap-3">
                {/* Like */}
                <button className="flex items-center gap-2 px-4 py-2 border border-[#2A4157] rounded-full text-[#64748B] hover:bg-[#1A2A38] transition">
                  <img src="/like.png" alt="" className="h-3 w-3 md:h-3.5 md:w-3.5" />
                  <span className="text-[12px] md:text-[14px]">{`${thread?.likesCount}`}</span>
                </button>

                {/* Comments */}
                <button className="flex items-center gap-2 px-4 py-2 border border-[#2A4157] rounded-full text-[#64748B] hover:bg-[#1A2A38] transition">
                  <img
                    src="/comment.png"
                    alt=""
                    className="h-3 w-3 md:h-3.5 md:w-3.5"
                  />
                  <span className="text-[12px] md:text-[14px]">{`${thread?.commentsCount}`}</span>
                </button>
              </div>
              <div className="flex items-center gap-3">
                {/* Share */}
                <button className="flex items-center gap-2 px-4 py-2 border border-[#2A4157] rounded-full text-[#64748B] hover:bg-[#1A2A38] transition">
                  <img src="/share 1.png" alt="" className="h-3 w-3 md:h-3.5 md:w-3.5" />
                  <span className="text-[12px] md:text-[14px]">Share</span>
                </button>

                {/* Save */}
                <button className="flex items-center h-8 w-8 md:h-auto md:w-auto justify-center gap-2 md:px-4 md:py-2 border border-[#2A4157] rounded-[36px] md:rounded-full text-[#64748B] hover:bg-[#1A2A38] transition">
                  <img
                    src="/save.png"
                    alt=""
                    className="h-3 w-3 md:h-3.5 md:w-3.5"
                  />
                  <span className="hidden md:block text-[12px] md:text-[14px]">Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Link>
  );
}

export default ThreadsCard;