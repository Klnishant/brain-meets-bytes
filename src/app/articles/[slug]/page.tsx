"use client";
import Navbar from "@/components/core/Navbar";
import Footer from "@/components/core/Footer";
import Link from "next/link";
import { sanityClient } from "@/lib/sanityClient";
import { useEffect, useMemo, useState } from "react";
import { set } from "sanity";
import CommentsCard from "@/components/forums/CommentsCard";
import { getAuth } from "@/lib/getAuth";
import ArticleCommentsCard from "@/components/commentsCard/ArticleCommentsCard";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments, postComment } from "@/Redux/slices/ArticleCommentSlice";
import { AppDispatch, RootState } from "@/Redux/store";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

 type Comment = {
  sanityArticleId: string;
  ArticleId: number;
  CommentId: number;
  userId: number;
  comment: string;
  parentCommentId?: number | null;
  level: number;
  likeCount: number;
  likedBy: number[];
  replies?: Comment[];
  createdAt: string;
};

type NestedComment = {
    _id: string;
    text: string;
    parentCommentId: string | null;
  };

type Author = {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
};

type Article = {
  _id: string;
  title: string;
  date?: string;
  imageUrl?: string;
  tags?: string[];
  excerpt?: string;
  slug?: string;
  authors?: Author[];
  content?: {
    _key: string;
    _type: string;
    children?: { _key: string; text?: string }[];
    style?: string;
  }[];
};

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  RoleId: number;
  Rolename: string;
  hasmembership: boolean;
  userId: number;
  ProfilePic: string;
};

const formatDate = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const renderBlocks = (blocks: Article["content"]) => {
  if (!blocks || !Array.isArray(blocks)) return null;

  return blocks.map((block) => {
    if (block._type !== "block") return null;
    const text = (block.children || [])
      .map((child) => child.text || "")
      .join("")
      .trim();

    if (!text) return null;

    if (block.style === "h2") {
      return (
        <h2
          key={block._key}
          className="mt-10 mb-4 font-sora text-[28px] md:text-[32px] font-semibold text-[#1E293B]"
        >
          {text}
        </h2>
      );
    }

    if (block.style === "h3") {
      return (
        <h3
          key={block._key}
          className="mt-8 mb-3 font-sora text-[22px] md:text-[24px] font-semibold text-[#1E293B]"
        >
          {text}
        </h3>
      );
    }

    return (
      <p
        key={block._key}
        className="mb-6 font-inter text-[16px] md:text-[18px] leading-[32px] text-[#505050]"
      >
        {text}
      </p>
    );
  });
};

