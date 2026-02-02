"use client";

import { COLORS } from "@/lib/constants";
import ForumsSection from "@/components/home/ForumsSection";
import ThreadsCard from "./ThreadsCard";
import CategoryCard from "./CategoryCard";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import UsersCard from "./UsersCard";
import CreateThread, { CreatThreadFormRef } from "./CreateThread";
import CreateCategory from "./CreateCategory";
import CreateTopic from "./CreateTopic";
import CreatePoll, { CreatePollFormRef } from "./CreatePoll";
import PollCard from "./PollCard";
import MobileViewBar from "./MobileViewBar";
import { getAuth } from "@/lib/getAuth";
import { set } from "sanity";
import { Loader } from "lucide-react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";

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

type Topic = {
  _id: string;
  title: string;
  route: string;
  isActive: boolean;
  topicId: number;
};

type User = {
  _id: string;
  name: string;
  role: string;
  userId: number;
  ProfilePic: string;
};

type Author = {
  name: string;
  content: string;
  imageUrl: string;
};

type ForumHeroContent = {
  heading: string;
  description: string;
  authors: Author[];
  imageUrl: string;
  date: string;
};

const FALL_BACK_CONTENT: ForumHeroContent = {
  heading: "Brain Meets Bytes Community",
  description: "Breakthroughs don&apos;t happen alone. Connect with fellow listeners, researchers, and health enthusiasts exploring smarter brain health and longevity together.",
  authors: [
    {
      name: "Jerry#203",
      content: "Lorem ipsum dolor sit amet, sectetur adipiscing elit.",
      imageUrl: "./forum-hero-1.png",
    },
    {
      name: "Sam#003",
      content: "Lorem ipsum dolor sit amet, sectetur adipiscing elit.",
      imageUrl: "./forum-hero-2.png",
    },
    {
      name: "John#001",
      content: "Lorem ipsum dolor sit amet, sectetur adipiscing elit.",
      imageUrl: "./forum-hero-3.jpg",
    },
  ],
  imageUrl: "./forum-bg.jpg",
  date: "",
}

