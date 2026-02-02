"use client";

import { COLORS } from "@/lib/constants";
import { useEffect, useRef, useState } from "react";

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
    imageUrl?: string;
    description?: Text;
    authorImageUrl?: string;
  };
  imageUrl?: string;
  mimeType?: string;
};

type FALL_BACK_CONTENT = {
  title: string;
  author: string;
  imageUrl: string;
  duration: number;
};

const FALL_BACK_CONTENT: FALL_BACK_CONTENT = {
  title:
    "Neurotrack’s Bet on Digital Brain Health Meets a Market Ready for Change",
  author: "Ki Siadatan",
  imageUrl: "./ki.png",
  duration: 40,
};

const AudioCard = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [episode, setEpisode] = useState<Episode | null>(null);

  useEffect(() => {
    const fetchEpisode = async () => {
      const res = await fetch("/api/home-audio");
      const data = await res.json();
      setEpisode(data);
    };
    fetchEpisode();
  }, []);

  useEffect(() => {
    if (!audioRef?.current) return;
    audioRef?.current?.load();
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
  }, [episode]);

  const togglePlay = () => {
    if (!audioRef?.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  const onTimeUpdate = () => {
    if (audioRef?.current) {
      setCurrentTime(audioRef?.current?.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef?.current) {
      setDuration(audioRef?.current?.duration || 0);
    }
  };

  const seek = (value: number) => {
    if (!audioRef?.current) return;
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  return (
    <div className="relative w-full h-auto flex justify-end mt-10 overflow-hidden">
      {/* Background Wave — decorative */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 flex justify-center"
      >
        <div
          style={{
            width: "651px md:1404px",
            height: "393px md:850px",
            opacity: 0.8,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            transform: "matrix(-0.99, 0.16, 0.16, 0.99, 0, 0)",
          }}
        ></div>
      </div>

      {/* CARD */}
      <div
        className="
          w-full
          md:w-[480px]
          md:h-[320px]
          flex flex-col
          p-6
          bg-white
          border border-[#E2E8F0]
          shadow-[0px_0px_4px_rgba(0,0,0,0.2)]
          rounded-2xl
        "
      >
        {/* Now Playing */}
        <p
          className="font-inter text-sm flex items-center gap-2"
          style={{ color: COLORS.brandMutedText }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: COLORS.brandRed }}
          ></span>
          Now playing
        </p>

        {/* PROFILE + TEXT */}
        <div className="flex items-center gap-4 mt-2">
          <img
            src={episode?.imageUrl ?? FALL_BACK_CONTENT.imageUrl}
            alt="Speaker"
            className="w-[70px] h-[70px] md:w-[110px] md:h-[110px] rounded-full object-cover border border-[#E2E8F0]"
          />

          <div className="flex flex-col justify-center items-start gap-2 w-[260px]">
            <h3 className="font-sora text-[16px] md:text-[18px] font-semibold leading-[24px] text-gray-900">
              {episode?.title ?? FALL_BACK_CONTENT.title}
            </h3>

            <p
              className="font-inter text-xs md:text-sm"
              style={{ color: COLORS.brandMutedText }}
            >
              {episode?.podcast?.author ?? FALL_BACK_CONTENT.author}
            </p>
          </div>
        </div>
        {/* Audio Player */}
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
            <source src={episode?.media || ""} type={episode?.mimeType} />
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

          <div className="flex justify-between text-[10px] md:text-xs text-gray-500 mt-1">
            <span>
              {Math.floor(currentTime / 3600)} :{" "}
              {Math.floor((currentTime % 3600) / 60)} :{" "}
              {Math.floor(currentTime % 60)}
            </span>
            {(duration && (
              <span>
                {Math.floor(duration / 3600)} :{" "}
                {Math.floor((duration % 3600) / 60)} :{" "}
                {Math.floor(duration % 60)}
              </span>
            )) ?? <span>{FALL_BACK_CONTENT.duration}</span>}
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
            style={{
              position: "relative",
              top: "5.67px",
              left: "1.67px",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 3 21 3 21 8"></polyline>
              <line x1="4" y1="20" x2="21" y2="3"></line>
              <polyline points="21 16 21 21 16 21"></polyline>
              <line x1="15" y1="15" x2="21" y2="21"></line>
              <line x1="4" y1="4" x2="9" y2="9"></line>
            </svg>
          </button>

          <div className="flex items-center gap-4 text-xl">
            <button
              className="
    w-8 h-8 
    bg-transparent
    text-black
    rounded-md 
    flex items-center justify-center
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
    w-10 h-10 
    rounded-full 
    flex items-center justify-center
    text-white text-xl
    bg-[linear-gradient(180deg,#700000_0%,#D62828_100%)]
    hover:brightness-110
  "
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>

            <button
              className="
    w-10 h-10 
    bg-transparent 
    text-black 
    rounded-md 
    flex items-center justify-center
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
          <button className="flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
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
    </div>
  );
};

export default AudioCard;
