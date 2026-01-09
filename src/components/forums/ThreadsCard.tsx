"use client";

import { COLORS } from "@/lib/constants";
import { Edit, Share2, SquarePen, ThumbsUp, Trash2 } from "lucide-react";
import { use, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { intervalToDuration, set } from "date-fns";
import Link from "next/link";
import CreateThread from "./CreateThread";
import EditThread from "./EditThreads";
import { getAuth } from "@/lib/getAuth";
import toast from "react-hot-toast";
import { on } from "events";

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
  likes: Array<Like>;
};

type Like = {
  userId: number;
  ThreadId: number;
};

type ThreadsCardProps = {
  thread: Thread;
  onSuccess: () => void;
};

const ThreadsCard: React.FC<ThreadsCardProps> = ({ thread, onSuccess }) => {
  const [likesCount, setLikesCount] = useState<number>(thread?.likesCount);
  const [likes, setLikes] = useState<Like[]>(thread?.likes);
  const [error, setError] = useState<string | null>(null);
  const [hasLiked, setHasLiked] = useState(
    thread?.likes.some(
      (like) => like.userId === Number(localStorage.getItem("userId"))
    )
  );
  const [commentData, setCommentData] = useState({ comment: "" });
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [CurrentThreadId, setCurrentThreadId] = useState(
    Number(thread?.ThreadId)
  );
  const [isSaved, setIsSaved] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const ThreadId = thread?.ThreadId;
  const [isDeleting, setIsDeleting] = useState(false);
  const pathname = usePathname();
  const isForumsPage = pathname === "/forums";
  const [isEditing, setIsEditing] = useState(false);
  const [isliking, setIsLiking] = useState(false);
  const [isSaving,setIsSaving] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isReporting,setIsReporting] = useState(false);

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
    if (!userId) return;
    setHasLiked(thread?.likes.some((like) => like.userId === Number(userId)));
  }, [userId]);

  const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const data = {
      userId: userId,
    };
    let Res;
    try {
      setIsLiking(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}threads/like?ThreadId=${ThreadId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      console.log(res);
      if (!res?.ok) {
        throw new Error("Failed to like or dislike");
      }
      Res = await res.json();
      if (res.ok) {
        if (hasLiked) {
          setLikes((prev) => prev.filter((like) => like.userId !== userId));
          setLikesCount((prev) => prev - 1);
          setHasLiked(!hasLiked);
        } else {
          setLikes((prev) => [
            ...prev,
            {
              ThreadId: Number(ThreadId),
              userId: Number(userId),
            },
          ]);
          setLikesCount((prev) => prev + 1);
          setHasLiked(!hasLiked);
        }
      } 
    } catch (error: any) {
      setError(error?.message ?? "Failed to send like or dislike");
    } finally{
      setIsLiking(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCommentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsReplying(true);
    const data = {
      userId: userId,
      comments: commentData.comment,
    };
    console.log(localStorage.getItem("userId"));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}threads/comments?ThreadId=${ThreadId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      console.log(res);
      if (!res?.ok) {
        throw new Error("Failed to send comments");
      }
      if (res.ok) {
        setCommentData({
          comment: "",
        });
        toast.success("Comments sent successfully!");
        setIsCommentOpen(false);
      } else {
        toast.error("Failed to send comments. Please try again later.");
      }
    } catch (error: any) {
      setError(error?.message ?? "Failed to send comments");
    } finally{
      setIsReplying(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}threads?ThreadId=${ThreadId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res?.ok) {
        toast.error("Failed to delete thread");
        throw new Error("Failed to delete thread");
      }
      if (res.ok) {
        toast.success("Thread deleted successfully!");
        onSuccess();
      }
    } catch (error: any) {
      console.log(error?.message, "Failed to delete thread");
      toast.error("Failed to delete thread");
    } finally{
      setIsDeleting(false);
    }
  };

  const fallbackShare = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard");
  };

  const handleShare = async () => {
    const shareData = {
      title: thread?.title,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        fallbackShare(shareData.url!);
      }
    } catch (err) {
      console.error("Share cancelled", err);
    }
  };

  useEffect(() => {
    const fetchSaved = async () => {
      if (!token) return;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}threads/getMySavedThreads?ThreadId=${thread?.ThreadId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        console.log("saved", data);

        const savedThread = data?.data?.some(
          (item: { ThreadId: Number }) =>
            item.ThreadId === Number(thread?.ThreadId)
        );
        console.log("saved Thread", savedThread);

        if (savedThread) {
          setIsSaved(true);
        }
      }
    };
    fetchSaved();
  }, [token]);
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const body = {
        ThreadId: thread?.ThreadId,
      };
      console.log(body);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}threads/save`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      console.log("post save", res);

      if (res.ok) {
        setIsSaved(!isSaved);
      } else {
        console.log(res);
      }
    } catch (error: any) {
      console.log(error?.message, "Failed to Save podcast");
    } finally{
      setIsSaving(false);
    }
  };

  const handleReporting = async () => {
    setIsReporting(true);
    try {
      const body = {
        "ThreadId": thread?.ThreadId,
        "reason": "spam",
      };
      console.log(body);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}threads/report`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      if (res.ok) {
        toast.success("Thread reported successfully!");
      } else {
        toast.error("Failed to report thread. Please try again later.");
        console.log(res);
      }
    } catch (error: any) {
      console.log(error?.message, "Failed to Report Thread");
    } finally{
      setIsReporting(false);
    }
  }

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
    <div className="flex flex-col gap-2">
      <div
        className={`w-7 h-7 text-[#505050] ${isEditOpen ? "block" : "hidden"} z-10 w-full`}
      >
        <div className="w-full flex justify-end">
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
              onClick={() => setIsEditOpen(false)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
        <EditThread
          threadId={thread?.ThreadId}
          threadImages={thread?.images}
          threadTitle={thread?.title}
          threadContent={thread?.content}
          threadCategories={thread?.categories}
          isOpen={() => setIsEditOpen(!isEditOpen)}
          isCreateThread={(key: boolean) => {
            setIsEditing(key);
          }}
          onSuccess={onSuccess}
        />
      </div>
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
            <div className="flex gap-1 items-center">
              <button
              onClick={handleReporting}
              disabled={isReporting} 
              className="flex items-center justify-center h-8 w-8 md:h-auto md:w-auto  md:px-4 gap-2.5 rounded-full border border-[#D62828] bg-[#D62828] md:bg-white py-2">
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
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`w-7 h-7 text-[#505050] ${thread?.user?.userId === Number(userId) ? "block" : "hidden"}`}
              >
                <Trash2
                  className={`w-7 h-7 text-[#505050] ${thread?.user?.userId === Number(userId) ? "block" : "hidden"}`}
                />
              </button>

              <button
                onClick={() => setIsEditOpen(!isEditOpen)}
                className={`w-7 h-7 text-[#505050] ${thread?.user?.userId === Number(userId) && (duration?.hours ?? 0) < 1 ? "block" : "hidden"}`}
              >
                <SquarePen
                  className={`w-7 h-7 text-[#505050] ${thread?.user?.userId === Number(userId) && (duration?.hours ?? 0) < 1 ? "block" : "hidden"}`}
                />
              </button>
            </div>
          </div>
          <div className="w-fit flex gap-3 text-[#64748B] items-center justify-center">
            {thread?.categories &&
              thread?.categories.map((category) => (
                <>
                  <div className="rounded-full border text-[10px] md:text-base gap-2.5 px-2.5 py-1 md:py-2 opacity-100">
                    {category.title}
                  </div>
                </>
              ))}
          </div>
          <Link href={`/forums/${thread?.ThreadId}`}>
            <div>
              <div className="flex flex-col gap-4">
                <h1 className="font-sora font-semibold text-[#1E293B] text-[16px] md:text-2xl leading-6">
                  {thread?.title}
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {thread?.images &&
                    thread?.images.map((image) => (
                      <>
                        <img
                          src={image}
                          alt=""
                          className="w-full h-full rounded-xl"
                        />
                      </>
                    ))}
                </div>
                <p className="font-inter font-light text-[#64748B] text-[12px] md:text-sm leading-[18px]">
                  {thread?.content}
                </p>
              </div>
            </div>
          </Link>
          <div>
            {/*BTNS*/}
            <div className="w-full">
              <div className="w-full flex items-center justify-between gap-3 md:gap-6">
                <div className="flex items-center gap-3">
                  {/* Like */}
                  <button
                    onClick={handleLike}
                    disabled={isliking}
                    className={`flex items-center gap-2 px-4 py-2 border border-[#2A4157] rounded-full text-[#64748B] hover:bg-[#1A2A38] transition ${hasLiked ? "bg-[#1A2A38]" : ""}`}
                  >
                    <img
                      src="/like.png"
                      alt=""
                      className="h-3 w-3 md:h-3.5 md:w-3.5"
                    />
                    <span className="text-[12px] md:text-[14px]">{`${likesCount || thread?.likesCount}`}</span>
                  </button>

                  {/* Comments */}
                  <button
                    onClick={() => setIsCommentOpen(!isCommentOpen)}
                    className="flex items-center gap-2 px-4 py-2 border border-[#2A4157] rounded-full text-[#64748B] hover:bg-[#1A2A38] transition"
                  >
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
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 border border-[#2A4157] rounded-full text-[#64748B] hover:bg-[#1A2A38] transition"
                  >
                    <img
                      src="/share 1.png"
                      alt=""
                      className="h-3 w-3 md:h-3.5 md:w-3.5"
                    />
                    <span className="text-[12px] md:text-[14px]">Share</span>
                  </button>

                  {/* Save */}
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`flex items-center h-8 w-8 md:h-auto md:w-auto justify-center gap-2 md:px-4 md:py-2 border border-[#2A4157] rounded-[36px] md:rounded-full text-[#64748B] hover:bg-[#1A2A38] transition ${isSaved ? "bg-[#1A2A38]" : ""}`}
                  >
                    <img
                      src="/save.png"
                      alt=""
                      className="h-3 w-3 md:h-3.5 md:w-3.5"
                    />
                    <span className="hidden md:block text-[12px] md:text-[14px]">
                      Save
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Comments bar */}
      <div
        className={`flex items-center gap-2 md:gap-4 ${isCommentOpen && isForumsPage ? "block" : "hidden"}`}
      >
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
            <button
              type="submit"
              disabled={!commentData.comment || isReplying}
              className="flex h-[30px]  md:h-11 w-[134px] items-center justify-center rounded-[34px] bg-[#023047] text-[12px] md:text-[16px] text-white"
            >
              Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ThreadsCard;
