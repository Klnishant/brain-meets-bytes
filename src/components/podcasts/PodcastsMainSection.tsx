"use client";

import { useEffect, useMemo, useState } from "react";
import { COLORS } from "@/lib/constants";
import Pagination from "./Pagination";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Redux/store";
import { openLogIn } from "@/Redux/slices/LogInSlice";

type Podcast = {
  _id: string;
  slug?: string;
  title?: string;
  author?: string;
  date?: string;
  imageUrl?: string;
  tags?: string[];
  podcastCount?: number;
};

const PodcastCard = ({ podcast }: { podcast: Podcast }) => {
  const { title, author, date, imageUrl, tags = [], podcastCount, slug } = podcast;
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setToken(auth?.auth?.token);
    setUserId(auth?.auth?.userId);
  }, [auth]);

  const formattedDate = useMemo(() => {
    if (!date) return "";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  }, [date]);

  return (
    <article className="flex flex-col border border-[#E2E8F0] rounded-2xl bg-[#FAF9F8] overflow-hidden h-full">
      <div className="pt-3 pr-3 pl-3">
        <div className="relative w-full pt-[56%] bg-[#CDCDCD] overflow-hidden rounded-lg">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 p-3 flex-1">
        <div className="flex items-center gap-3 text-xs text-[#505050]">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E2E8F0] text-[11px] text-[#64748B]">
            {author || "Unknown"}
          </span>
          {formattedDate && (
            <span className="text-[11px]">{formattedDate}</span>
          )}
        </div>

        <h3 className="font-sora text-[16px] md:text-[18px] font-semibold leading-normal text-[#1E293B]">
          {title}
        </h3>

        {Array.isArray(tags) && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 text-[11px]">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full border border-[#64748B] text-[#64748B]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="h-px w-full bg-[#E2E8F0] rounded-full" />

        <div className="flex items-center justify-between gap-4 mt-1">
          {/* When only one episode (or unknown), button takes full width and no count label */}
          {(!podcastCount || podcastCount <= 1) && (
            <button className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full border border-[#D62828] text-[14px] text-[#D62828] whitespace-nowrap w-full">
              <span>Listen</span>
              <span className="inline-flex items-center justify-center w-4 h-4">
                <span className="inline-block w-0 h-0 border-y-[6px] border-y-transparent border-l-10 border-l-[#D62828]" />
              </span>
            </button>
          )}

          {/* When multiple episodes, keep compact button and show episode count label */}
          {podcastCount && podcastCount > 1 && (
            <>
              {
                slug && token ? (
                  <Link href={`/podcasts/${slug}`}>
                <button className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#D62828] text-[14px] text-[#D62828] whitespace-nowrap">
                  <span>Listen</span>
                  <span className="inline-flex items-center justify-center w-4 h-4">
                    <span className="inline-block w-0 h-0 border-y-[6px] border-y-transparent border-l-10 border-l-[#D62828]" />
                  </span>
                </button>
              </Link>
                ) : (
                  <button
                    onClick={() => dispatch(openLogIn())}
                   className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#D62828] text-[14px] text-[#D62828] whitespace-nowrap">
                    <span>Listen</span>
                    <span className="inline-flex items-center justify-center w-4 h-4">
                      <span className="inline-block w-0 h-0 border-y-[6px] border-y-transparent border-l-10 border-l-[#D62828]" />
                    </span>
                  </button>
                )
              }

              <span className="text-[14px] text-[#D62828] ml-auto whitespace-nowrap">
                {podcastCount} Episodes
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

const PodcastsMainSection = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
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

        const res = await fetch("/api/featured-podcasts");
        if (!res.ok) {
          throw new Error("Failed to load podcasts");
        }

        const data = (await res.json()) as Podcast[];
        if (!mounted) return;
        setPodcasts(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Failed to load podcasts");
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
    let base = podcasts;

    // Filter by search text
    if (search.trim()) {
      const q = search.toLowerCase();
      base = base.filter((podcast) => {
        const title = (podcast.title || "").toLowerCase();
        const tagsText = Array.isArray(podcast.tags)
          ? podcast.tags.join(" ").toLowerCase()
          : "";
        const author = (podcast.author || "").toLowerCase();

        return title.includes(q) || tagsText.includes(q) || author.includes(q);
      });
    }

    // Filter by active tag
    if (activeTag !== "all") {
      base = base.filter(
        (podcast) =>
          Array.isArray(podcast?.tags) && podcast?.tags.includes(activeTag),
      );
    }

    // Sort by date
    const sorted = [...base].sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return sortBy === "recent" ? db - da : da - db;
    });

    return sorted;
  }, [podcasts, search, activeTag, sortBy]);

  // Determine page size based on available items (9 / 6 / 3)
  const totalItems = filteredAndSorted.length;
  const pageSize =
    totalItems >= 9 ? 9 : totalItems >= 6 ? 6 : totalItems > 0 ? 3 : 9;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginated = filteredAndSorted.slice(startIndex, endIndex);

  // Unique tags for filter chips
  const allTags = useMemo(() => {
    const set = new Set<string>();
    podcasts.forEach((podcast) => {
      (podcast.tags || []).forEach((tag) => set.add(tag));
    });
    return Array.from(set);
  }, [podcasts]);
  return (
    <section className="w-full py-16 md:py-20 lg:py-[100px]">
      <div className="mx-auto px-4 sm:px-6 lg:px-16 flex flex-col items-center gap-16">
        <div className="flex flex-col items-center gap-8 w-full text-center">
          <div className="flex flex-col gap-3">
            <h2 className="font-sora text-[20px] md:text-3xl lg:text-4xl font-bold">
              <span className="text-[#1E293B]">All</span>{" "}
              <span style={{ color: COLORS.brandRed }}>Podcasts</span>
            </h2>
            <p className="font-inter text-[12px] md:text-base text-[#505050]">
              Nam vulputate faucibus urna non mollis. Vivamus a vulputate
              turpis. Aenean efficitur aliquam dui a elementum.
            </p>
          </div>

          <div className="flex items-center gap-1 justify-between w-full  md:px-5 py-2 md:py-3">
            <div className="w-full">
              <div className=" md:max-w-[700px] flex items-center md:gap-3 rounded-full bg-[#E2E8F0] md:px-5 pl-4 pr-1 py-[9px] md:py-3">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search episodes, topics, guests…"
                  className="flex-1 bg-transparent outline-none text-[12px] md:text-base text-[#1E293B] placeholder-[#64748B]"
                />
                <button
                  type="button"
                  className="flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded-full"
                  style={{ backgroundColor: COLORS.brandRed }}
                >
                  <span className="relative block w-3 h-3 md:w-3.5 md:h-3.5 border-2 border-white rounded-full" />
                  <span className="block w-1.75 h-0.5 md:w-2 md:h-0.5 bg-white -ml-1 rotate-45 origin-left" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center gap-1">
              <button
                type="button"
                className="flex items-center justify-center gap-2.5 px-3 lg:px-8 h-[36px] lg:w-[232px] lg:h-[50px] md:h-[50px] md:w-[50px] text-[#023047] border border-[#023047] rounded-full"
                onClick={() => {
                  setSortBy((prev) =>
                    prev === "recent" ? "oldest" : "recent",
                  );
                  setCurrentPage(1);
                }}
              >
                <div className="flex items-center justify-center gap-0">
                  <img src="/sort 1.png" alt="" />
                </div>
                <span className="hidden lg:block">
                  Sort by: {sortBy === "recent" ? "Recent" : "Oldest"}
                </span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2.5 px-3 lg:px-8 w-[45px] lg:w-[149px] h-[36px] lg:h-[50px] md:h-[50px] md:w-[50px] text-[#023047] border border-[#023047] rounded-full"
                onClick={() => setFilterOpen(true)}
              >
                <span>
                  <img src="/filter 1.png" className="invert h-full w-full" />
                </span>
                <span className="hidden lg:block">Filters</span>
              </button>
            </div>
          </div>
        </div>

        {filterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
            <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-sora text-lg font-semibold text-[#1E293B]">
                  Filter by topic
                </h3>
                <button
                  className="text-sm text-[#64748B] hover:text-[#1E293B]"
                  onClick={() => setFilterOpen(false)}
                >
                  Close
                </button>
              </div>

              {allTags.length === 0 ? (
                <p className="text-sm text-[#64748B]">
                  No topics available yet.
                </p>
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
        <div className="w-full">
          {loading && (
            <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse max-w-xl"
                >
                  {/* Image Skeleton */}
                  <div className="w-full h-64 bg-gray-200"></div>

                  {/* Content Section */}
                  <div className="p-5 space-y-4">
                    {/* Author and Date */}
                    <div className="flex items-center gap-3">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-4 bg-gray-200 rounded w-28"></div>
                    </div>

                    {/* Title Skeleton */}
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </div>

                    {/* Tag Skeleton */}
                    <div className="h-8 w-20 bg-gray-200 rounded-full"></div>

                    {/* Listen Button and Episodes */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="h-11 w-32 bg-gray-200 rounded-full"></div>
                      <div className="h-5 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {error && !loading && (
            <div>
              <p className="text-center text-sm text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {paginated.map((podcast) => (
                <PodcastCard key={podcast._id} podcast={podcast} />
              ))}
              {!loading && !error && totalItems === 0 && (
                <p className="col-span-full text-center text-sm text-[#64748B]">
                  No podcasts match your search.
                </p>
              )}
            </div>
          )}
        </div>

        <div>
          <div className="flex w-full max-w-[905px] items-center gap-6 justify-between">
            {/* Previous */}
            <button
              className="flex h-[26px] w-[80px] md:h-[50px] md:w-[146px] items-center justify-center gap-1 md:gap-3 rounded-[47px] bg-[#023047]/40 px-4 py-3 text-[10px] md:text-[16px] text-[#F7F9FC] disabled:opacity-40"
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`flex h-5 w-5 md:h-8 md:w-8 items-center justify-center rounded text-[12px] md:text-[18px] ${
                      page === safeCurrentPage
                        ? "bg-[#D62828] font-semibold text-[#EBE6DC]"
                        : "font-normal text-[#1E293B]"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            {/* Next */}
            <button
              className="flex h-[26px] w-[80px] md:h-[50px] md:w-[146px] items-center justify-center gap-1 md:gap-3 rounded-[47px] bg-[#023047] px-4 py-3 text-[10px] md:text-[16px] text-[#F7F9FC] disabled:opacity-40"
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

export default PodcastsMainSection;
