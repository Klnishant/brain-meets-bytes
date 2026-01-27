"use client";

import { getAuth } from "@/lib/getAuth";
import { RootState } from "@/Redux/store";
import { intervalToDuration } from "date-fns";
import { ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { set } from "sanity";

type Comment = {
  _id: string;
  ThreadId: number;
  userId: number;
  comments: string;
  parentCommentId: number;
  CommentId: number;
  likes: number;
  isLikedByMe: false;
  replies?: Comment[];
  createdAt: string;
};

type User = {
  _id: string;
  name: string;
  role: string;
  userId: number;
  ProfilePic: string;
};

type CommentNode = {
  CommentId: number;
  isLikedByMe: boolean;
  likes: number;
  replies?: CommentNode[];
};


type CommentsCardProps = {
  comment: Comment;
  addReply: (
    e: React.FormEvent<HTMLFormElement>,
    reply: string,
    parentCommentId: number
  ) => void;
  isActiveReply: boolean;
  threadId: number;
};
const CommentsCard: React.FC<CommentsCardProps> = ({
  comment,
  addReply,
  isActiveReply,
  threadId,
}) => {
  const [reply, setReply] = useState({ comment: "" });
  const [showReply, setShowReply] = useState(false);
  const [areRepliesVisible, setAreRepliesVisible] = useState(false);
  const [users, setUsers] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setToken(auth?.auth?.token);
    setUserId(auth?.auth?.userId);
  }, [auth]);

  const user = async () => {
    if (!comment) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/one?userId=${comment?.userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();

    if (res.ok) {
      setUsers(data?.data);
    }
  };

  useEffect(() => {
    user();
  }, [comment,token]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setReply((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await addReply(e, reply?.comment, comment?.CommentId);

    setReply({ comment: "" });
  };

  const handleCommentLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}threads/comments/like?ThreadId=${threadId}&CommentId=${comment?.CommentId}`,
        {
          method: "Post",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userId }),
        }
      );
      if (res.ok) {
        setIsLiked(!isLiked);
        toast.success("Comment liked successfully!");
        isLiked ? setLikesCount((prev) => prev - 1) : setLikesCount((prev) => prev + 1);
      }
      if (!res.ok) {
        toast.error("Failed to like comment. Please try again later.");
      }
    } catch (error: any) {
      console.log(error?.message, "failed to like comment");
      toast.error("Failed to like comment. Please try again later.");
    }
  };

const findIsLikedByMe = (
  comments: CommentNode[],
  targetCommentId: number
): { likes: number; isLikedByMe: boolean } | undefined => {
  for (const comment of comments) {
    if (comment.CommentId === targetCommentId) {
     return {
        likes: comment.likes,
        isLikedByMe: comment.isLikedByMe,
      };
    }
  }
  return undefined;
};


  useEffect(() => {
    const fetchLikedByMe = async () => {
      if (!token) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}threads/comments/like?ThreadId=${threadId}&CommentId=${comment?.CommentId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }
          }
        );
        const data = await res.json();
        console.log("comment Like data",data);
        
        if (res.ok) {
          const hasLiked = findIsLikedByMe(data?.data, comment?.CommentId);
          if (hasLiked !== undefined) {
            setIsLiked(hasLiked?.isLikedByMe);
            setLikesCount(hasLiked?.likes);
          }
        }
      } catch (error: any) {
        console.log(error?.message, "failed to load like comment");
      }
    };
    fetchLikedByMe();
  },[token, comment]);

  const duration = intervalToDuration({
    start: new Date(comment?.createdAt),
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
    <div>
      <div className="flex flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5">
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex  items-center justify-between">
            <div className="flex gap-3">
              <div className="h-[40px] w-[40px] md:h-15 md:w-15 overflow-hidden rounded-full">
                <img
                  src={"./ki.png"}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h1 className="font-sora font-semibold text-[#1E293B] text-12px md:text-xl leading-6">
                  {users?.name}{" "}
                  <span className="font-sora font-light text-[#1E293B] text-12px md:text-xl leading-6">
                    #{`${comment?.userId}`}
                  </span>
                </h1>
                <p className="font-inter font-light text-[#64748B] text-[10px] md:text-sm leading-[18px]">
                  {time}
                </p>
              </div>
            </div>
            <div></div>
          </div>
          <div>
            <div className="flex flex-col gap-4">
              <p className="font-inter font-light text-[#64748B] text-[12px] md:text-sm leading-[18px]">
                {comment?.comments}
              </p>
            </div>
          </div>
          <div>
            {/*BTNS*/}
            <div className="w-full">
              <div className="w-full flex items-center justify-between gap-3 md:gap-6">
                <div className="flex items-center gap-3">
                  {/* Like */}
                  <button 
                  onClick={handleCommentLike}
                  className={`flex items-center gap-2 px-4 py-2 border border-[#2A4157] rounded-full text-[#64748B] hover:bg-[#1A2A38] ${isLiked ? "bg-[#1A2A38]" : ""} transition`}>
                    <img
                      src="/like.png"
                      alt=""
                      className="h-3 w-3 md:h-3.5 md:w-3.5"
                    />
                    <span className="text-[12px] md:text-[14px]">{`${likesCount}`}</span>
                  </button>

                  {/* Comments */}
                  <button
                    className={`flex items-center gap-2 px-4 py-2 border border-[#2A4157] rounded-full ${isActiveReply ? "bg-[#1A2A38]" : ""} text-[#64748B] hover:bg-[#1A2A38] transition`}
                    onClick={() => {
                      setAreRepliesVisible(!areRepliesVisible);
                    }}
                  >
                    <img
                      src="/comment.png"
                      alt=""
                      className="h-3 w-3 md:h-3.5 md:w-3.5"
                    />
                    <span className="text-[12px] md:text-[14px]">{`${comment?.replies?.length || 0}`}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {areRepliesVisible && (
          <div>
            <div>
              {areRepliesVisible &&
                comment?.replies &&
                comment?.replies.length > 0 &&
                comment.replies.map((reply: Comment) => (
                  <div key={reply?._id} className="flex flex-col mt-2 pl-4">
                    <CommentsCard
                      comment={reply}
                      addReply={handleReply}
                      isActiveReply={isActiveReply}
                      threadId={threadId}
                    />
                  </div>
                ))}
            </div>
            {
              <div className="w-full mt-2 pl-4">
                <form
                  className="flex flex-1 items-center gap-3 rounded-[42px] border border-[#E2E8F0] bg-[#FAF9F8] pl-6 pr-2 py-1 md:py-3"
                  method="post"
                  noValidate
                  onSubmit={handleReply}
                >
                  <textarea
                    name="comment"
                    value={reply?.comment}
                    onChange={handleInputChange}
                    rows={1}
                    placeholder="Make a comment…"
                    className="flex-1 bg-transparent outline-none items-center text-[12px] md:text-base text-[#1E293B] placeholder-[#64748B]"
                  />
                  <button
                    type="submit"
                    className="flex h-8 md:h-[44px] w-[134px] items-center justify-center rounded-[34px] bg-[#023047] text-[12px] md:text-[16px] text-white"
                  >
                    Comment
                  </button>
                </form>
              </div>
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsCard;