const RelatedArticleCard = ({ article }: { article: any }) => {
  const { title, authors, date, imageUrl, tags = [], excerpt, slug } = article;

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-[#FAF9F8]">
      <div className="px-5 pt-5">
        <div className="relative w-full overflow-hidden rounded-lg bg-[#CDCDCD] pt-[54%]">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5 pb-5 pt-6">
        <div className="flex items-center gap-4 text-xs text-[#505050]">
          {
            authors && (
              authors?.map((author: Author) => (
                <span
                  key={author?.name}
                  className="inline-flex items-center rounded-full bg-[#E2E8F0] px-3 py-1 text-[11px] text-[#64748B]"
                >
                  {author?.name || "Unknown"}
                </span>
              ))
            )
          }
          <span className="text-[11px] text-[#505050]">{formatDate(date)}</span>
        </div>

        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 text-[11px]">
            {tags?.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-[#64748B] px-3 py-1 text-[#64748B]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="font-sora text-[20px] font-semibold leading-[30px] text-[#1E293B]">
          {title}
        </h3>

        <p className="font-inter text-[14px] leading-[24px] text-[#505050]">
          {excerpt}
        </p>

        <div className="mt-4 h-[2px] w-full rounded-full bg-[#E2E8F0]" />

        <div className="mt-3 flex items-center justify-between">
          {slug ? (
            <Link
              href={`/articles/${slug}`}
              className="inline-flex items-center gap-2 rounded-[36px] border border-[#D62828] px-6 py-2 text-[14px] font-normal text-[#D62828]"
            >
              Read More
            </Link>
          ) : (
            <button className="inline-flex items-center gap-2 rounded-[36px] border border-[#D62828] px-6 py-2 text-[14px] font-normal text-[#D62828]">
              Read More
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

const ArticlePage = ({ params }: ArticlePageProps) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [likedCount, setLikedCount] = useState(0);
  const [commentData, setCommentData] = useState({ comment: "" });
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [nestedComments, setNestedComments] = useState<Comment[]>([]);
  const [isReplying, setIsReplying] = useState(false);
  const [user,setUser] = useState<User | null>(null)
  const [visibleRelated, setVisibleRelated] = useState<Article[]>([]);

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
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const { slug } = await params;
        const res = await fetch(`/api/articles/${slug}`);
        if (!res.ok) {
          throw new Error("Failed to load articles");
        }

        const data = await res.json();
        if (!mounted) return;
        console.log(data);
        setArticle(data?.article || null);
        setRelated(Array.isArray(data?.related) ? data?.related : []);
        
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Failed to load articles");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const visible = related.slice(0, 3);
    setVisibleRelated(visible);
  },[article]);

  const handleAll = () => {
    setVisibleRelated(related);
  }

  const dispatch = useDispatch<AppDispatch>();
  
     useEffect(() => {
    if (token && article?._id) {
      dispatch(
        fetchComments({
          articleId: article._id,
          token,
        })
      );
    }
  }, [token, article?._id]);

  const commentsTree = useSelector(
    (state: RootState) =>
      state.articleComments.byArticle[article?._id ?? ""]?.tree || []
  );

  console.log("commentsTree",commentsTree);
  

  const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const data = {
      sanityArticleId: article?._id,
      articleName: article?.title,
      reaction: isLiked ? "dislike" : "like",
    };
    let Res;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}articles/like`,
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
        if (isLiked) {
          setIsLiked(false);
          setLikedCount((prev) => prev - 1);
        } else {
          setIsLiked(true);
          setLikedCount((prev) => prev + 1);
        }
      } else {
      }
    } catch (error: any) {
      setError(error?.message ?? "Failed to send like or dislike");
      toast.error(error?.message ?? "Failed to send like or dislike");
    }
  };

  useEffect(() => {
    const fetchLikedCount = async () => {
      if(!token) return
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}articles/like?sanityArticleId=${article?._id}`,
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
      console.log("liked Count", data);

      setLikedCount(data?.data?.likeCount);
      setIsLiked(data?.data?.usersWhoLiked?.includes(Number(userId)));
      console.log(isLiked);
      console.log(userId);
    }
  };
  fetchLikedCount();
  },[token, article]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCommentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const handleComment = (
    e: React.FormEvent<HTMLFormElement>,
    reply: string,
    parentCommentId?: number
  ) => {
    if ( !token) return;
    e.preventDefault();
  
    dispatch(
      postComment({
        articleId: article?._id ?? "",
        token,
        comment: reply,
        parentCommentId, // undefined = root comment
      })
    );
  };

   const handleReply = (
    e: React.FormEvent<HTMLFormElement>,
    reply: string,
    parentCommentId?: number
  ) => {
    if ( !token) return;
    e.preventDefault();
  
    dispatch(
      postComment({
        articleId: article?._id ?? "",
        token,
        comment: reply,
        parentCommentId, // undefined = root comment
      })
    );
    setCommentData({ comment: "" });
  };
  const fallbackShare = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard");
  };

  const handleShare = async () => {
    const shareData = {
      title: article?.title,
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
      if(!token) return
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}articles/getSavedUsersFrArticles?sanityArticleId=${article?._id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res);

    if (res.ok) {
      const data = await res.json();
      setIsSaved(
        data?.data?.some(
          (item: { savedBy: { userId: number } }) =>
            item?.savedBy.userId === Number(userId)
        )
      );
    }
  };
  fetchSaved();
  },[token,article]);
  const handleSave = async () => {
    try {
      const body = {
        sanityArticleId: article?._id,
      };
      console.log(body);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}articles/save`,
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
    }
  };

  if (!article) {
    return (
      <main className="min-h-screen bg-[#FAF9F8]">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-24 text-center font-inter text-[#1E293B]">
          Article not found.
        </div>
        <Footer />
      </main>
    );
  }

  const {
    title,
    date,
    imageUrl,
    tags = [],
    excerpt,
    authors,
    content,
  } = article;

  const primaryAuthor = authors?.[0];

  const displayAuthorName = primaryAuthor?.name || "Unknown";

  const displayAuthorRole = primaryAuthor?.role || "";

  const displayAuthorBio =
    primaryAuthor?.bio ||
    "I am a seasoned professional with a rich background in health, technology and leadership. Drawing on extensive experience in the memory care sector and emerging technologies, I am dedicated to exploring the dynamic landscape of brain health and longevity.";

  const authorImageUrl = primaryAuthor?.imageUrl;

  return (
    <main className="min-h-screen bg-[#FAF9F8]">
      <Navbar />

      {/* Breadcrumb */}
      <section className="w-full pt-8">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-16">
          <div className="flex items-center justify-between rounded-[20px] border border-[#E2E8F0] bg-white px-5 py-4 text-sm text-[#1E293B]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-inter text-[14px] text-[#1E293B]">
                Home
              </span>
              <span className="text-[#1E293B]">/</span>
              <span className="font-inter text-[14px] text-[#1E293B]">
                Articles
              </span>
              <span className="text-[#1E293B]">/</span>
              <span className="font-inter text-[14px] text-[#1E293B]">
                {title}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Article content */}
      <section className="w-full pb-20 pt-10 md:pb-24 md:pt-12 lg:pb-28">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-16">
          <div className="flex flex-col gap-10">
            {/* Title + meta */}
            <div className="flex flex-col gap-6">
              <h1 className="font-sora text-[32px] md:text-[42px] lg:text-[56px] font-semibold leading-[1.25] text-[#1E293B]">
                {title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                {authors &&
                  authors?.map((author, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-3 rounded-full bg-[#E2E8F0] px-4 py-2"
                    >
                      <span className="font-inter text-[14px] text-[#64748B]">
                        {author?.name || "Unknown"}
                      </span>
                      {displayAuthorRole && (
                        <span className="font-inter text-[12px] text-[#94A3B8]">
                          {author?.role || "Unknown"}
                        </span>
                      )}
                    </div>
                  ))}
                <span className="font-inter text-[14px] text-[#505050]">
                  {formatDate(date)}
                </span>
              </div>

              {tags?.length > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  {tags?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full border border-[#64748B] px-4 py-2 font-inter text-[14px] text-[#64748B]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Hero image */}
            {imageUrl && (
              <div className="overflow-hidden rounded-[32px] bg-[#CDCDCD]">
                <img
                  src={imageUrl}
                  alt={title}
                  className="h-[580px] w-full object-cover"
                />
              </div>
            )}

            {/* Intro / excerpt */}
            {excerpt && (
              <p className="font-inter text-[16px] md:text-[18px] leading-[32px] text-[#505050]">
                {excerpt}
              </p>
            )}

            {/* Main body blocks */}
            <div className="flex flex-col">{renderBlocks(content)}</div>

            {/* Author card */}
            {authors &&
              authors?.map((author, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-6 rounded-[32px] bg-[#E2E8F0] p-6 md:flex-row md:items-center md:p-8"
                >
                  {authorImageUrl && (
                    <div className="relative h-[221px] w-[221px] flex-shrink-0">
                      <div className="absolute left-0.5 top-3 h-[221px] w-[221px] rounded-[32px] bg-[#023047]" />
                      <div className="absolute left-0.5 top-0 h-[221px] w-[221px] overflow-hidden rounded-[32px] border-4 border-[#FAF9F8]">
                        <img
                          src={author?.imageUrl}
                          alt={author?.name}
                          className="h-full w-full object-cover "
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-1 flex-col gap-4">
                    <h3 className="font-sora text-[24px] font-semibold text-[#1E293B]">
                      {author?.name || "Unknown"}
                    </h3>
                    <p className="font-inter text-[16px] md:text-[18px] leading-[32px] text-[#505050]">
                      {author?.bio || "Unknown"}
                    </p>
                  </div>
                </div>
              ))}
            {/*BTNS*/}
            <div className="">
              <div className="flex items-center gap-3 md:gap-6 py-5">
                {/* Like */}
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 border border-[#2A4157] rounded-full text-[#64748B] hover:bg-[#1A2A38] ${isLiked ? "bg-[#1A2A38]" : ""} transition`}
                >
                  <img
                    src="/like.png"
                    alt=""
                    className="h-3 w-3 md:h-3.5 md:w-3.5"
                  />
                  <span className="text-[12px] md:text-[14px]">
                    {likedCount}
                  </span>
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
                  <span className="text-[12px] md:text-[14px]">
                    {commentsTree?.length}
                  </span>
                </button>

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
                  className={`flex items-center gap-2 px-4 py-2 border border-[#2A4157] rounded-full text-[#64748B] hover:bg-[#1A2A38] ${isSaved ? "bg-[#1A2A38]" : ""} transition`}
                >
                  <img
                    src="/save.png"
                    alt=""
                    className="h-3 w-3 md:h-3.5 md:w-3.5"
                  />
                  <span className="text-[12px] md:text-[14px]">Save</span>
                </button>
              </div>
            </div>

            {/* Comments bar */}
            <div
              className={`flex items-center gap-2 md:gap-4 ${isCommentOpen ? "block" : "hidden"}`}
            >
              <div className="h-[40px] w-[40px] md:h-[60px] md:w-[65px] overflow-hidden rounded-[78px] border-2 border-[#D62828]">
                <img
                  src={user?.ProfilePic}
                  alt="Current user"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="w-full ">
                <form
                  className="flex flex-1 items-center gap-3 rounded-[42px] border border-[#E2E8F0] bg-[#FAF9F8] pl-3 md:pl-6 pr-2 py-2 md:py-3"
                  method="post"
                  noValidate
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleComment(e, commentData.comment)}
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
                    className="flex h-[30px]  md:h-11 w-[134px] items-center justify-center rounded-[34px] bg-[#023047] text-[12px] md:text-[16px] text-white"
                  >
                    Comment
                  </button>
                </form>
              </div>
            </div>

            {/* Comments */}
            {commentsTree && commentsTree.length > 0 && (
              <div
                className={`${isCommentOpen ? "block" : "hidden"} mt-2 flex flex-col gap-8`}
              >
                {commentsTree.map((c) => (
                  <ArticleCommentsCard
                    key={c?.sanityArticleId}
                    comment={c}
                    addReply={handleComment}
                    isActiveReply={false}
                  />
                ))}
              </div>
            )}

            {/* Related articles */}
            {related && related.length > 0 && (
              <div className="mt-8 flex flex-col items-center gap-10">
                <div className="flex flex-col items-center gap-3 text-center">
                  <h2 className="font-sora text-[32px] md:text-[36px] font-bold leading-[45px] text-[#000000]">
                    Related Articles &amp; Interviews
                  </h2>
                  {/* <p className="max-w-[700px] font-inter text-[16px] md:text-[18px] leading-[22px] text-[#505050]">
                    Nam vulputate faucibus urna non mollis. Vivamus a vulputate
                    turpis. Aenean efficitur aliquam dui a elementum.
                  </p> */}
                </div>

                <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {visibleRelated.map((a) => (
                    <RelatedArticleCard key={a._id} article={a} />
                  ))}
                </div>

                <button 
                onClick={handleAll}
                className="inline-flex items-center justify-center gap-3 rounded-[36px] bg-[#023047] px-10 py-3 text-[16px] text-white">
                  Discover all
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ArticlePage;
