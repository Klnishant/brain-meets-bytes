"use client";
import Link from "next/link";
import { Bookmark, Home, MessageSquare, Share2, ThumbsUp } from "lucide-react";
import { COLORS } from "@/lib/constants";
import React, { use, useEffect, useMemo, useRef, useState } from "react";
import { sanityClient } from "@/lib/sanityClient";
import { podcast } from "../../../sanity/schemaTypes/podcast";
import { useParams } from "next/navigation";
import { set } from "sanity";

type Podcast = {
  _id: string;
  title?: string;
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
    image?: {
      asset: {
        url: string;
      };
    };
    description?: Text;
  };
  imageUrl?: string;
};

type EpisodeCardProps = {
  episode: Episode;
  podcast: Podcast;
  index: number;
  onSelect: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    episode: Episode,
    index: number
  ) => void;
};

type PlayerCardProps = {
  episode: Episode;
  index: number;
  onNext?: () => void;
  onPrev?: () => void;
  onShuffle?: () => void;
};

const PodcastCard = ({ podcast }: { podcast: Podcast }) => {
  const { title, author, date, imageUrl, tags = [], podcastCount } = podcast;

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
              <button className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#D62828] text-[14px] text-[#D62828] whitespace-nowrap">
                <span>Listen</span>
                <span className="inline-flex items-center justify-center w-4 h-4">
                  <span className="inline-block w-0 h-0 border-y-[6px] border-y-transparent border-l-10 border-l-[#D62828]" />
                </span>
              </button>

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

const PlayerCard: React.FC<PlayerCardProps> = ({
  episode,
  index,
  onNext,
  onPrev,
  onShuffle,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const podcast = episode?.podcast;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load new episode when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [episode]);

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
      setDuration(audioRef.current.duration);
    }
  };

  const seek = (value: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  return (
    <div>
      <div className="w-full flex items-center mt-4 justify-center">
        <div
          className=" md:h-[496px] rounded-3xl opacity-100 p-4 md:gap-8 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-start md:justify-center bg-white
                          shadow-[0px_0px_4px_rgba(0,0,0,0.2)]
                          rounded-2xl
"
        >
          <div className="flex md:flex-col gap-4 md:gap-9 items-center">
            <div className="w-[80px] h-[80px] md:w-[308px] md:h-[319px] border-4 rounded-2xl">
              <img
                src="/ki.png"
                alt=""
                className=" w-[80px] h-[80px] md:w-[308px] md:h-[319px] rounded-3xl object-cover"
              />
            </div>
            <div className=" flex flex-col gap-1">
              <h1
                className="font-sora font-bold text-[20px] md:text-[36px] text-[#1E293B] leading-[100%] tracking-[0%]
"
              >
                {podcast?.author || "Unknown Author"}
              </h1>
              <p
                className="font-inter font-normal text-[10px] md:text-[18px] leading-7 text-[#505050] tracking-[0%]
"
              >
                {<>{podcast?.description || "Podcast author"}</>}
              </p>
            </div>
          </div>
          <div className="h-[2px] w-full md:h-[432px] md:w-0.5 bg-[#E2E8F0] mt-2 md:mt-0"></div>
          <div>
            <div
              className="w-full md:h-[432px] justify-end opacity-100
 flex  overflow-hidden"
            >
              {/* CARD */}
              <div
                className="
                          flex flex-col
                          md:p-6
                        "
              >
                {/* PROFILE + TEXT */}
                <div className="flex items-center gap-4 mt-2">
                  <img
                    src="/ki.png"
                    alt="Speaker"
                    className="h-[70px] w-[70px] md:w-[110px] md:h-[110px] rounded-full object-cover border border-[#E2E8F0]"
                  />

                  <div className="flex flex-col justify-center items-start gap-3 md:w-[930px] md:h-[211px]">
                    <span
                      className="font-sora font-bold text-[12px] md:text-[24px] text-[#D62828] leading-[100%] tracking-[0%]
"
                    >
                      Episode {index}
                    </span>
                    <h3 className="font-sora text-[14px] md:text-[36px] font-semibold leading-8 text-gray-900">
                      {episode?.title ||
                        "The New Light Frontier: How Photonic Computing Could Transform Brain Health and the Future of Care"}
                    </h3>

                    <p
                      className="font-inter text-xs md:text-sm"
                      style={{ color: COLORS.brandMutedText }}
                    >
                      {podcast?.author || "Ki Siadatan"}
                    </p>
                  </div>
                </div>
                {/* AUDIO PLAYER */}
                <div>
                  <audio
                    ref={audioRef}
                    onTimeUpdate={onTimeUpdate}
                    onLoadedMetadata={onLoadedMetadata}
                  >
                    <source src={episode?.media || ""} type="video/mp4" />
                  </audio>
                </div>
                {/* SLIDER WITH TIME */}
                <div className="w-full mt-3">
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
                    <span>{currentTime}</span>
                    <span>{episode?.duration}</span>
                  </div>
                </div>

                {/* PLAYER CONTROLS */}
                <div
                  className="flex items-center justify-between w-full mt-3"
                  style={{ color: COLORS.brandRed }}
                >
                  {/* Repeat Icon */}
                  <button
                    className="
                    text-(--Muted-Text,#64748B)
                    hover:text-red-500
                    w-[22px]
                    h-[18px]
                    flex items-center justify-center
                    opacity-100
                  "
                    onClick={() => {
                      onShuffle && onShuffle();
                    }}
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
                    flex items-center justify-center
                    hover:bg-gray-100
                    transition
                  "
                      onClick={() => {
                        onPrev && onPrev();
                      }}
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
                    md:w-10 md:h-10 
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
                    flex items-center justify-center
                    transition
                  "
                      onClick={() => {
                        onNext && onNext();
                      }}
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
                  <button className="flex items-center justify-center w-4 h-4 md:w-8 md:h-8 text-(--Muted-Text,#64748B) hover:text-red-500">
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
                {/*BTNS*/}
                <div>
                  <div className="flex items-center justify-between gap-3 md:gap-6 py-5">
                    {/* Like */}
                    <button className="flex items-center gap-2 px-4 py-2 border border-[#2A4157] rounded-full text-[#64748B] hover:bg-[#1A2A38] transition">
                      <ThumbsUp className="h-3 w-3 md:h-6 md:w-6" />
                      <span className="text-[12px] md:text-[16px]">6</span>
                    </button>

                    {/* Comments */}
                    <button className="flex items-center gap-2 px-4 py-2 border border-[#2A4157] rounded-full text-[#64748B] hover:bg-[#1A2A38] transition">
                      <img
                        src="/comment.png"
                        alt=""
                        className="h-3 w-3 md:h-6 md:w-6"
                      />
                      <span className="text-[12px] md:text-[16px]">245</span>
                    </button>

                    <div className="flex-1" />

                    {/* Share */}
                    <button className="flex items-center gap-2 px-4 py-2 border border-[#2A4157] rounded-full text-[#64748B] hover:bg-[#1A2A38] transition">
                      <Share2 className="h-3 w-3 md:h-6 md:w-6" />
                      <span className="text-[12px] md:text-[16px]">Share</span>
                    </button>

                    {/* Save */}
                    <button className="flex items-center gap-2 px-4 py-2 border border-[#2A4157] rounded-full text-[#64748B] hover:bg-[#1A2A38] transition">
                      <img
                        src="/save.png"
                        alt=""
                        className="h-3 w-3 md:h-6 md:w-6"
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

const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  podcast,
  index,
  onSelect,
}) => {
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    onSelect(event, episode, index);
  };
  return (
    <div className="w-full">
      <div className="md:p-4 sm:w-[400px] md:w-full">
        <div className="w-full">
          <div
            className="
                          flex flex-col
                          p-3
                          md:p-6
                          bg-white
                          border border-[#E2E8F0]
                          shadow-[0px_0px_4px_rgba(0,0,0,0.2)]
                          rounded-2xl
                          md:w-full
                        "
          >
            {/* PROFILE + TEXT */}
            <div className="md:flex items-center gap-4 mt-2 justify-between">
              <div className="flex items-center gap-4 md:justify-between">
                <img
                  src={episode?.imageUrl || "/ki.png"}
                  alt="Speaker"
                  className="w-12 h-12 md:w-20 md:h-20 rounded-full object-cover border border-[#E2E8F0]"
                />

                <div className="flex flex-col justify-start items-start gap-1 md:w-[947px] md:h-[70px]">
                  <span
                    className="font-sora font-bold text-[10px] md:text-[16px] text-[#D62828] leading-[100%] tracking-[0%]
"
                  >
                    Episode {index || "1"}
                  </span>
                  <div>
                    <h3 className="font-sora text-[8px] md:text-[18px] font-semibold leading-8 text-gray-900">
                      {episode?.title ||
                        "The New Light Frontier: How Photonic Computing Could Transform Brain Health and the Future of Care"}
                    </h3>
                  </div>

                  <p
                    className="font-inter text-xs md:text-sm"
                    style={{ color: COLORS.brandMutedText }}
                  >
                    {podcast?.author || "Ki Siadatan"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 text-xl">
                <button
                  className="
                    px-8 
                    rounded-full 
                    flex items-center justify-between gap-2.5
                    text-white text-xl
                    bg-[linear-gradient(180deg,#700000_0%,#D62828_100%)]
                    hover:brightness-110
                    w-full md:w-auto
                  "
                  onClick={handleClick}
                >
                  <span>Play</span>
                  <span>▶</span>
                </button>
              </div>
            </div>

            <div className="w-full h-0.5 border border-[#E2E8F0] mt-5"></div>

            {/*BTNS*/}
            <div className="">
              <div className="flex items-center gap-3 md:gap-6 py-5">
                {/* Like */}
                <button className="flex items-center gap-2 px-4 py-2 border border-[#2A4157] rounded-full text-[#64748B] hover:bg-[#1A2A38] transition">
                  <ThumbsUp className="h-3 w-3 md:h-3.5 md:w-3.5" />
                  <span className="text-[12px] md:text-[14px]">6</span>
                </button>

                {/* Comments */}
                <button className="flex items-center gap-2 px-4 py-2 border border-[#2A4157] rounded-full text-[#64748B] hover:bg-[#1A2A38] transition">
                  <img
                    src="/comment.png"
                    alt=""
                    className="h-3 w-3 md:h-3.5 md:w-3.5"
                  />
                  <span className="text-[12px] md:text-[14px]">245</span>
                </button>

                {/* Share */}
                <button className="flex items-center gap-2 px-4 py-2 border border-[#2A4157] rounded-full text-[#64748B] hover:bg-[#1A2A38] transition">
                  <Share2 className="h-3 w-3 md:h-3.5 md:w-3.5" />
                  <span className="text-[12px] md:text-[14px]">Share</span>
                </button>

                {/* Save */}
                <button className="flex items-center gap-2 px-4 py-2 border border-[#2A4157] rounded-full text-[#64748B] hover:bg-[#1A2A38] transition">
                      <img
                        src="/save.png"
                        alt=""
                        className="h-3 w-3 md:h-3.5 md:w-3.5"
                      />
                      <span className="text-[12px] md:text-[14px]">Save</span>
                    </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const PlayListHeroPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [episode, setEpisode] = useState<Episode[]>([]);
  const [episodeNumber, setEpisodeNumber] = useState<number>(1);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);

  const params = useParams<{ title: string }>();
  const title = params.title;

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/related-episodes/${title}`);
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
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/episodes/${title}`);
        if (!res.ok) {
          throw new Error("Failed to load episode");
        }
        const data = (await res.json()) as Episode[];
        if (!mounted) return;
        setEpisode(Array.isArray(data) ? data : []);
        setCurrentEpisode(data[0] || null);
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

  const handleNext = () => {
    setEpisodeNumber((prev) => (prev < episode.length ? prev + 1 : 1));
    setCurrentEpisode(episode[episodeNumber - 1]);
  };

  const handlePrev = () => {
    setEpisodeNumber((prev) => (prev > 1 ? prev - 1 : episode.length - 1));
    setCurrentEpisode(episode[episodeNumber - 1]);
  };

  const handleShuffle = () => {
    setEpisodeNumber(Math.floor(Math.random() * episode.length) + 1);
  };

  return (
    <div className="w-full  bg-[#FAF9F8] px-8 md:px-16">
      {/* Breadcrumb */}
      <div className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3 text-sm text-[#1E293B]">
        {/* Home Icon */}
        <Link
          href="/"
          className="flex items-center justify-center w-8 h-8 text-[#1E293B]"
        >
          <img src="/home.png" alt="" className="h-6 w-6" />
        </Link>

        {/* Podcasts */}
        <span className="flex items-center gap-2">
          <span className="font-medium cursor-pointer md:text-[20px] ">
            Podcasts
          </span>
          <h1 className=" md:text-xl">›</h1>
        </span>

        {/* Current Page Title */}
        <span className="flex items-center gap-2">
          <span className="font-medium cursor-pointer md:text-[20px]">
            {title || "Podcast Title"}
          </span>
          <h1 className="md:text-xl">›</h1>
        </span>

        {/* All Episodes */}
        <Link href="/podcasts" className="md:text-[20px]">
          All Episodes
        </Link>
      </div>

      {/* player card */}
      {currentEpisode && (
        <PlayerCard
          episode={currentEpisode}
          index={episodeNumber}
          onNext={handleNext}
          onPrev={handlePrev}
          onShuffle={handleShuffle}
        />
      )}

      {/* Episodes */}
      {!loading && !error && (
        <div >
          <div
            className="font-sora h-11 p-4 md:py-16 font-semibold text-[20px] md:text-[36px] leading-[100%] tracking-[0%] 
"
          >
            <h1 className="text-[#1E293B]">All Episodes</h1>
          </div>
          {episode.map((ep, index) => (
            <EpisodeCard
              key={ep._id}
              episode={ep}
              podcast={podcasts[0]}
              index={index + 1}
              onSelect={(e, ep, ind) => {
                setCurrentEpisode(ep);
                setEpisodeNumber(ind + 1);
              }}
            />
          ))}
          {episode.length === 0 && (
            <p className="col-span-full text-center text-sm text-[#64748B]">
              No Episodes Are Available.
            </p>
          )}
        </div>
      )}

      {/* Related Podcasts */}
      <div>
        <section className="w-full py-16 md:py-20 lg:py-[100px]">
          <div className="mx-auto px-4 sm:px-6 lg:px-16 flex flex-col items-center gap-16">
            <div className="flex flex-col items-center gap-8 w-full text-center">
              <div className="flex flex-col gap-3">
                <h2 className="font-sora text-2xl md:text-3xl text-[#000000] lg:text-4xl font-bold">
                  <span>Related Podcasts</span>
                </h2>
                <p className="font-inter text-sm md:text-base text-[#505050]">
                  Nam vulputate faucibus urna non mollis. Vivamus a vulputate
                  turpis. Aenean efficitur aliquam dui a elementum.
                </p>
              </div>
            </div>

            <div className="w-full">
              {loading && (
                <p className="text-center text-sm text-[#64748B]">
                  Loading featured podcasts...
                </p>
              )}
              {error && !loading && (
                <div>
                  <p className="text-center text-sm text-red-600">{error}</p>
                </div>
              )}

              {!loading && !error && (
                <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {podcasts.map((podcast) => (
                    <PodcastCard key={podcast._id} podcast={podcast} />
                  ))}
                  {podcasts.length === 0 && (
                    <p className="col-span-full text-center text-sm text-[#64748B]">
                      No podcasts match your search.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <button
                className="inline-flex items-center justify-center px-8 md:px-10 py-3 rounded-full text-sm md:text-base text-white"
                style={{ backgroundColor: COLORS.brandNavy }}
              >
                Discover all 200+
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PlayListHeroPage;