const ForumsHeroSection = () => {
  const [content, setContent] = useState<ForumHeroContent | null>(null);
  const [contentLength, setContentLength] = useState<number>(0);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const contentRes = await fetch("/api/forum-hero");
        if (!contentRes.ok) {
          throw new Error("Failed to load forum hero content");
        }

        const contentData = (await contentRes.json()) as ForumHeroContent;
        if (!mounted) return;
        setContent(contentData);
        setContentLength(contentData?.heading?.length ?? 0);
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
  return (
    <section className="relative w-full bg-[#023047] text-white pb-16 pt-24 md:pb-24 md:pt-28">
      {/* Subtle background image overlay (reusing article bg for now) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 h-[640px] w-full -translate-x-1/2 opacity-25">
          <img
            src={content?.imageUrl ?? FALL_BACK_CONTENT.imageUrl}
            alt="Forums hero background"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className=" relative z-10 mx-auto flex max-w-[1600px] flex-col-reverse gap-10 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-16">
        {/* Left: Heading + copy + CTA */}
        <div className="flex w-full max-w-[875px] flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="font-sora text-[34px] leading-[44px] md:text-[48px] md:leading-[60px] lg:text-[56px] lg:leading-[71px]">
              {content?.heading ? (
                <div>
                  {content?.heading?.split(" ").map((word, index) => (
                    <span
                      key={index}
                      className={index + 1 == 4 ? "text-[#D62828]" : ""}
                    >
                      {word}{" "}
                    </span>
                  ))}
                </div>
              ) : (
                <div>
                  {FALL_BACK_CONTENT.heading?.split(" ").map((word, index) => (
                    <span
                      key={index}
                      className={index + 1 == 4 ? "text-[#D62828]" : ""}
                    >
                      {word}{" "}
                    </span>
                  ))}
                </div>
              )}
            </h1>
            <p className="max-w-[875px] font-inter text-[16px] leading-[26px] text-[#E2E8F0] md:text-[18px] md:leading-[28px]">
              {content?.description ?? FALL_BACK_CONTENT.description}
            </p>
          </div>

          <button className="inline-flex h-[50px] w-full md:w-fit items-center justify-center gap-3 rounded-[36px] bg-[#FAF9F8] px-8 text-[18px] font-normal text-[#023047]">
            <span className="font-sora">Discover all Threads</span>
            <img
              src="./dropdown-arrow.png"
              alt="More"
              className="h-5 w-5 object-contain invert "
            />
          </button>
        </div>

        {/* Right: hero cards row */}
        <div className="mt-8 flex w-full max-w-[824px] flex-row gap-6 overflow-x-auto pb-4 lg:mt-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {/* Card 1 */}
          {
            content?.authors?.map((author, index) => (
              <div
                key={index}
                className="relative h-[320px] w-[320px] flex-shrink-0 overflow-hidden rounded-[20px] border-2 border-[#64748B] bg-white shadow"
              >
                <div className="absolute -left-16 -top-1 h-[321px] w-[481px]">
                  <img
                    src={`${author.imageUrl}`}
                    alt="Forum hero"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
                <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
                  <p className="line-clamp-2 font-inter text-[16px] font-semibold leading-[24px] text-white">
                    {author?.content}
                  </p>
                  <p className="font-inter text-[14px] font-light leading-[24px] text-white">
                    By {author?.name}
                  </p>
                </div>
              </div>
            )) ?? FALL_BACK_CONTENT.authors?.map((author, index) => (
              <div
                key={index}
                className="relative h-[320px] w-[320px] flex-shrink-0 overflow-hidden rounded-[20px] border-2 border-[#64748B] bg-white shadow"
              >
                <div className="absolute -left-16 -top-1 h-[321px] w-[481px]">
                  <img
                    src={`${author.imageUrl}`}
                    alt="Forum hero"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
                <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
                  <p className="line-clamp-2 font-inter text-[16px] font-semibold leading-[24px] text-white">
                    {author?.content}
                  </p>
                  <p className="font-inter text-[14px] font-light leading-[24px] text-white">
                    By {author?.name}
                  </p>
                </div>
              </div>
            ))
             } 

          {/* Card 2 */}

          {/* Card 3 */}
        </div>
      </div>
    </section>
  );
};

