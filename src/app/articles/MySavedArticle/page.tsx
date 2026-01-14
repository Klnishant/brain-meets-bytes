"use client";

import { getAuth } from "@/lib/getAuth";
import Link from "next/link";
import { useEffect, useState } from "react";

type Author = {
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
};

type Article = {
  sanityArticleId: string;
  name: string;
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

type SavedArticle = {
  sanityArticleId: string;
  article: Article;
};

const MySavedArticle = () => {
  const [articles, setArticles] = useState<SavedArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

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

  const fetchSavedArticles = async () => {
    if (!token) return;
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}articles/getMySavedArticles`,
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
        console.log("saved articles", data);
        setArticles(data?.data || []);
      }
    } catch (error: any) {
      console.log(error?.message, "Failed to fetch saved articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedArticles();
  }, [token]);
  return (
    <section className="w-full bg-[#FAF9F8] pb-24 pt-10 md:pb-28 md:pt-16 min-h-screen">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-4 sm:px-6 lg:px-16">
        <h1 className="font-sora text-[34px] leading-[44px] text-[#1E293B] md:text-[48px] md:leading-[60px] lg:text-[56px] lg:leading-[71px]">
          My Saved Articles
        </h1>
        <p className="max-w-[875px] font-inter text-[16px] leading-[26px] text-[#505050] md:text-[18px] md:leading-[28px]">
          Here you can find your saved Articles
        </p>
        {loading ? (
          <div className="flex items-center justify-center h-screen text-2xl text-[#1E293B]">
            Loading...
          </div>
        ) : (
          <div className="flex flex-col gap-2 ">
            {/* Saved Articles */}
            {articles.map((article: SavedArticle) => (
              <div
                key={article?.sanityArticleId}
                className="flex flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5"
              >
                <div className="w-full flex flex-col gap-4">
                  <Link href={`/articles/${String(article?.article?.name)}`}>
                    <div>
                      <div className="flex flex-col gap-4">
                        <h1 className="font-sora font-semibold text-[#1E293B] text-[16px] md:text-2xl leading-6">
                          {article?.article?.name}
                        </h1>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MySavedArticle;
