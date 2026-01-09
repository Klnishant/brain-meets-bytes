"use client";

import { getAuth } from "@/lib/getAuth";
import { intervalToDuration } from "date-fns";
import { ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { set } from "sanity";

type Comment = {
  sanityArticleId: string;
  ArticleId: number;
  userId: number;
  comment: string;
  parentCommentId: number | null;
  level: number;
  likeCount: number;
  dislikeCount: number;
  CommentId: number;
  children?: Comment[];
  createdAt: string;
};

type User = {
  _id: string;
  name: string;
  role: string;
  userId: number;
  ProfilePic: string;
};

type CommentsCardProps = {
  comment: Comment;
  addReply: (
    e: React.FormEvent<HTMLFormElement>,
    reply: string,
    parentCommentId: number
  ) => Promise<any>;
  isActiveReply: boolean;
};

const ArticleCommentsCard: React.FC<CommentsCardProps> = ({
  comment,
  addReply,
  isActiveReply,
}) => {
  const [reply, setReply] = useState({ comment: "" });
  const [showReply, setShowReply] = useState(false);
  const [areRepliesVisible, setAreRepliesVisible] = useState(false);
  const [users, setUsers] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [replyComment, setReplyComment] = useState<Comment [] | null>(comment?.children || null);
  const [likeCount, setLikeCount] = useState(comment?.likeCount || 0);
  const [isLiked, setIsLiked] = useState(false);

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
    if (!token) return;
    const user = async () => {
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
    user();
  },[token]);

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

  const response = await addReply(
    e,
    reply.comment,
    comment.CommentId
  );

  console.log("parentCommentId:", comment.CommentId);
  console.log("response:", response);
  if (response) {
  setReplyComment(prev => [...prev??[], response.data]);
}
};

useEffect(() => {
  const fetcLikeCount = async () => {
    if (!token) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/articles/like?commentId=${comment?.CommentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
  }
},[token]);

const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  const data = {
    CommentId: comment?.CommentId,
  };
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}articles/comments/like`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    if (!res.ok) {
      console.log("failed to like");
    }
    else{
      isLiked ? setLikeCount((prev) => prev - 1) : setLikeCount((prev) => prev + 1);
       setIsLiked(!isLiked);
    }
    const data2 = await res.json();
    console.log(data2);
  } catch (error: any) {
    console.log(error?.message,"failed to like and dislike");
    
  }
}


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
                {comment?.comment}
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
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 border border-[#2A4157] rounded-full text-[#64748B] hover:bg-[#1A2A38] ${isLiked ? "bg-[#1A2A38]" : ""} transition`}>
                    <img
                      src="/like.png"
                      alt=""
                      className="h-3 w-3 md:h-3.5 md:w-3.5"
                    />
                    <span className="text-[12px] md:text-[14px]">{`${likeCount}`}</span>
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
                    <span className="text-[12px] md:text-[14px]">{`${comment?.children?.length}`}</span>
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
                replyComment &&
                replyComment.length > 0 &&
                replyComment.map((reply: Comment) => (
                  <div
                    key={reply?.sanityArticleId}
                    className="flex flex-col mt-2 pl-4"
                  >
                    <ArticleCommentsCard
                      comment={reply}
                      addReply={handleReply}
                      isActiveReply={isActiveReply}
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

export default ArticleCommentsCard;
