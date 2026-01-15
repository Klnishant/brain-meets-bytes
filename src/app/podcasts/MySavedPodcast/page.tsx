"use client";

import { getAuth } from "@/lib/getAuth";
import { sanityClient } from "@/lib/sanityClient";
import { log } from "console";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { set } from "sanity";

type Podcast = {
  sanityPodcastId: string;
  name?: string;
  author?: string;
  date?: string;
  imageUrl?: string;
  tags?: string[];
  podcastCount?: number;
};
type Episode = {
  _id: string;
  title?: string;
  date?: string;
  tags?: string[];
  kind?: string;
  duration?: number;
  description?: string;
  media: string;
  slug?: {
    current: string;
  };
  podcast: {
    title?: string;
    author?: string;
    imageUrl?: string;
    description?: Text;
    authorImageUrl?: string;
  };
  imageUrl?: string;
  mimeType?: string;
};

type SavedPodcast = {
  sanityPodcastId: string;
  podcast: Podcast;
};

const query = `
*[_type == "episode" && _id in $episodeIds] | order(date desc) {
  _id,
  title,
  "slug": slug.current,
  kind,
  date,
  duration,
  tags,
  description,
  "imageUrl": image.asset->url,
  "mediaUrl": mediaFile.asset->url,
  podcast->{
    _id,
    title
  }
}
`;



const MySavedPodcast = () => {
  const [podcasts, setPodcasts] = useState<SavedPodcast[]>([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [podcastId, setPodcastId] = useState<string[] | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);

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

  const fetchSavedPodcats = async () => {
    if (!token) return;
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}podcasts/getMySavedPodcasts`,
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
        setPodcasts(data?.data || []);
        const savedPodcastsIds = data?.data?.map((item: SavedPodcast) => item.sanityPodcastId);
        setPodcastId(savedPodcastsIds);
      }
    } catch (error: any) {
      console.log(error?.message, "Failed to fetch saved articles");
    } finally {
      setLoading(false);
    }
  };

  const fetchEpisodesFromSanity = async (episodeIds: string[]) => {
  if (!episodeIds || episodeIds.length === 0) return [];

  const data = await sanityClient.fetch(query, {
    episodeIds,
  });

  setEpisodes(data);
};

useEffect(() => {
  if (podcastId) {
    fetchEpisodesFromSanity(podcastId);
  }
}, [podcastId]);

useEffect(() => {
    console.log("Episodes:", episodes);
  }, [episodes]);


  useEffect(() => {
    fetchSavedPodcats();
  }, [token]);
  return (
    <section className="w-full bg-[#FAF9F8] pb-24 pt-10 md:pb-28 md:pt-16 min-h-screen">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-4 sm:px-6 lg:px-16">
        <h1 className="font-sora text-[34px] leading-[44px] text-[#1E293B] md:text-[48px] md:leading-[60px] lg:text-[56px] lg:leading-[71px]">
          My Saved Podcasts
        </h1>
        <p className="max-w-[875px] font-inter text-[16px] leading-[26px] text-[#505050] md:text-[18px] md:leading-[28px]">
          Here you can find your saved podcasts for easy access and listening.
        </p>
        {loading ? (
          <div className="flex items-center justify-center h-screen text-2xl text-[#1E293B]">
            Loading...
          </div>
        ) : (
          <div className="flex flex-col gap-2 ">
            {/* Saved Articles */}
            {episodes.map((podcast: Episode) => (
              <div
                key={podcast?._id}
                className="flex flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5"
              >
                <div className="w-full flex flex-col gap-4">
                  <Link href={`/podcasts/${String(podcast?.title)}`}>
                    <div>
                      <div className="flex flex-col gap-4">
                        <h1 className="font-sora font-semibold text-[#1E293B] text-[16px] md:text-2xl leading-6">
                          {podcast?.title}
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

export default MySavedPodcast;