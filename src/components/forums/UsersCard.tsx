"use client";

import { COLORS } from "@/lib/constants";
import { getAuth } from "@/lib/getAuth";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import { set } from "sanity";

type User = {
  _id: string;
  name: string;
  role: string;
  userId: number;
  ProfilePic: string;
};

const UsersCard = () => {
  const [Follow, setFollow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAuth = async () => {
      const auth = await getAuth();
      if (auth) {
        setToken(auth.token);
        setUserId(auth.userId);
      }
      console.log("auth", auth);
    };
    fetchAuth();
  }, []);
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!token) return;

        const res = await fetch(`http://54.172.93.35:7000/api/users`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(res);

        if (!res.ok) {
          throw new Error("Failed to load users");
        }

        const data = (await res.json())?.data as User[];
        if (!mounted) return;
        setUsers(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Failed to load users");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [token]);

  const visibleUsers = users.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 5);
  };

  const handleFollow = () => {
    setFollow(!Follow);
  };

  return (
    <div className="flex flex-col gap-2 justify-between h-full">
      <div className="flex flex-col gap-2">
        {visibleUsers &&
          visibleUsers.map(
            (user) =>
              user?.userId !== userId && (
                <Link
                  key={user?._id}
                  href={`/users/${user?.userId}`}
                  className="flex flex-col w-full items-center gap-2 rounded-md border border-zinc-200 p-1"
                >
                  <div
                    className={`flex items-center p-1 gap-3 rounded-md w-full`}
                  >
                    <div
                      className={`w-[49px] h-[42px] rounded-full border-[1px] border-[#E2E8F0] opacity-100 flex items-center justify-center`}
                    >
                      <img
                        src={user?.ProfilePic || "/forum-user-1.jpg"}
                        alt=""
                        className=" w-full h-full rounded-full opacity-100 object-cover"
                      />
                    </div>
                    <div className="w-full">
                      <div className="w-full flex items-center justify-between gap-1">
                        <div className="">
                          <h1 className="font-inter font-semibold text-[#023047] text-lg leading-7">
                            {user?.name}
                          </h1>
                          <div className="w-full">
                            <p className="font-inter font-normal text-[#505050] text-[14px] leading-[100%] tracking-normal">
                              {user?.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
          )}
      </div>
      <button
        onClick={handleLoadMore}
        className="font-inter font-semibold text-[#D62828] text-base leading-[30px] tracking-normal w-full text-start"
      >
        See More
      </button>
    </div>
  );
};

export default UsersCard;
