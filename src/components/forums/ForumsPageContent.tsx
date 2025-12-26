'use client';

import { COLORS } from "@/lib/constants";
import ForumsSection from "@/components/home/ForumsSection";
import ThreadsCard from "./ThreadsCard";
import CategoryCard from "./CategoryCard";
import { useEffect, useState } from "react";
import Link from "next/link";
import UsersCard from "./UsersCard";

type Category = {
  _id: string;
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

type Topic = {
  _id: string;
  title: string;
  route: string;
  isActive: boolean;
  topicId: number;
}

type User = {
  _id: string;
  name: string;
  role: string;
  userId: number;
  ProfilePic: string;
}

const ForumsHeroSection = () => {
  return (
    <section className="relative w-full bg-[#023047] text-white pb-16 pt-24 md:pb-24 md:pt-28">
      {/* Subtle background image overlay (reusing article bg for now) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 h-[640px] w-full -translate-x-1/2 opacity-25">
          <img
            src="/forum-bg.jpg"
            alt="Forums hero background"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1600px] flex-col gap-10 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-16">
        {/* Left: Heading + copy + CTA */}
        <div className="flex w-full max-w-[875px] flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="font-sora text-[34px] leading-[44px] text-[#FAF9F8] md:text-[48px] md:leading-[60px] lg:text-[56px] lg:leading-[71px]">
              Brain Meets Bytes <span style={{ color: COLORS.brandRed }}>Community</span>
            </h1>
            <p className="max-w-[875px] font-inter text-[16px] leading-[26px] text-[#E2E8F0] md:text-[18px] md:leading-[28px]">
              Breakthroughs don&apos;t happen alone. Connect with fellow listeners, researchers, and
              health enthusiasts exploring smarter brain health and longevity together.
            </p>
          </div>

          <button className="inline-flex h-[50px] w-fit items-center justify-center gap-3 rounded-[36px] bg-[#FAF9F8] px-8 text-[18px] font-normal text-[#023047]">
            <span className="font-sora">Discover all Treads</span>
            <img
              src="/dropdown-arrow.png"
              alt="More"
              className="h-5 w-5 rotate-180 object-contain"
            />
          </button>
        </div>

        {/* Right: hero cards row */}
        <div className="mt-8 flex w-full max-w-[824px] flex-row gap-6 overflow-x-auto pb-4 lg:mt-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {/* Card 1 */}
          <div className="relative h-[320px] w-[320px] flex-shrink-0 overflow-hidden rounded-[20px] border-2 border-[#64748B] bg-white shadow">
            <div className="absolute -left-16 -top-1 h-[321px] w-[481px]">
              <img src="/forum-hero-1.png" alt="Forum hero" className="h-full w-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
              <p className="line-clamp-2 font-inter text-[16px] font-semibold leading-[24px] text-white">
                Lorem ipsum dolor sit amet, sectetur adipiscing elit.
              </p>
              <p className="font-inter text-[14px] font-light leading-[24px] text-white">
                By Jerry#203
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative h-[320px] w-[320px] flex-shrink-0 overflow-hidden rounded-[20px] border-2 border-[#64748B] bg-white shadow">
            <div className="absolute -left-28 -top-8 h-[409px] w-[716px]">
              <img src="/forum-hero-2.png" alt="Forum hero" className="h-full w-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
              <p className="line-clamp-2 font-inter text-[16px] font-semibold leading-[24px] text-white">
                Lorem ipsum dolor sit amet, sectetur adipiscing elit.
              </p>
              <p className="font-inter text-[14px] font-light leading-[24px] text-white">
                By Sam#003
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative h-[320px] w-[320px] flex-shrink-0 overflow-hidden rounded-[20px] border-2 border-[#64748B] bg-white shadow">
            <div className="absolute -left-40 -top-1 h-[321px] w-[482px]">
              <img src="/forum-hero-3.jpg" alt="Forum hero" className="h-full w-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
              <p className="line-clamp-2 font-inter text-[16px] font-semibold leading-[24px] text-white">
                Lorem ipsum dolor sit amet, sectetur adipiscing elit.
              </p>
              <p className="font-inter text-[14px] font-light leading-[24px] text-white">
                By Rick#883
              </p>
            </div>
          </div>
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

    const token: string = localStorage.getItem("token") ?? "";
  
    useEffect(() => {
      let mounted = true;
  
      const load = async () => {
        try {
          setLoading(true);
          setError(null);
  
          const res = await fetch(
            `http://54.172.93.35:7000/api/threads/FulldetailsofThreads`,
            {
              method: "GET",
              headers: {
                Authorization:
                  `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!res.ok) {
            throw new Error("Failed to load threads");
          }
  
          const data = (await res.json())?.data as Thread[];
          if (!mounted) return;
          setThreads(Array.isArray(data) ? data : []);
        } catch (e: any) {
          if (!mounted) return;
          setError(e?.message ?? "Failed to load threads");
        } finally {
          if (mounted) setLoading(false);
        }

        try{
          setLoading(true);
          setError(null);
  
          const res = await fetch(
            `http://54.172.93.35:7000/api/category`,
            {
              method: "GET",
              headers: {
                Authorization:
                  `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!res.ok) {
            throw new Error("Failed to load categories");
          }
  
          const categoryData = (await res.json())?.data as Category[];
          if (!mounted) return;
          setCategories(Array.isArray(categoryData) ? categoryData : []);
          console.log(categoryData);
        }
        catch(e: any){
          if(!mounted) return;
          setError(e?.message ?? "Failed to load categories");
        }
        finally{
          if(mounted) setLoading(false);
        }

        try{
          setLoading(true);
          setError(null);
  
          const res = await fetch(
            `http://54.172.93.35:7000/api/topics`,
            {
              method: "GET",
              headers: {
                Authorization:
                  `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!res.ok) {
            throw new Error("Failed to load topics");
          }
  
          const topicData = (await res.json())?.meta?.data as Topic[];
          if (!mounted) return;
          setTopics(Array.isArray(topicData) ? topicData : []);
          console.log(topicData);
        }
        catch(e: any){
          if(!mounted) return;
          setError(e?.message ?? "Failed to load topics");
        }
        finally{
          if(mounted) setLoading(false);
        }

        try{
          setLoading(true);
          setError(null);
  
          const res = await fetch(
            `http://54.172.93.35:7000/api/users`,
            {
              method: "GET",
              headers: {
                Authorization:
                  `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!res.ok) {
            throw new Error("Failed to load users");
          }
  
          const userData = (await res.json())?.meta?.data as User[];
          if (!mounted) return;
          setUsers(Array.isArray(userData) ? userData : []);
          console.log(userData);
        }
        catch(e: any){
          if(!mounted) return;
          setError(e?.message ?? "Failed to load users");
        }
        finally{
          if(mounted) setLoading(false);
        }
      };

      
  
      void load();
  
      return () => {
        mounted = false;
      };
    }, []);
  return (
    <section className="w-full bg-[#FAF9F8] pb-24 pt-10 md:pb-28 md:pt-16">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-4 sm:px-6 lg:px-16">
        {/* Welcome + tabs */}
        <div className="flex w-full flex-col items-center gap-6 rounded-[20px] border border-[#E2E8F0] bg-white px-6 py-5 md:flex-row md:justify-between">
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
              <span className="font-inter text-[20px] md:text-[36px] font-bold text-[#D62828]">community.</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[12px] md:text-[14px] font-normal font-sora">
            <button className="flex h-[36px] w-[104px] py-5 md:h-[50px] md:w-[140px] items-center justify-center rounded-[36px] bg-[#023047] text-white">
              Most Popular
            </button>
            <button className="flex h-[36px] w-[104px] md:h-[50px] md:w-[150px] items-center justify-center rounded-[36px] bg-white text-[#023047] opacity-70">
              Highest Voted
            </button>
            <button className="flex h-[36px] w-[104px] md:h-[50px] md:w-[150px] items-center justify-center rounded-[36px] bg-white text-[#023047] opacity-70">
              Latest Tread
            </button>
          </div>
        </div>

        <div className="flex w-full flex-col gap-8 lg:flex-row">
          {/* Left: search, composer, posts */}
          <div className="flex w-full max-w-[1059px] flex-col gap-6">
            {/* Search bar */}
            <div className="hidden md:block md:flex items-center justify-between gap-4 rounded-[42px] border border-[#E2E8F0] bg-white px-6 py-3">
              <span className="font-sora text-[16px] text-[#64748B]">Search for a tread....</span>
              <button
                className="flex h-[44px] w-[136px] items-center justify-center gap-2 rounded-[34px] bg-[#D62828] text-[16px] text-white"
              >
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
                <div className="h-[60px] w-[60px] overflow-hidden rounded-full border-2 border-[#D62828]">
                  <img
                    src="/forum-user-1.jpg"
                    alt="Current user"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 items-center gap-3 rounded-[42px] border border-[#E2E8F0] bg-[#FAF9F8] px-6 py-3">
                  <span className="font-sora text-[16px] text-[#64748B]">What&apos;s on your mind?</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-[#E2E8F0] pt-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <button className="inline-flex items-center gap-2 rounded-[36px] border border-[#E2E8F0] bg-white px-6 py-2">
                    <span className=" items-center justify-center ">
                      <img src="/image.png" alt="Images" className="h-4 w-4 object-contain" />
                    </span>
                    <span className="font-sora text-[14px] text-[#023047]">Images</span>
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-[36px] border border-[#E2E8F0] bg-white px-6 py-2">
                    <span className=" items-center justify-center">
                      <img src="/video.png" alt="Videos" className="h-4 w-4 object-contain" />
                    </span>
                    <span className="font-sora text-[14px] text-[#023047]">Videos</span>
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-[36px] border border-[#E2E8F0] bg-white px-6 py-2">
                    <span className=" items-center justify-center ">
                      <img src="/poll.png" alt="Polls" className="h-4 w-4 object-contain" />
                    </span>
                    <span className="font-sora text-[14px] text-[#023047]">Polls</span>
                  </button>
                </div>

                <button className="mt-2 flex h-[50px] w-[136px] items-center justify-center rounded-[34px] bg-[#023047] text-[16px] text-white md:mt-0">
                  Publish
                </button>
              </div>
            </div>
            {/* Threads cards */}
            {
              threads && threads.map((thread) => (
                <ThreadsCard key={thread._id} thread={thread} />
              ))
            }
            
          </div>

          {/* Right: sidebars placeholder column */}
          <div className="mt-6 flex w-full max-w-[517px] flex-col gap-6 lg:mt-0">
            <div className="flex h-[426px] flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5">
              <h3 className="font-sora text-[24px] font-semibold text-[#1E293B]">Top Categories</h3>
              <p className="font-inter text-[14px] text-[#505050]">
                Episode discussions, cognitive health, longevity, and more.
              </p>
              {/* categories list */}
              <div className="flex flex-col gap-2">
                {
                  categories && categories.map((category) => (
                    <CategoryCard key={category._id}
                      title={category.title}
                      imageUrl="./forum-user-1.jpg"
                      route={category.route}
                      color={category.color}
                      content="dfgrtttfggfgtrtr"
                      threadCount={0}
                      />
                  ))
                }
              </div>
            </div>

            <div className="flex h-[222px] flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5">
              <h3 className="font-sora text-[24px] font-semibold text-[#1E293B]">Recommended Topics</h3>
              <div>
                {/* topics list */}
                {
                  topics && topics.map((topic) => (
                    <Link href={topic.route} className="flex w-fit items-center gap-2 px-4 py-2 rounded-full border border-[#E2E8F0] bg-[#FAF9F8]">
                      <p className="font-inter font-normal text-[#505050] text-sm leading-none"
>{topic.title}</p>
                    </Link>
                  ))
                }
              </div>
            </div>

            <div className="flex h-[414px] flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5">
              <h3 className="font-sora text-[24px] font-semibold text-[#1E293B]">You may know</h3>
                {/* users list */}
              <div className="flex flex-col gap-2">
                {
                  users && users.map((user) => (
                    <UsersCard key={user._id}
                      _id={user._id}
                      name={user.name}
                      role={user.role}
                      userId={user.userId}
                      ProfilePic={user.ProfilePic}
                      />
                  ))
                }
              </div>
            </div>

            <div className="flex h-[299px] flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5">
              <h3 className="font-sora text-[24px] font-semibold text-[#1E293B]">Latest Poll</h3>
            </div>
          </div>
        </div>
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
