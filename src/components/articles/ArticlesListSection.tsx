"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { COLORS } from "@/lib/constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Redux/store";
import { openLogIn } from "@/Redux/slices/LogInSlice";
import { useRouter } from "next/navigation";

type Author = {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
};

type Article = {
  _id: string;
  title?: string;
  authors?: Author[];
  date?: string;
  imageUrl?: string;
  tags?: string[];
  excerpt?: string;
  slug?: string;
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

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const ArticleCard = ({ article }: { article: Article }) => {
  const { title = "Untitled", authors, date, imageUrl, tags = [], excerpt, slug } = article;
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();

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

  const isOlderThan7Days = (date: string) => {
  const givenDate = new Date(date);
  const now = new Date();

  const diffInMs = now.getTime() - givenDate.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  return diffInDays >= 7;
};
  

  return (
    <article className={`relative flex h-full flex-col overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-[#FAF9F8] ${!isOlderThan7Days(date || "") && !user?.hasmembership ? "opacity-50" : ""}`}
      aria-disabled={!isOlderThan7Days(date!) && !user?.hasmembership}
    >
      {/* Image */}
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

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 px-5 pb-5 pt-6">
        {/* Author + date */}
        <div className="flex items-center gap-4 text-xs text-[#505050]">
          {
            authors ? (
              authors?.map((author) => (
              <span
                key={author?.name}
                className="inline-flex items-center rounded-full bg-[#E2E8F0] px-3 py-1 text-[11px] text-[#64748B]"
              >
                {author?.name || "Unknown"}
              </span>
            ))
            ) : (
              <span
                className="inline-flex items-center rounded-full bg-[#E2E8F0] px-3 py-1 text-[11px] text-[#64748B]"
              >
                Unknown
              </span>
            )
          }
          <span className="text-[11px] text-[#505050]">{formatDate(date || "")}</span>
        </div>

        {/* Title */}
        <h3 className="font-sora text-[20px] font-semibold leading-[30px] text-[#1E293B]">
          {title}
        </h3>

        {/* Tags */}
        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 text-[11px]">
            {tags?.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-[#64748B] px-3 py-1 text-[#64748B]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Excerpt */}
        <p className="font-inter text-[14px] leading-[24px] text-[#505050]">
          {excerpt}
        </p>

        {/* Divider */}
        <div className="mt-2 h-[2px] w-full rounded-full bg-[#E2E8F0]" />

        {/* Footer CTA (Read more) */}
        <div className="w-fullmt-2 flex items-center justify-between">
          {slug ? (
            <button
              onClick={()=> {
                if (!isOlderThan7Days(date || "") && !user?.hasmembership) return;
                router.push(`/articles/${slug}`);
              }}
              className="w-full md:w-auto justify-center inline-flex items-center gap-2 rounded-[36px] border border-[#D62828] md:px-6 py-2 text-[14px] font-normal text-[#D62828]"
            >
              Read More
            </button>
          ) : (
            <button 
            // onClick={() => dispatch(openLogIn())}
            className=" w-full md:w-auto inline-flex items-center gap-2 rounded-[36px] border border-[#D62828] px-6 py-2 text-[14px] font-normal text-[#D62828]">
              Read More
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

const ArticlesListSection = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "oldest">("recent");
  const [activeTag, setActiveTag] = useState<string | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/articles");
        if (!res.ok) {
          throw new Error("Failed to load articles");
        }

        const data = (await res.json()) as Article[];
        if (!mounted) return;
        setArticles(Array.isArray(data) ? data : []);
        
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

  const filteredAndSorted = useMemo(() => {
    let base = articles;

    // Filter by search text
    if (search.trim()) {
      const q = search.toLowerCase();
      base = base.filter((article) => {
        const title = (article.title || "").toLowerCase();
        const excerpt = (article.excerpt || "").toLowerCase();
        const tagsText = Array.isArray(article.tags) ? article.tags.join(" ").toLowerCase() : "";
        const author = Array.isArray(article?.authors) ? article?.authors.map((author) => author?.name).join(" ").toLowerCase() : "";

        return (
          title.includes(q) ||
          excerpt.includes(q) ||
          tagsText.includes(q) ||
          author.includes(q)
        );
      });
    }

    // Filter by active tag
    if (activeTag !== "all") {
      base = base.filter((article) => Array.isArray(article.tags) && article.tags.includes(activeTag));
    }

    // Sort by date
    const sorted = [...base].sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return sortBy === "recent" ? db - da : da - db;
    });

    return sorted;
  }, [articles, search, activeTag, sortBy]);

  // Determine page size based on available items (9 / 6 / 3)
  const totalItems = filteredAndSorted.length;
  const pageSize = totalItems >= 9 ? 9 : totalItems >= 6 ? 6 : totalItems > 0 ? 3 : 9;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginated = filteredAndSorted.slice(startIndex, endIndex);

  // Unique tags for filter chips
  const allTags = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((article) => {
      (article.tags || []).forEach((tag) => set.add(tag));
    });
    return Array.from(set);
  }, [articles]);

  return (
    <section className="w-full bg-[#FAF9F8] py-16 md:py-20 lg:py-24">
      <div className="mx-auto flex max-w-[1601px] flex-col items-center gap-16 px-4 sm:px-6 lg:px-16">
        {/* Header + search + sort/filter */}
        <div className="flex w-full flex-col items-center gap-12">
          {/* Title + subcopy */}
          <div className="flex w-full max-w-[1601px] flex-col items-center gap-3 text-center">
            <h2 className="font-sora text-3xl md:text-[36px] font-bold leading-[45px] text-[#1E293B]">
              All <span style={{ color: COLORS.brandRed }}>Articles</span>
            </h2>
            {/* <p className="max-w-[937px] font-inter text-[16px] md:text-[18px] leading-[22px] text-[#505050]">
              Nam vulputate faucibus urna non mollis. Vivamus a vulputate turpis. Aenean efficitur aliquam dui a elementum.
            </p> */}
          </div>

          {/* Search + filter row */}
          <div className="flex w-full max-w-[1601px] gap-4 md:gap-6 md:items-center md:justify-between">
            {/* Search bar */}
            <div className="flex w-full max-w-[700px] items-center justify-between gap-4 rounded-[42px] bg-[#E2E8F0] px-6 py-3">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search articles, topics, authors…"
                className="flex-1 bg-transparent font-sora text-[12px] md:text-[18px] text-[#1E293B] placeholder:text-[#64748B] outline-none"
              />
              <button
                type="button"
                className="flex h-7 w-7 md:h-[34px] md:w-[34px] items-center justify-center rounded-full"
                style={{ backgroundColor: COLORS.brandRed }}
              >
                <span className="relative block h-4 w-4">
                  <span className="absolute inset-0 rounded-full border-2 border-white" />
                  <span className="absolute right-0 top-1/2 h-[2px] w-2 -translate-y-1/2 rotate-45 transform bg-white" />
                </span>
              </button>
            </div>

            {/* Sort + Filter */}
            <div className="flex w-full max-w-[401px] flex-row items-center gap-4 md:justify-end">
              {/* Sort button */}
              <button
                className="flex h-9 w-9 md:w-fit md:h-[50px] md:flex-1 items-center justify-center gap-3 rounded-full border border-[#023047] md:px-8 text-[16px] text-[#023047]"
                onClick={() => {
                  setSortBy((prev) => (prev === "recent" ? "oldest" : "recent"));
                  setCurrentPage(1);
                }}
              >
                <img
                  src="/sort 1.png"
                  alt="Sort"
                  className="
                 h-3 w-3 md:h-[18px] md:w-[18px] object-contain"
                />
                <span className="font-sora hidden md:block">Sort by: {sortBy === "recent" ? "Recent" : "Oldest"}</span>
              </button>

              {/* Filter button */}
              {/* <button
                className="flex h-9 w-9 md:h-[50px] md:w-[149px] items-center justify-center gap-3 rounded-full bg-[#023047] md:px-8 text-[16px] text-white"
                onClick={() => setFilterOpen(true)}
              >
                <img
                  src="/filter 1.png"
                  alt="Filters"
                  className="h-3 w-3 md:h-[18px] md:w-[18px] object-contain"
                />
                <span className="font-sora hidden md:block">Filters</span>
              </button> */}
            </div>
          </div>
        </div>

        {/* Filter popup (hidden by default) */}
        {filterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
            <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-sora text-lg font-semibold text-[#1E293B]">Filter by topic</h3>
                <button
                  className="text-sm text-[#64748B] hover:text-[#1E293B]"
                  onClick={() => setFilterOpen(false)}
                >
                  Close
                </button>
              </div>

              {allTags.length === 0 ? (
                <p className="text-sm text-[#64748B]">No topics available yet.</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  <button
                    className={`inline-flex items-center rounded-full border px-4 py-1 text-sm ${
                      activeTag === "all"
                        ? "border-[#D62828] bg-[#D62828]/10 text-[#D62828]"
                        : "border-[#E2E8F0] bg-white text-[#64748B]"
                    }`}
                    onClick={() => {
                      setActiveTag("all");
                      setCurrentPage(1);
                    }}
                  >
                    All topics
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      className={`inline-flex items-center rounded-full border px-4 py-1 text-sm ${
                        activeTag === tag
                          ? "border-[#D62828] bg-[#D62828]/10 text-[#D62828]"
                          : "border-[#E2E8F0] bg-white text-[#64748B]"
                      }`}
                      onClick={() => {
                        setActiveTag(tag);
                        setCurrentPage(1);
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  className="rounded-full border border-[#E2E8F0] px-5 py-2 text-sm text-[#64748B]"
                  onClick={() => {
                    setActiveTag("all");
                    setCurrentPage(1);
                    setFilterOpen(false);
                  }}
                >
                  Reset
                </button>
                <button
                  className="rounded-full bg-[#023047] px-6 py-2 text-sm text-white"
                  onClick={() => setFilterOpen(false)}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cards grid */}
        <div className="flex w-full flex-col items-center gap-12">
          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {loading && !error && (
              <div className="col-span-full text-center text-sm text-[#64748B]">
               <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                  {/* Image skeleton */}
                  <div className="w-full h-48 bg-gray-200"></div>

                  {/* Content section */}
                  <div className="p-5">
                    {/* Date skeleton */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                      <div className="h-3 w-20 bg-gray-200 rounded"></div>
                    </div>

                    {/* Title skeleton */}
                    <div className="space-y-2 mb-4">
                      <div className="h-5 w-full bg-gray-200 rounded"></div>
                      <div className="h-5 w-full bg-gray-200 rounded"></div>
                      <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                    </div>

                    {/* Tags skeleton */}
                    <div className="flex gap-2 mb-4">
                      <div className="h-7 w-24 bg-gray-200 rounded-full"></div>
                      <div className="h-7 w-16 bg-gray-200 rounded-full"></div>
                      <div className="h-7 w-20 bg-gray-200 rounded-full"></div>
                    </div>

                    {/* Description skeleton */}
                    <div className="space-y-2 mb-5">
                      <div className="h-3 w-full bg-gray-200 rounded"></div>
                      <div className="h-3 w-full bg-gray-200 rounded"></div>
                      <div className="h-3 w-full bg-gray-200 rounded"></div>
                      <div className="h-3 w-full bg-gray-200 rounded"></div>
                      <div className="h-3 w-full bg-gray-200 rounded"></div>
                      <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
                    </div>

                    {/* Read More button skeleton */}
                    <div className="h-10 w-28 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
              </div>
            )}

            {!loading && error && (
              <p className="col-span-full text-center text-sm text-red-600">{error}</p>
            )}

            {!loading && !error &&
              paginated.map((article) => <ArticleCard key={article._id} article={article} />)}

            {!loading && !error && totalItems === 0 && (
              <p className="col-span-full text-center text-sm text-[#64748B]">
                No articles match your search.
              </p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex w-full max-w-[905px] flex-col items-center gap-6 md:flex-row md:justify-between">
            {/* Previous */}
            <button
              className="flex h-[50px] w-[146px] items-center justify-center gap-3 rounded-[47px] bg-[#023047]/40 px-4 text-[16px] text-[#F7F9FC] disabled:opacity-40"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage === 1}
            >
              <span className="inline-flex rotate-180">
                <span className="block h-0 w-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-[#F7F9FC]" />
              </span>
              <span className="font-inter">Previous</span>
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`flex h-8 w-8 items-center justify-center rounded text-[18px] ${
                    page === safeCurrentPage
                      ? "bg-[#D62828] font-semibold text-[#EBE6DC]"
                      : "font-normal text-[#1E293B]"
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Next */}
            <button
              className="flex h-[50px] w-[146px] items-center justify-center gap-3 rounded-[47px] bg-[#023047] px-4 text-[16px] text-[#F7F9FC] disabled:opacity-40"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage === totalPages}
            >
              <span className="font-inter">Next</span>
              <span className="inline-flex">
                <span className="block h-0 w-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-[#F7F9FC]" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticlesListSection;
