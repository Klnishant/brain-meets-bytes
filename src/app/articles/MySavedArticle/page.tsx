"use client";

import Footer from "@/components/core/Footer";
import Navbar from "@/components/core/Navbar";
import { getAuth } from "@/lib/getAuth";
import { sanityClient } from "@/lib/sanityClient";
import { log } from "console";
import Link from "next/link";
import { useEffect, useState } from "react";
import { set } from "sanity";

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
  const { title, authors, date, imageUrl, tags = [], excerpt, slug } = article;

  console.log("article in card:", article);

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-[#FAF9F8]">
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
          <span className="inline-flex items-center rounded-full bg-[#E2E8F0] px-3 py-1 text-[11px] text-[#64748B]">
            {authors && authors.map((author) => author.name).join(", ")}
          </span>
          <span className="text-[11px] text-[#505050]">
            {formatDate(date || "")}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-sora text-[20px] font-semibold leading-[30px] text-[#1E293B]">
          {title}
        </h3>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 text-[11px]">
            {tags.map((tag) => (
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
            <Link
              href={`/articles/${slug}`}
              className="w-full md:w-auto justify-center inline-flex items-center gap-2 rounded-[36px] border border-[#D62828] md:px-6 py-2 text-[14px] font-normal text-[#D62828]"
            >
              Read More
            </Link>
          ) : (
            <button className=" w-full md:w-auto inline-flex items-center gap-2 rounded-[36px] border border-[#D62828] px-6 py-2 text-[14px] font-normal text-[#D62828]">
              Read More
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

const MySavedArticle = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [articleIds, setArticleIds] = useState<string[]>([]);

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

  const query = `
*[_type == "article" && _id in $articleIds] {
  _id,
  title,
  authors[] {
    name,
    role,
  },
  date,
  "imageUrl": image.asset->url,
  tags,
  excerpt,
  "slug": slug.current
}`;

  const fetchSavedArticles = async () => {
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}articles/getMySavedArticles`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      console.log(res);

      if (res.ok) {
        const data = await res.json();
        console.log("saved articles", data);
        const articleIds = data?.data.map(
          (article: any) => article.sanityArticleId,
        );
        setArticleIds(articleIds);
        console.log(articleIds);
      }
    } catch (error: any) {
      console.log(error?.message, "Failed to fetch saved articles");
    } finally {
    }
  };

  const fetchArticlesFromSanity = async (ids: string[]) => {
    setLoading(true);
    console.log("ids:", ids);

    try {
      const data = await sanityClient.fetch(query, { articleIds: ids });
      setArticles(data);
      console.log("fetched articles from sanity", data);
      console.log("articles state:", articles);
    } catch (error: any) {
      console.log(error?.message, "Failed to fetch saved articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedArticles();
  }, [token]);

  useEffect(() => {
    if (articleIds.length > 0) {
      fetchArticlesFromSanity(articleIds);
    }
  }, [token, articleIds]);
  return (
    <main className="min-h-screen bg-[#FAF9F8] relative">
      <Navbar />
      <section className="w-full bg-[#FAF9F8] pb-24 pt-10 md:pb-28 md:pt-16 min-h-screen">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-4 sm:px-6 lg:px-16">
          <h1 className="font-sora text-[34px] leading-[44px] text-[#1E293B] md:text-[48px] md:leading-[60px] lg:text-[56px] lg:leading-[71px]">
            My Saved Articles
          </h1>
          <p className="max-w-[875px] font-inter text-[16px] leading-[26px] text-[#505050] md:text-[18px] md:leading-[28px]">
            Here you can find your saved Articles
          </p>
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 ">
              {/* Saved Articles */}
              {articles.length === 0 ? (
                <h2 className="w-full flex items-center justify-center text-[#1E293B]">
                  No saved articles found.
                </h2>
              ) : (
                articles.map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default MySavedArticle;
