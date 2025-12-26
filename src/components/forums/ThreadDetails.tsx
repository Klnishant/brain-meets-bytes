"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import UsersCard from "./UsersCard";
import ThreadsCard from "./ThreadsCard";
import CategoryCard from "./CategoryCard";
import CommentsCard from "./CommentsCard";
import { User } from "lucide-react";
import { set } from "sanity";

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
  comments: Array<Comment>;
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

  const params = useParams();
  const ThreadId = params?.threadId;
  console.log(ThreadId);

  const token: string = localStorage.getItem("token") ?? "";
  console.log(token);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
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

        const res = await fetch(`http://54.172.93.35:7000/api/category`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error("Failed to load categories");
        }

        const categoryData = (await res.json())?.data as Category[];
        if (!mounted) return;
        setCategories(Array.isArray(categoryData) ? categoryData : []);
        console.log(categoryData);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Failed to load categories");
      } finally {
        if (mounted) setLoading(false);
      }

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

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`http://54.172.93.35:7000/api/users`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error("Failed to load users");
        }

        const userData = (await res.json())?.data as User[];
        if (!mounted) return;
        setUsers(Array.isArray(userData) ? userData : []);
        console.log(userData);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Failed to load users");
      } finally {
        if (mounted) setLoading(false);
      }

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `http://54.172.93.35:7000/api/threads/comments?ThreadId=${ThreadId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!res?.ok) {
          throw new Error("Failed to load comments");
        }

        const data = (await res.json())?.data as Comment[];
        console.log(data);

        if (!mounted) return;
        setComments(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Failed to load comments");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

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
  return (
    <section className="w-full  bg-[#FAF9F8] px-4 md:px-16 py-20 pt-30">
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
            <ThreadsCard thread={threads[0]} />

            <div className="flex flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5">
              {/* Comments bar */}
              <div className="hidden md:flex items-center gap-4">
                <div className="h-[60px] w-[65px] overflow-hidden rounded-[78px] border-2 border-[#D62828]">
                  <img
                    src="/forum-user-1.jpg"
                    alt="Current user"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="w-full ">
                  <form 
                  className="flex flex-1 items-center gap-3 rounded-[42px] border border-[#E2E8F0] bg-[#FAF9F8] pl-6 pr-2 py-3"
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
                    className="flex-1 bg-transparent outline-none items-center text-sm md:text-base text-[#1E293B] placeholder-[#64748B]"
                  />
                  <button type="submit" className="flex h-[44px] w-[134px] items-center justify-center rounded-[34px] bg-[#023047] text-[16px] text-white">
                    Comment
                  </button>
                  </form>
                </div>
              </div>

              {/* Comments */}
              <div className="flex gap-2.5">
                <h1 className="font-sora font-semibold text-[#1E293B] text-[12px] md:text-lg leading-[30px]">
                  Comments
                </h1>
                <p className="font-sora font-semibold text-[#505050] text-[12px] md:text-lg leading-[30px]">{`${threads[0]?.commentsCount}`}</p>
              </div>

              {/* comments */}
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

          {/* Right: sidebars placeholder column */}
          <div className="hidden md:block mt-6 flex w-full max-w-[517px] flex-col gap-6 lg:mt-0">
            <div className="flex h-[426px] flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5">
              <h3 className="font-sora text-[24px] font-semibold text-[#1E293B]">
                Top Categories
              </h3>
              <p className="font-inter text-[14px] text-[#505050]">
                Episode discussions, cognitive health, longevity, and more.
              </p>
              {/* categories list */}
              <div className="flex flex-col gap-2">
                {categories &&
                  categories.map((category) => (
                    <CategoryCard
                      key={category._id}
                      title={category.title}
                      imageUrl="./forum-user-1.jpg"
                      route={category.route}
                      color={category.color}
                      content="dfgrtttfggfgtrtr"
                      threadCount={0}
                    />
                  ))}
              </div>
            </div>

            <div className="hidden md:block flex h-[222px] flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5">
              <h3 className="font-sora text-[24px] font-semibold text-[#1E293B]">
                Recommended Topics
              </h3>
              <div>
                {/* topics list */}
                {topics &&
                  topics.map((topic) => (
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
            </div>

            <div className="hidden md:block flex h-[414px] flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5">
              <h3 className="font-sora text-[24px] font-semibold text-[#1E293B]">
                You may know
              </h3>
              {/* users list */}
              <div className="flex flex-col gap-2">
                {users &&
                  users.map((user) => (
                    <div>
                      {
                        user?.userId!=Number(localStorage.getItem("userId")) && (
                          <UsersCard
                            key={user._id}
                            _id={user._id}
                            name={user.name}
                            role={user.role}
                            userId={user.userId}
                            ProfilePic={user.ProfilePic}
                          />
                        )
                      }
                    </div>
                  ))}
              </div>
            </div>

            <div className="hidden md:block flex h-[299px] flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5">
              <h3 className="font-sora text-[24px] font-semibold text-[#1E293B]">
                Latest Poll
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThreadDetails;
