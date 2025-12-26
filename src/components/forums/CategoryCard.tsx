"use client";

import { COLORS } from "@/lib/constants";
import Link from "next/link";
import React from "react";

const CategoryCard = ({
  imageUrl,
  title,
  route,
  color,
  content,
  threadCount,
}: {
  imageUrl: string;
  title: string;
  route: string;
  color: string;
  content: string;
  threadCount: number;
}) => {
  return (
    <Link
      href={route}
      className="flex flex-col w-full items-center gap-2 rounded-md border border-zinc-200 p-2"
    >
      <div className={`flex items-center p-1 gap-3 rounded-md w-full`}>
        <div
          className={`w-[56px] h-[49px] rounded-full opacity-100 bg-black flex items-center justify-center`}
        >
          <img
            src={imageUrl}
            alt=""
            className=" w-6 h-6 opacity-100 object-cover items-center justify-center"
          />
        </div>
        <div className="w-full">
          <div className="w-full flex items-center justify-between gap-1">
            <div className="">
              <h1 className="font-inter font-semibold text-[#023047] text-lg leading-7">
                {title}
              </h1>
            </div>
            <div className="rounded-full px-3 py-[2px] gap-[10px] border border-[#E2E8F0] bg-[#FAF9F8]">
              <p className="font-inter font-normal text-[12px] leading-[100%] tracking-normal text-[#505050]">
                {`${threadCount} Threads`}
              </p>
            </div>
          </div>
          <div className="w-full">
            <p className="font-inter font-normal text-[#505050] text-[14px] leading-[100%] tracking-normal">
              {content}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
