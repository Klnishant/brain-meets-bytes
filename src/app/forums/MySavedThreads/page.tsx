"use client";

import Footer from "@/components/core/Footer";
import Navbar from "@/components/core/Navbar";
import ThreadsCard from "@/components/forums/ThreadsCard";
import { getAuth } from "@/lib/getAuth";
import { useEffect, useState } from "react";

type Category = {
  _id: string;
  CategoryId: number;
  title: string;
  route: string;
  color: string;
  description: string;
  threadCount: number;
  imageUrl: string;
};

type Like = {
  userId: number;
  ThreadId: number;
};
type Comment = {
  _id: string;
  userId: number;
  comment: string;
  CommentId: number;
  createdAt: string;
  replies: Array<Comment>;
};
type Thread = {
  _id: string;
  title: string;
  content: string;
  CategoryId: Array<Number>;
  images: Array<string>;
  videos: Array<string>;
  userId: Number;
  likesCount: number;
  commentsCount: number;
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
  comments: Array<Comment>;
  likes: Array<Like>;
};

type savedThread = {
  ThreadId: number;
  thread: Thread;
  savedAt: string;
};

const MySavedThreads = () => {
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [threads, setThreads] = useState<savedThread[]>([]);
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

  const fetchThreads = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}threads/getMySavedThreads`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to load threads");
      }

      const data = (await res.json())?.data as savedThread[];

      console.log(data);

      const fetchedThreads = Array.isArray(data) ? data : [];
      setThreads(fetchedThreads);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load threads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [token, page]);

  const onDelete = (ThreadId: number) =>
    setThreads((prev) =>
      prev.filter((thread) => thread?.ThreadId !== ThreadId),
    );
  const onEdit = (data: Thread) => {
    console.log(data);
  };
  return (
    <main className="min-h-screen bg-[#FAF9F8] relative">
      <Navbar />
      <section className="w-full bg-[#FAF9F8] pb-24 pt-10 md:pb-28 md:pt-16 min-h-screen">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-4 sm:px-6 lg:px-16">
          <h1 className="font-sora text-[34px] leading-[44px] text-[#1E293B] md:text-[48px] md:leading-[60px] lg:text-[56px] lg:leading-[71px]">
            My Saved Threads
          </h1>
          <p className="max-w-[875px] font-inter text-[16px] leading-[26px] text-[#505050] md:text-[18px] md:leading-[28px]">
            Here you can find your saved threads
          </p>
          {loading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="w-full mx-auto bg-white rounded-xl p-6 animate-pulse"
                >
                  {/* Header */}
                  {/* Post title skeleton */}
                  <div className="h-7 w-40 bg-gray-200 rounded mb-4"></div>

                  {/* Image skeleton */}
                  <div className="w-full h-96 bg-gray-200 rounded-2xl mb-4"></div>

                  {/* Caption skeleton */}
                  <div className="h-4 w-36 bg-gray-200 rounded mb-6"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2 ">
              {/* Threads cards */}
              {threads &&
                threads.map((thread) => (
                  <ThreadsCard
                    key={thread?.thread?._id}
                    thread={thread?.thread}
                    onSuccess={(ThreadId: number | undefined = undefined) => {
                      onDelete(ThreadId!);
                    }}
                    onEdit={(data: Thread) => onEdit(data)}
                  />
                ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default MySavedThreads;
