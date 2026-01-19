"use client";

import Footer from "@/components/core/Footer";
import Navbar from "@/components/core/Navbar";
import { COLORS } from "@/lib/constants";
import { getAuth } from "@/lib/getAuth";
import { sanityClient } from "@/lib/sanityClient";
import { log } from "console";
import Link from "next/link";
import { use, useEffect, useRef, useState } from "react";
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
export type Episode = {
  _id: string;
  title?: string;
  date?: string;
  tags?: string[];
  kind?: "audio" | "video";
  duration?: number;
  description?: string;

  // from GROQ aliases
  imageUrl?: string;
  mediaUrl?: string;

  // slug is STRING because of `"slug": slug.current`
  slug?: string;

  podcast?: {
    _id: string;
    title?: string;
  };
};

type SavedPodcast = {
  sanityPodcastId: string;
  podcast: Podcast;
};

type PlayerCardProps = {
  episode: Episode;
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

const PlayerCard: React.FC<PlayerCardProps> = ({
  episode,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const podcast = episode?.podcast;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [error, setError] = useState("");
  const [commentData, setCommentData] = useState({ comment: "" });
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAuth = async () => {
      const auth = await getAuth();
      if (auth) {
        setToken(auth.token);
        setUserId(auth.userId);
      }
    };
    fetchAuth();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCommentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleComment = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!commentData.comment.trim()) return;

  //   onComment(commentData.comment);
  //   setCommentData({ comment: "" });
  // };

  const fallbackShare = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard");
  };

  const handleShare = async () => {
    const shareData = {
      title: episode?.title,
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

  // Load new episode when changed
  // useEffect(() => {
  //   if (!audioRef?.current) return;
  //   audioRef.current?.load();
  //   audioRef.current.currentTime = 0;
  //   setCurrentTime(0);
  //   audioRef.current?.play();
  // }, [episode, index]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef?.current?.duration || 0);
    }
  };

  const seek = (value: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full flex items-center justify-center">
        <div
          className=" rounded-3xl opacity-100 p-2 xl:p-8 gap-4 xl:gap-6 w-full flex flex-col md:flex-row items-start  justify-start md:justify-center bg-white
                          shadow-[0px_0px_4px_rgba(0,0,0,0.2)]
                          rounded-2xl 
"
        >
          <div className="w-full">
            <div
              className="w-full opacity-100
 flex  overflow-hidden"
            >
              {/* CARD */}
              <div
                className="
                          flex flex-col
                          justify-between w-full
                        "
              >
                {/* PROFILE + TEXT */}
                <div className="flex items-center gap-4">
                  <img
                    src={episode?.imageUrl || "/ki.png"}
                    alt="Speaker"
                    className="shrink-0 h-[70px] w-[70px] md:w-[90px] md:h-[90px] xl:w-[120px] xl:h-[115px] rounded-full object-cover border border-[#E2E8F0]"
                  />

                  <div className="flex flex-col justify-center items-start gap-3 md:max-w-[600px] lg:w-[900px] md:h-[211px]">
                    <h3 className="font-sora text-[14px] md:text-[24px] lg:text-[36px] font-semibold leading-8 text-gray-900">
                      {episode?.title ||
                        "The New Light Frontier: How Photonic Computing Could Transform Brain Health and the Future of Care"}
                    </h3>

                  </div>
                </div>
                {/* AUDIO PLAYER */}
                <div>
                  <audio
                    ref={audioRef}
                    onTimeUpdate={onTimeUpdate}
                    onLoadedMetadata={onLoadedMetadata}
                    onPlay={() => {
                      setIsPlaying(true);
                    }}
                    onPause={() => {
                      setIsPlaying(false);
                    }}
                  >
                    <source
                      src={episode?.mediaUrl || ""}
                    />
                  </audio>
                </div>
                <div className="w-full flex items-center justify-center gap-2">
                  {/* SLIDER WITH TIME */}
                <div className="w-full mt-5">
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={currentTime}
                    onChange={(e) => {
                      seek(Number(e.target.value));
                    }}
                    className="w-full accent-red-600"
                    defaultValue={40}
                  />

                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>
                      {Math.floor(currentTime / 3600)} :{" "}
                      {Math.floor((currentTime % 3600) / 60)} :{" "}
                      {Math.floor(currentTime % 60)}
                    </span>
                    <span>
                      {Math.floor(duration / 3600)} :{" "}
                      {Math.floor((duration % 3600) / 60)} :{" "}
                      {Math.floor(duration % 60)}
                    </span>
                  </div>
                </div>

                {/* PLAYER CONTROLS */}
                <div
                  className="flex items-center justify-between"
                  style={{ color: COLORS.brandRed }}
                >
                  {/* Repeat Icon */}
                  <button
                    className="
                    text-(--Muted-Text,#64748B)
                    hover:text-red-500
                    w-[22px]
                    h-[18px]
                    hidden items-center justify-center
                    opacity-100
                  "
                  >
                    <img
                      src="/suffle-icon.png"
                      alt=""
                      className="h-[16px] w-[16px]"
                    />
                  </button>

                  <div className="flex items-center gap-4 text-xl">
                    <button
                      className="
                    w-4 h-4
                    md:w-8 md:h-8 
                    bg-transparent
                    text-black
                    rounded-md 
                    hidden items-center justify-center
                    hover:bg-gray-100
                    transition
                  "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <rect x="3" y="4" width="2" height="16" rx="1"></rect>
                        <path d="M21 5v14L9 12l12-7z"></path>
                      </svg>
                    </button>

                    <button
                      onClick={togglePlay}
                      className="
                    w-5 h-5
                    md:w-30 md:h-10 
                    rounded-full 
                    flex items-center justify-center
                    text-white text-xs md:text-xl
                    bg-[linear-gradient(180deg,#700000_0%,#D62828_100%)]
                    hover:brightness-110
                  "
                    >
                      {isPlaying ? "❚❚" : "▶"}
                    </button>

                    <button
                      className="
                    w-4 h-4
                    md:w-8 md:h-8
                    bg-transparent 
                    text-black 
                    rounded-md 
                    hidden items-center justify-center
                    hover:bg-gray-100
                    transition
                  "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M5 5v14l12-7-12-7z" />
                        <rect x="19" y="4" width="2" height="16" rx="1" />
                      </svg>
                    </button>
                  </div>

                  {/* Heart Icon */}
                  <button className="hidden items-center justify-center w-4 h-4 md:w-8 md:h-8 text-(--Muted-Text,#64748B) hover:text-red-500">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 20.25C12 20.25 4.5 15 4.5 9.75C4.5 6.85 6.85 4.5 9.75 4.5C11.18 4.5 12.51 5.11 13.5 6.1C14.49 5.11 15.82 4.5 17.25 4.5C20.15 4.5 22.5 6.85 22.5 9.75C22.5 15 15 20.25 15 20.25H12Z"
                        stroke={COLORS.brandMutedText}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                </div>
                {/*BTNS*/}
                <div className="hidden">
                  <div className="flex items-center justify-between gap-1 lg:gap-6 py-5">
                    {/* Like */}
                    <button
                      className={`flex items-center gap-2 px-4 py-2 border border-[#2A4157] rounded-full text-[#64748B] hover:bg-[#1A2A38] transition`}
                    >
                      <img
                        src="/like.png"
                        alt=""
                        className="h-3 w-3 lg:h-6 lg:w-6"
                      />
                      <span className="text-[12px] md:text-[16px]">
                        
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
                        className="h-3 w-3 lg:h-5 lg:w-5"
                      />
                      <span className="text-[12px] md:text-[16px]">
                      </span>
                    </button>

                    <div className="flex-1" />

                    {/* Share */}
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 px-4 py-2 border border-[#2A4157] rounded-full text-[#64748B] hover:bg-[#1A2A38] transition"
                    >
                      <img
                        src="/share 1.png"
                        alt=""
                        className="h-3 w-3 lg:h-6 lg:w-6"
                      />
                      <span className="text-[12px] md:text-[16px]">Share</span>
                    </button>

                    {/* Save */}
                    <button
                      className={`flex items-center gap-2 px-4 py-2 border border-[#2A4157] rounded-full text-[#64748B] hover:bg-[#1A2A38]  transition`}
                    >
                      <img
                        src="/save.png"
                        alt=""
                        className="h-3 w-3 lg:h-5 lg:w-4"
                      />
                      <span className="text-[12px] md:text-[16px]">Save</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



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
   <main className="min-h-screen bg-[#FAF9F8] relative">
    <Navbar />
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
            {episodes.map((episode: Episode) => (
              <PlayerCard key={episode._id} episode={episode} />
            ))}
          </div>
        )}
      </div>
    </section>
    <Footer />
   </main>
  );
};

export default MySavedPodcast;