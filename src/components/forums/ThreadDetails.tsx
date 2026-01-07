"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import UsersCard from "./UsersCard";
import ThreadsCard from "./ThreadsCard";
import CategoryCard from "./CategoryCard";
import CommentsCard from "./CommentsCard";
import { User } from "lucide-react";
import MobileViewBar from "./MobileViewBar";
import PollCard from "./PollCard";
import { getAuth } from "@/lib/getAuth";

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
}
type Thread = {
  _id: string;
  title: string;
  content: string;
  CategoryId: Array<Number>;
  images: Array<string>;
  userId: Number;
  likesCount: number;
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

type Comment = {
  _id: string;
  userId: number;
  comment: string;
  CommentId: number;
  createdAt: string;
  replies: Array<Comment>;
};

const ThreadDetails = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [openReplies, setOpenReplies] = useState<Set<number>>(new Set());
  const [commentData, setCommentData] = useState({comment: ""});
  const [hasLiked, setHasLiked] = useState<Like[]>([]);
  const [liked, setLiked] = useState(false);
  const [topicsCount, setTopicsCount] = useState(5);  
  const [token, setToken] = useState<string | null>(null);
            const [userId, setUserId] = useState<number | null>(null);
          
            useEffect(() => {
              const fetchAuth = async () => {
                const auth = await getAuth();
                if (auth) {
                  setToken(auth.token);
                  setUserId(auth.userId);
                }
                console.log("auth",auth);;
                
              }
              fetchAuth();
            },[])

  const params = useParams();
  const ThreadId = params?.threadId;
  console.log(ThreadId);
  console.log(token);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!token) return;
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `http://54.172.93.35:7000/api/threads/FulldetailsofThreads?ThreadId=${ThreadId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
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
        setHasLiked(data[0].likes);
        setLiked(hasLiked.some(like => like.userId === Number(localStorage.getItem("userId"))));
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Failed to load threads");
      } finally {
        if (mounted) setLoading(false);
      }
      console.log(threads);
      
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`http://54.172.93.35:7000/api/topics`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error("Failed to load topics");
        }

        const topicData = (await res.json())?.meta?.data as Topic[];
        if (!mounted) return;
        setTopics(Array.isArray(topicData) ? topicData : []);
        console.log(topicData);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Failed to load topics");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();

    return () => {
      mounted = false;
    };
  }, [token]);

  console.log(threads[0]?.comments);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setCommentData((prev)=>({
        ...prev,
        [name]: value
      }));
    }
    console.log(commentData.comment);
    
  const handleComment = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      "userId": localStorage.getItem("userId"),
       "comments": commentData.comment,
    };
    console.log(localStorage.getItem("userId"));
    
    try {
      const res = await fetch(`http://54.172.93.35:7000/api/threads/comments?ThreadId=${ThreadId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(res);
      if (!res?.ok) {
        throw new Error("Failed to send comments");
      }
      if(res.ok) {
      setCommentData({
        comment: "",
      });
      alert('Message sent successfully!');
    } else {
      alert('Failed to send message. Please try again later.');
    }
    } catch (error: any) {
      setError(error?.message ?? "Failed to send comments");
    } 
  };
  const handleReply = async(e: React.FormEvent<HTMLFormElement>,reply:string, parentCommentId:number) => {
    e.preventDefault();
    const data = {
      "userId": Number(localStorage.getItem("userId")),
      "parentCommentId": parentCommentId,
      "comments": reply,
    };
    console.log(reply);
    console.log(parentCommentId);
    
    let Res;
    
    try {
      const res = await fetch(`http://54.172.93.35:7000/api/threads/comments/reply?ThreadId=${ThreadId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(res);
      if (!res?.ok) {
        throw new Error("Failed to send comments");
      }
      Res = await res.json();
      if(res.ok) {
      setCommentData({
        comment: "",
      });
      alert('Message sent successfully!');
    } else {
      alert('Failed to send message. Please try again later.');
    }
    } catch (error: any) {
      setError(error?.message ?? "Failed to send comments");
    } 
  };

   const visibleTopics = topics.slice(0, topicsCount);

  const handleTopic = ()=>{
    setTopicsCount(topicsCount + 5);
  }
  return (
    <>
      <section className="w-full bg-[#FAF9F8] pb-24 pt-5 md:pb-28 md:pt-10">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-4 sm:px-6 lg:px-16">
        {/* Breadcrumbs */}
        <div className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3 text-sm text-[#1E293B]">
          {/* Home Icon */}
          <Link
            href="/"
            className="flex items-center justify-center w-8 h-8 text-[#1E293B]"
          >
            <img src="/home.png" alt="" className="h-6 w-6" />
          </Link>

            <span className="flex items-center gap-2">
              <h1 className="md:text-xl">›</h1>
            </span>
          {/* Username and ThreadId */}
          <span className="flex items-center gap-2">
            <span className="font-medium cursor-pointer md:text-[20px] ">
              {`${threads[0]?.user?.name}#${ThreadId}`}
            </span>
            <h1 className=" md:text-xl">›</h1>
          </span>

          {/* Current Page Title */}
          <span className="flex items-center gap-2">
            <span className="font-medium cursor-pointer md:text-[20px]">
              {threads[0]?.title}
            </span>
          </span>
        </div>
        <div className="flex w-full flex-col gap-8 lg:flex-row">
          {/* Left: search, composer, posts */}
          <div className="flex w-full max-w-[1059px] flex-col gap-6">
            {/* Threads cards */}
            <ThreadsCard key={threads[0]?._id} thread={threads[0]} />

            <div className="flex flex-col-reverse md:flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5">
              {/* Comments bar */}
              <div className="flex items-center gap-2 md:gap-4">
                <div className="h-[40px] w-[40px] md:h-[60px] md:w-[65px] overflow-hidden rounded-[78px] border-2 border-[#D62828]">
                  <img
                    src="/forum-user-1.jpg"
                    alt="Current user"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="w-full ">
                  <form 
                  className="flex flex-1 items-center gap-3 rounded-[42px] border border-[#E2E8F0] bg-[#FAF9F8] pl-3 md:pl-6 pr-2 py-2 md:py-3"
                  method="post"
                  noValidate
                  onSubmit={handleComment} 
                  >
                    <textarea
                    name="comment"
                    rows={1}
                    value={commentData.comment}
                    onChange={handleInputChange}
                    placeholder="Make a comment…"
                    className="flex-1 bg-transparent outline-none items-center text-[12px] md:text-base text-[#1E293B] placeholder-[#64748B]"
                  />
                  <button type="submit" className="flex h-[30px]  md:h-11 w-[134px] items-center justify-center rounded-[34px] bg-[#023047] text-[12px] md:text-[16px] text-white">
                    Comment
                  </button>
                  </form>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {/* Comments */}
              <div className="flex gap-2.5">
                <h1 className="font-sora font-semibold text-[#1E293B] text-[12px] md:text-lg leading-[30px]">
                  Comments
                </h1>
                <p className="font-sora font-semibold text-[#505050] text-[12px] md:text-lg leading-[30px]">{`${threads[0]?.commentsCount}`}</p>
              </div>
                <div className="w-full h-0.5 border border-[#E2E8F0]"></div>
              {/* comments card */}
              <div className="flex flex-col gap-2">
                {threads[0]?.comments &&
                  threads[0]?.comments.map((comment) => (
                    <>
                      <CommentsCard
                        key={comment._id}
                        comment={comment}
                        addReply={handleReply}
                        isActiveReply={
                          openReplies.has(comment.CommentId)
                      }
                      />
                    </>
                  ))}
              </div>
              </div>
            </div>
          </div>

          {/* Right: sidebars placeholder column */}
          <div className="hidden mt-6 md:flex w-full max-w-[517px] flex-col gap-6 lg:mt-0">
            <div className="flex h-[426px] flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5">
              <h3 className="font-sora text-[24px] font-semibold text-[#1E293B]">
                Top Categories
              </h3>
              {/* categories list */}
              <div className="flex flex-col gap-2 h-full overflow-x-auto scrollbar-hide">
                <CategoryCard />
              </div>
            </div>

            <div className="flex min-h-[222px] flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5">
              <h3 className="font-sora text-[24px] font-semibold text-[#1E293B]">
                Recommended Topics
              </h3>
              <div className="flex flex-col justify-between h-full overflow-x-auto scrollbar-hide">
                <div className="flex gap-2.5">
                  {/* topics list */}
                  {visibleTopics &&
                    visibleTopics.map((topic) => (
                      <Link
                        href={topic.route}
                        className="flex w-fit items-center gap-2 px-4 py-2 rounded-full border border-[#E2E8F0] bg-[#FAF9F8]"
                      >
                        <p className="font-inter font-normal text-[#505050] text-sm leading-none">
                          {topic.title}
                        </p>
                      </Link>
                    ))}
                </div>
                <button
                onClick={handleTopic} 
                className="font-inter font-semibold text-[#D62828] text-base leading-[30px] tracking-normal w-full text-start">
                  See all Topics
                </button>
              </div>
            </div>

             <div className="flex min-h-[414px] flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5">
              <h3 className="font-sora text-[24px] font-semibold text-[#1E293B]">
                You may know
              </h3>
              {/* users list */}
              <div className="flex flex-col gap-2 h-full overflow-x-auto scrollbar-hide">
                  <UsersCard />
                </div>
            </div>

            <div className="flex h-[299px] flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5">
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
    </section>
    </>
  );
};

export default ThreadDetails;