const ForumsMainSection = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [topicsCount, setTopicsCount] = useState(5);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [isMostPopularActive, setIsMostPopularActive] = useState(true);
  const [isLatestActive, setIsLatestActive] = useState(false);
  const [isHighestVotedActive, setIsHighestVotedActive] = useState(false);
  const [isCreatingPoll, setIsCreatingPoll] = useState(false);
  const [hasnext, setHasNext] = useState(false);
  const [user, setUser] = useState<User | null>(null);

   const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setToken(auth?.auth?.token);
    setUserId(auth?.auth?.userId);
  }, [auth]);

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

  const fetchThreads = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}threads/FulldetailsofThreads?page=${page}&limit=10`,
        {
          //headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) throw new Error("Failed to load threads");

      const Res = await res.json();
      const data = Res?.data ?? [];

      console.log("Threads",data);

      setThreads((prev) => [...prev, ...data]);
      setHasNext(page < Res?.meta?.totalPages);
    } catch (e) {
      setError("Failed to load threads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [token, page]);

  const [infiniteRef, { rootRef }] = useInfiniteScroll({
    loading,
    hasNextPage: hasnext,
    onLoadMore: () => {
      console.log(" onLoadMore fired");
      setPage((prev) => prev + 1);
    },
    rootMargin: "0px 0px 300px 0px",
  });

  const fetchTopics = async () => {
    try {
      setIsLoadingTopics(true);
      setError(null);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}topics`);
      if (!res.ok) {
        throw new Error("Failed to load topics");
      }

      const topicData = (await res.json())?.meta?.data as Topic[];

      setTopics(Array.isArray(topicData) ? topicData : []);
      console.log(topicData);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load topics");
    } finally {
      setIsLoadingTopics(false);
    }
  };
  useEffect(() => {
    fetchTopics();
  }, [token]);
  const onSuccess = (data: Thread) => {
    setThreads((prev) => [data, ...prev]);
    setIsCreatingThread(false);
    setIsComposerOpen(false);
    setImages([]);
    setVideos([]);
  };
  const onDelete = (ThreadId: number) =>
    setThreads((prev) =>
      prev.filter((thread) => thread?.ThreadId !== ThreadId),
    );
  const onEdit = (data: Thread) =>
    setThreads((prev) =>
      prev.map((thread) =>
        thread?.ThreadId === data?.ThreadId ? data : thread,
      ),
    );
  const visibleTopics = topics.slice(0, topicsCount);

  const handleTopic = () => {
    setTopicsCount(topicsCount + 5);
  };

  /* handle search */
  const [search, setSearch] = useState("");

  const searchThreads = () => {
    if (!search.trim()) return threads;

    const q = search.toLowerCase();

    return threads.filter(
      (thread) =>
        thread?.title.toLowerCase().includes(q) ||
        thread?.user?.name.toLowerCase().includes(q) ||
        thread?.categories?.some((category) =>
          category?.title.toLowerCase().includes(q),
        ),
    );
  };

  const handleSearch = (searchText: string) => {
    setSearch(searchText);
  };

  const filteredThreads = useMemo(() => searchThreads(), [threads, search]);

  /* Handle composer */
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

  const formRef = useRef<CreatThreadFormRef>(null);
  const pollFormRef = useRef<CreatePollFormRef>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    setImages((prev) => [...prev, ...selectedFiles]);

    // Reset input so same image can be re-selected
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    setVideos((prev) => [...prev, ...selectedFiles]);

    // Reset input so same image can be re-selected
    e.target.value = "";
  };

  const handleParentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isComposerOpen) {
      formRef.current?.submit(e);
    }

    if (isPollOpen) {
      pollFormRef.current?.submit(e);
    }
  };

  const handleLoading = () => {
    setIsCreatingThread(!isCreatingThread);
  };

  /* handle poll */
  const [isPollOpen, setIsPollOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  return (
    <section className="w-full bg-[#FAF9F8] pb-24 pt-10 md:pb-28 md:pt-16">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-4 sm:px-6 lg:px-16">
        {/* Welcome + tabs */}
        <div className="flex w-full flex-col items-center gap-6 rounded-[20px] border border-[#E2E8F0] bg-white px-6 py-5 xl:flex-row md:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-[#1E293B]">
            <div>
              <img
                src="/home.png"
                alt="Home icon"
                className="h-6 w-6 md:h-12 md:w-12 object-contain"
              />
            </div>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-inter text-[20px] md:text-[36px] font-bold text-[#1E293B]">
                Welcome to our
              </span>
              <span className="font-inter text-[20px] md:text-[36px] font-bold text-[#D62828]">
                community.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[12px] md:text-[14px] font-normal font-sora">
            <button
              onClick={() => {
                setIsMostPopularActive(true);
                setIsHighestVotedActive(false);
                setIsLatestActive(false);
                setThreads((prev) =>
                  [...prev].sort((a, b) => b.likesCount - a.likesCount),
                );
              }}
              className={`flex h-[36px] w-[104px] py-5 md:h-[50px] md:w-[140px] items-center justify-center rounded-[36px] ${isMostPopularActive ? "bg-[#023047] text-white" : "bg-white text-[#023047] opacity-70"}`}
            >
              Most Popular
            </button>
            <button
              onClick={() => {
                setIsMostPopularActive(false);
                setIsHighestVotedActive(true);
                setIsLatestActive(false);
                setThreads((prev) =>
                  [...prev].sort(
                    (a, b) =>
                      b.likesCount +
                      b.commentsCount -
                      (a.likesCount + a.commentsCount),
                  ),
                );
              }}
              className={`flex h-[36px] w-[104px] md:h-[50px] md:w-[150px] items-center justify-center rounded-[36px] ${isHighestVotedActive ? "bg-[#023047] text-white" : "bg-white text-[#023047] opacity-70"}`}
            >
              Highest Voted
            </button>
            <button
              onClick={() => {
                setIsMostPopularActive(false);
                setIsHighestVotedActive(false);
                setIsLatestActive(true);
                setThreads((prev) =>
                  [...prev].sort(
                    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
                  ),
                );
              }}
              className={`flex h-[36px] w-[104px] md:h-[50px] md:w-[150px] items-center justify-center rounded-[36px] ${isLatestActive ? "bg-[#023047] text-white" : "bg-white text-[#023047] opacity-70"}`}
            >
              Latest Thread
            </button>
          </div>
        </div>

        <div className="flex w-full flex-col gap-8 lg:flex-row">
          {/* Left: search, composer, posts */}
          <div className="flex w-full max-w-[1059px] flex-col gap-6">
            {/* Search bar */}
            <div className="hidden md:block md:flex items-center justify-between gap-4 rounded-[42px] border border-[#E2E8F0] bg-white px-6 py-3">
              <input
                type="text"
                placeholder="Search for a thread...."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[12px] md:text-base text-[#1E293B] placeholder-[#64748B]"
              />
              <button className="flex h-[44px] w-[136px] items-center justify-center gap-2 rounded-[34px] bg-[#D62828] text-[16px] text-white">
                <span>Search</span>
                <img
                  src="/search.png"
                  alt="Search"
                  className="h-4 w-4 object-contain"
                />
              </button>
            </div>

            {/* Composer */}
            <div className="hidden  md:flex flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5">
              <div className="flex items-center gap-4">
                <div className="h-[60px] w-[60px] overflow-hidden rounded-full border-2 border-[#D62828] shrink-0">
                  <img
                    src={user?.ProfilePic || "/forum-user.png"}
                    alt="Current user"
                    className="h-full w-full object-cover shrink-0"
                  />
                </div>
                <div
                  className={`${isComposerOpen ? "block" : "hidden"} flex justify-end w-full`}
                >
                  <button
                    onClick={() => setIsComposerOpen(false)}
                    className="rounded-lg border border-[#CBD5E1] px-4 py-2 text-sm text-[#475569] hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
                <div
                  onClick={() => {
                    setIsComposerOpen(true);
                    setIsPollOpen(false);
                  }}
                  className={`${isComposerOpen ? "hidden" : "block"} flex flex-1 items-center gap-3 rounded-[42px] border border-[#E2E8F0] bg-[#FAF9F8] px-6 py-3`}
                >
                  <span className="font-sora text-[16px] text-[#64748B]">
                    What&apos;s on your mind?
                  </span>
                </div>
              </div>

              {/* Composer form */}

              <div className={`${isComposerOpen ? "block" : "hidden"}`}>
                <CreateThread
                  images={images}
                  videos={videos}
                  ref={formRef}
                  isOpen={() => setIsComposerOpen(!isComposerOpen)}
                  isCreateThread={(key: boolean) => {
                    setIsCreatingThread(key);
                  }}
                  onSuccess={(data: Thread) => {
                    onSuccess(data);
                  }}
                />
              </div>

              {/* Polls */}
              <div className={`${isPollOpen ? "block" : "hidden"} z-10`}>
                <CreatePoll
                  ref={pollFormRef}
                  handleClick={() => setIsPollOpen(!isPollOpen)}
                  isCreatePoll={(key: boolean) => {
                    setIsCreatingPoll(key);
                  }}
                />
              </div>
              <form noValidate onSubmit={handleParentSubmit}>
                <div className="flex flex-col gap-3 border-t border-[#E2E8F0] pt-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Image Upload */}
                    <div className="flex items-center gap-4">
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer rounded-lg text-[#64748B] text-sm hover:bg-gray-50"
                      >
                        <div className="inline-flex items-center gap-2 rounded-[36px] border border-[#E2E8F0] bg-white px-6 py-2">
                          <span className=" items-center justify-center ">
                            <img
                              src="/image.png"
                              alt="Images"
                              className="h-4 w-4 object-contain"
                            />
                          </span>
                          <span className="font-sora text-[14px] text-[#023047]">
                            Images
                          </span>
                        </div>
                        <input
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          multiple
                          hidden
                          disabled={!isComposerOpen}
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                    {/* video Upload */}
                    <div aria-disabled={true} className="hidden items-center gap-4">
                      <label
                        htmlFor="video-upload"
                        className="cursor-pointer rounded-lg text-[#64748B] text-sm hover:bg-gray-50"
                      >
                        <div className="inline-flex items-center gap-2 rounded-[36px] border border-[#E2E8F0] bg-white px-6 py-2">
                          <span className=" items-center justify-center ">
                            <img
                              src="/video.png"
                              alt="Images"
                              className="h-4 w-4 object-contain"
                            />
                          </span>
                          <span className="font-sora text-[14px] text-[#023047]">
                            Videos
                          </span>
                        </div>
                        <input
                          id="video-upload"
                          name="video-upload"
                          type="file"
                          multiple
                          hidden
                          disabled={!isComposerOpen}
                          accept="video/*"
                          capture="environment"
                          onChange={handleVideoChange}
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsPollOpen(!isPollOpen);
                        setIsComposerOpen(false);
                      }}
                      className="inline-flex items-center gap-2 rounded-[36px] border border-[#E2E8F0] bg-white px-6 py-2"
                    >
                      <span className=" items-center justify-center ">
                        <img
                          src="/poll.png"
                          alt="Polls"
                          className="h-4 w-4 object-contain"
                        />
                      </span>
                      <span className="font-sora text-[14px] text-[#023047]">
                        Polls
                      </span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={
                      isCreatingThread ||
                      isCreatingPoll ||
                      (!isComposerOpen && !isPollOpen)
                    }
                    className="mt-2 flex h-[50px] w-[136px] items-center justify-center rounded-[34px] bg-[#023047] text-[16px] text-white md:mt-0"
                  >
                    {!isCreatingThread ? (
                      "Publish"
                    ) : (
                      <Loader size={14} className="animate-spin" />
                    )}
                  </button>
                </div>
              </form>
              <div className="flex gap-3">
                {/* Image Preview */}
                <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4 shrink-0">
                  {images.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="h-24 w-full rounded-lg object-cover shrink-0"
                      />

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 hidden rounded-full bg-black/60 p-1 text-white group-hover:block"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                {/* Video Preview */}
                <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4 shrink-0">
                  {videos.map((file, index) => (
                    <div key={index} className="relative group">
                      <video
                        src={URL.createObjectURL(file)}
                        controls
                        className="h-24 w-full rounded-lg object-cover shrink-0"
                      />

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        className="absolute right-2 top-2 hidden rounded-full bg-black/60 p-1 text-white group-hover:block"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              {loading && page == 1 ? (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="w-full max-w-4xl mx-auto bg-white rounded-lg p-6 animate-pulse"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {/* Avatar skeleton */}
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>

                          <div className="flex flex-col gap-2">
                            {/* Title skeleton */}
                            <div className="h-6 w-32 bg-gray-200 rounded"></div>
                            {/* Time skeleton */}
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                          </div>
                        </div>

                        {/* Report button skeleton */}
                        <div className="h-10 w-24 bg-gray-200 rounded-full"></div>
                      </div>

                      {/* Tags skeleton */}
                      <div className="flex gap-2 mb-4">
                        <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
                        <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
                      </div>

                      {/* Post title skeleton */}
                      <div className="h-7 w-40 bg-gray-200 rounded mb-4"></div>

                      {/* Image skeleton */}
                      <div className="w-full h-96 bg-gray-200 rounded-2xl mb-4"></div>

                      {/* Caption skeleton */}
                      <div className="h-4 w-36 bg-gray-200 rounded mb-6"></div>

                      {/* Action buttons skeleton */}
                      <div className="flex items-center justify-between">
                        <div className="flex gap-3">
                          {/* Like button skeleton */}
                          <div className="h-10 w-16 bg-gray-200 rounded-full"></div>
                          {/* Comment button skeleton */}
                          <div className="h-10 w-16 bg-gray-200 rounded-full"></div>
                        </div>

                        <div className="flex gap-3">
                          {/* Share button skeleton */}
                          <div className="h-10 w-20 bg-gray-200 rounded-full"></div>
                          {/* Save button skeleton */}
                          <div className="h-10 w-20 bg-gray-200 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  ref={rootRef}
                  className="h-[1000px] overflow-y-auto scrollbar-hide flex flex-col gap-2"
                >
                  {filteredThreads.map((thread) => (
                    <ThreadsCard
                      key={thread._id}
                      thread={thread}
                      onSuccess={(ThreadId) => onDelete(ThreadId!)}
                      onEdit={(data) => onEdit(data)}
                    />
                  ))}
                  <div ref={infiniteRef} className="h-[1px]" />

                  {hasnext && loading && (
                    <div className="flex justify-center py-4">
                      <Loader size={24} className="animate-spin text-black" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: sidebars placeholder column */}
          <div className="hidden mt-6 lg:flex w-full max-w-[517px] flex-col gap-6 lg:mt-0">
            <div className="hidden lg:flex h-[426px] flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5 relative">
              <h3 className="font-sora text-[24px] font-semibold text-[#1E293B]">
                Top Categories
              </h3>

              {/* categories list */}
              <div className="flex flex-col justify-between h-full overflow-x-auto scrollbar-hide">
                <div className="flex flex-col gap-2 h-full">
                  <CategoryCard />
                </div>
              </div>
            </div>

            <div className="hidden lg:flex h-[222px] flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5">
              <h3 className="font-sora text-[24px] font-semibold text-[#1E293B]">
                Recommended Topics
              </h3>
              <div className="flex flex-col justify-between h-full overflow-x-auto scrollbar-hide">
                {isLoadingTopics ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader size={24} className="animate-spin" color="black" />
                  </div>
                ) : (
                  <div className="flex gap-2.5">
                    {/* topics list */}
                    {visibleTopics &&
                      visibleTopics.map((topic) => (
                        <Link
                          key={topic._id}
                          href={topic.route}
                          className="flex w-fit items-center gap-2 px-4 py-2 rounded-full border border-[#E2E8F0] bg-[#FAF9F8]"
                        >
                          <p className="font-inter font-normal text-[#505050] text-sm leading-none">
                            {topic.title}
                          </p>
                        </Link>
                      ))}
                  </div>
                )}
                <button
                  onClick={handleTopic}
                  className="font-inter font-semibold text-[#D62828] text-base leading-[30px] tracking-normal w-full text-start"
                >
                  See all Topics
                </button>
              </div>
            </div>

            {/* <div className="flex h-[414px] flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5">
              <h3 className="font-sora text-[24px] font-semibold text-[#1E293B]">
                You may know
              </h3>
              {/* users list */}
            {/* <div className="flex flex-col gap-2 h-full overflow-x-auto scrollbar-hide">
                <UsersCard />
              </div>
            </div> */}

            <div className="hidden lg:flex h-[299px] flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5 relative">
              <h3 className="font-sora text-[24px] font-semibold text-[#1E293B]">
                Latest Poll
              </h3>
              {/* poll card */}
              <div className="flex flex-col gap-2 h-full overflow-x-auto scrollbar-hide">
                <PollCard />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:hidden fixed bottom-0 left-0 z-20 w-full flex justify-center bg-white shadow-md"
 >
        <MobileViewBar
          user={user}
          onSuccess={onSuccess}
          handleSearch={handleSearch}
         />
      </div>
    </section>
  );
};

const ForumsPageContent = () => {
  return (
    <>
      <ForumsHeroSection />
      <ForumsMainSection />
    </>
  );
};

export default ForumsPageContent;
