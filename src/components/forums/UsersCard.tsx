"use client";

import { COLORS } from "@/lib/constants";
import Link from "next/link";
import React, { useState } from "react";

const UsersCard = ({
  _id,
  name,
  role,
  userId,
  ProfilePic,
}: {
  _id: string;
  name: string;
  role: string;
  userId: number;
  ProfilePic: string;
}) => {
    const [Follow, setFollow] = useState(false);

    const handleFollow = () => {
      setFollow(!Follow);
    }

  return (
    <Link
      href={`/users/${userId}`}
      className="flex flex-col w-full items-center gap-2 rounded-md border border-zinc-200 p-2"
    >
      <div className={`flex items-center p-1 gap-3 rounded-md w-full`}>
        <div
          className={`w-[49px] h-[42px] rounded-full border-[1px] border-[#E2E8F0] opacity-100 flex items-center justify-center`}
        >
          <img
            src={ProfilePic || "/forum-user-1.jpg"}
            alt=""
            className=" w-full h-full rounded-full opacity-100 object-cover"
          />
        </div>
        <div className="w-full">
          <div className="w-full flex items-center justify-between gap-1">
            <div className="">
              <h1 className="font-inter font-semibold text-[#023047] text-lg leading-7">
                {name}
              </h1>
              <div className="w-full">
            <p className="font-inter font-normal text-[#505050] text-[14px] leading-[100%] tracking-normal">
              {role}
            </p>
          </div>
            </div>
            <div className="rounded-full px-3 py-[2px] gap-[10px] border border-[#E2E8F0] bg-[#FAF9F8]">
              <p className="font-inter font-normal text-[12px] leading-[100%] tracking-normal text-[#505050]">
                {Follow ? "Following" : "Follow"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default UsersCard;
