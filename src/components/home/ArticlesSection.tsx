"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { COLORS } from "@/lib/constants";

type Article = {
  _id: string;
  title?: string;
  author?: string;
  date?: string;
  imageUrl?: string;
  tags?: string[];
  excerpt?: string;
  slug?: string;
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
  const { title = "Untitled", author, date, imageUrl, tags = [], excerpt, slug } = article;

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
          <span className="text-[11px]">{formatDate(date || "")}</span>
        </div>

        {tags.length > 0 && (
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

        <h3 className="font-sora text-[20px] font-semibold leading-[30px] text-[#1E293B]">
          {title}
        </h3>

        <p className="font-inter text-[14px] leading-[24px] text-[#505050] overflow-hidden text-ellipsis">
          {excerpt}
        </p>

        <div className="mt-auto pt-4 border-t border-[#E2E8F0]">
          {slug ? (
            <Link
              href={`/articles/${slug}`}
              className="w-full inline-flex items-center justify-center px-8 py-3 rounded-full text-[16px] font-normal text-[#D62828] border border-[#D62828]"
            >
              Read More
            </Link>
          ) : (
            <button
              className="w-full inline-flex items-center justify-center px-8 py-3 rounded-full text-[16px] font-normal text-[#D62828] border border-[#D62828]"
            >
              Read More
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

const ArticlesSection = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

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

  const filtered = useMemo(() => {
    if (!search.trim()) return articles;
    const q = search.toLowerCase();
    return articles.filter((article) => {
      const title = (article.title || "").toLowerCase();
      const excerpt = (article.excerpt || "").toLowerCase();
      const tagsText = Array.isArray(article.tags)
        ? article.tags.join(" ").toLowerCase()
        : "";
      const author = (article.author || "").toLowerCase();

      const inTitle = title.includes(q);
      const inExcerpt = excerpt.includes(q);
      const inTags = tagsText.includes(q);
      const inAuthor = author.includes(q);
      return inTitle || inExcerpt || inTags || inAuthor;
    });
  }, [articles, search]);

  return (
    <section className="w-full py-16 md:py-20 lg:py-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-16 flex flex-col items-center gap-16">
        {/* Header + Search */}
        <div className="w-full flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 max-w-3xl">
            <h2 className="font-sora text-xl md:text-3xl lg:text-4xl font-bold text-black text-center md:text-start">
              <span>Most recent </span>
              <span style={{ color: COLORS.brandRed }}>Articles &amp; Interviews</span>
            </h2>
            <p className="font-inter text-[12px] md:text-base text-[#505050] text-center md:text-start">
              Quick, digestible breakdowns of the most important research and trends in brain
              health and longevity.
            </p>
          </div>

          {/* Search bar */}
          <div className="w-full md:w-[600px] flex items-center justify-between gap-4 rounded-full bg-[#E2E8F0] px-6 py-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="What are you looking for ?"
              className="flex-1 bg-transparent outline-none font-inter text-sm md:text-base text-[#1E293B] placeholder-[#64748B]"
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

        {/* Cards */}
        <div className="w-full flex flex-col gap-12 items-center">
          <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
            {loading && !error && (
              <p className="col-span-full text-center text-sm text-[#64748B]">
                Loading articles...
              </p>
            )}

            {!loading && error && (
              <p className="col-span-full text-center text-sm text-red-600">{error}</p>
            )}

            {!loading && !error &&
              filtered.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}

            {!loading && !error && filtered.length === 0 && (
              <p className="col-span-full text-center text-sm text-[#64748B]">
                No articles match your search.
              </p>
            )}
          </div>

          <button
            className="w-full md:w-auto inline-flex items-center justify-center px-10 py-3 rounded-full text-sm md:text-base text-white"
            style={{ backgroundColor: COLORS.brandNavy }}
          >
            Discover all 200+
          </button>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
