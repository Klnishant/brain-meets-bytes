"use client";

import { useEffect, useMemo, useState } from "react";
import { COLORS } from "@/lib/constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Redux/store";
import { openLogIn } from "@/Redux/slices/LogInSlice";
import { useRouter } from "next/navigation";

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

const PodcastCard = ({ podcast }: { podcast: Podcast }) => {
  const { slug, title, author, date, imageUrl, tags = [], podcastCount } = podcast;
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
    <article className={`flex flex-col border border-[#E2E8F0] rounded-2xl bg-[#FAF9F8] overflow-hidden h-full ${!isOlderThan7Days(date || "") && !user?.hasmembership ? "opacity-50" : ""}`}
    aria-disabled={!isOlderThan7Days(date || "") && !user?.hasmembership}
    >
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
          {formattedDate && <span className="text-[11px]">{formattedDate}</span>}
        </div>

        <h3 className="font-sora text-[16px] md:text-[18px] font-semibold leading-normal text-[#1E293B]">
          {title}
        </h3>

        {Array.isArray(tags) && tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 text-[11px]">
            {tags?.map((tag) => (
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
            <button 
            onClick={()=> {
                if (!isOlderThan7Days(date || "") && !user?.hasmembership) return;
                router.push(`/podcasts/${slug}`);
              }}
            className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full border border-[#D62828] text-[14px] text-[#D62828] whitespace-nowrap w-full">
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
                <button
                 onClick={()=> {
                if (!isOlderThan7Days(date || "") && !user?.hasmembership) return;
                router.push(`/podcasts/${slug}`);
              }}
                 className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#D62828] text-[14px] text-[#D62828] whitespace-nowrap">
                  <span>Listen</span>
                  <span className="inline-flex items-center justify-center w-4 h-4">
                    <span className="inline-block w-0 h-0 border-y-[6px] border-y-transparent border-l-10 border-l-[#D62828]" />
                  </span>
                </button>
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

const FeaturedPodcastsSection = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const router = useRouter();

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

  const filtered = useMemo(() => {
    if (!search.trim()) return podcasts;
    const q = search.toLowerCase();
    return podcasts.filter((p) => {
      const title = (p.title || "").toLowerCase();
      const author = (p.author || "").toLowerCase();
      const tagsText = Array.isArray(p.tags)
        ? p.tags.join(" ").toLowerCase()
        : "";
      return title.includes(q) || author.includes(q) || tagsText.includes(q);
    });
  }, [podcasts, search]);
  
  const visiblePodcasts = useMemo(() => {
  if (showAll) return filtered;
  return filtered.slice(0, 6);
}, [filtered, showAll]);


  return (
    <section className="w-full py-16 md:py-20 lg:py-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-16 flex flex-col items-center gap-16">
        <div className="flex flex-col items-center gap-8 max-w-3xl text-center">
          <div className="flex flex-col gap-3">
            <h2 className="font-sora text-xl md:text-3xl lg:text-4xl font-bold">
              <span style={{ color: COLORS.brandRed }}>Featured</span>{" "}
              <span className="text-[#1E293B]">Podcasts</span>
            </h2>
            {/* <p className="font-inter text-[12px] md:text-base text-[#505050]">
              Dive into handpicked podcasts that explore the most exciting breakthroughs in brain
              health and longevity.
            </p> */}
          </div>

          <div className="w-full max-w-xl flex items-center gap-3 rounded-full bg-[#E2E8F0] px-5 py-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="What are you looking for ?"
              className="flex-1 bg-transparent outline-none text-sm md:text-base text-[#1E293B] placeholder-[#64748B]"
            />
            <button
              type="button"
              className="flex items-center justify-center w-9 h-9 rounded-full"
              style={{ backgroundColor: COLORS.brandRed }}
            >
              <span className="relative block w-3.5 h-3.5 border-2 border-white rounded-full" />
              <span className="block w-2 h-0.5 bg-white -ml-1 rotate-45 origin-left" />
            </button>
          </div>
        </div>

        <div className="w-full">
          {loading && (
            <p className="text-center text-sm text-[#64748B]">Loading featured podcasts...</p>
          )}
          {error && !loading && (
            <p className="text-center text-sm text-red-600">{error}</p>
          )}

          {!loading && !error && (
            <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {visiblePodcasts?.map((podcast) => (
                <PodcastCard key={podcast._id} podcast={podcast} />
              ))}
              {filtered?.length === 0 && (
                <p className="col-span-full text-center text-sm text-[#64748B]">
                  No podcasts match your search.
                </p>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => router.push("/podcasts")}
          className="w-full md:w-auto inline-flex items-center justify-center px-8 md:px-10 py-3 rounded-full text-sm md:text-base text-white"
          style={{ backgroundColor: COLORS.brandNavy }}
        >
          Discover all
        </button>
      </div>
    </section>
  );
};

export default FeaturedPodcastsSection;
