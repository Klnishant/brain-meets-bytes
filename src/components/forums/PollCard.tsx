"use client";

import { getAuth } from "@/lib/getAuth";
import { Loader, SquarePen } from "lucide-react";
import React, { use, useEffect, useId, useState } from "react";
import toast from "react-hot-toast";
import EditPoll from "./EditPoll";
import { getUser } from "@/lib/getUser";
import { AppDispatch, RootState } from "@/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchPolls } from "@/Redux/slices/PollSlice";
import { current } from "@reduxjs/toolkit";

type Option = {
  votedUserIds: number[];
  OptionId: number;
  PollId: number;
  text: string;
  voteCount: number;
};

type Poll = {
  userId: number | null;
  PollId: number;
  title: string;
  description: string;
  totalVotes: number;
  options: Option[];
};

const PollCard = () => {
  //const [polls, setPolls] = useState<Poll[]>([]);
  const [isVoted, setIsVoted] = useState(false);
  const [visiblePolls, setVisiblePolls] = useState<Poll[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [pollVoteStatus, setPollVoteStatus] = useState<
    Record<
      number,
      { hasVoted: boolean; votedOptionId?: number; votes?: number }
    >
  >({});
  const [leading, setLoading] = useState(false);
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentEditPoll, setCurrentEditPoll] = useState<number>();
  const [isPollEditing, setIspollEditing] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      if (user) {
        setUser(user);
      }
      console.log(user);
    };
    fetchUser();
  }, []);

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

  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    if (!token) return;
    dispatch(fetchPolls({ token }));
  }, [token, userId]);

  const polls = useSelector((state: RootState) => state.polls.polls);

  useEffect(() => {
     if (visiblePolls.length === 0 && polls.length > 0) {
    setVisiblePolls([polls[0]]);
  }
  setVisiblePolls(polls);
  }, [polls, visiblePolls.length]);

  useEffect(() => {
    //BUILD hasVoted MAP
        const voteStatus: Record<
          number,
          { hasVoted: boolean; votedOptionId?: number; votes?: number }
        > = {};
        polls.forEach((poll: Poll) => {
          const votedOption = poll?.options?.find((option) =>
            option.votedUserIds?.includes(Number(userId))
          );

          console.log("votedOption", { votedOption });

          voteStatus[poll?.PollId] = {
            hasVoted: !!votedOption,
            votedOptionId: votedOption?.OptionId,
            votes: poll?.totalVotes,
          };
        });

        setPollVoteStatus(voteStatus);
        setLoading(false);
  }, [polls, userId]);

  useEffect(() => {
    console.log("voteStatus",pollVoteStatus);
    
  }, [polls, pollVoteStatus]);

  const handleAllPolls = () => {
    setVisiblePolls(polls);
  };

  const handleVote = async (OptionId: number, PollId: number) => {
    if (pollVoteStatus[Number(PollId)]?.hasVoted) {
    }
    try {
      const data = {
        OptionId: OptionId,
        PollId: PollId,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}polls/vote`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        toast.error("You have already voted on this poll");
      } else {
        setPollVoteStatus((prev) => ({
          ...prev,
          [PollId]: {
            hasVoted: true,
            votedOptionId: OptionId,
            votes: (prev[PollId]?.votes ?? 0) + 1,
          },
        }));
        toast.success("You have successfully voted on this poll");
      }
    } catch (error: any) {
      console.log(error?.message, "Failed to vote");
      toast.error("Failed to vote");
    }
  };

  const handleEdit = (key: boolean) => {
    setIsEditOpen(key);
  };

  useEffect(() => {
    console.log("current Poll",currentPoll);
    
  }, [currentPoll]);

  return (
    <div className="flex flex-col gap-2 justify-between h-full">
      <div

        className={` text-[#505050] ${isEditOpen && currentEditPoll === currentPoll?.PollId ? "block" : "hidden"} z-10 w-full absolute top-0 left-0`}
      >
        <div className="w-full flex justify-end">
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
              onClick={() => setIsEditOpen(false)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
        <EditPoll
          pollId={Number(currentPoll?.PollId)}
          pollQuestion={currentPoll?.title ?? ""}
          pollOptions={currentPoll?.options ?? []}
          isCreatePoll={handleEdit}
        />
      </div>
      {leading ? (
        <div className="flex items-center justify-center h-full w-full">
          <Loader size={24} className="animate-spin" color="black" />
        </div>
      ) : (
        <div>
          {visiblePolls?.map((poll) => (
            <div key={poll?.PollId} className="flex mt-2 flex-col gap-4">
              <div className="flex gap-2 items-center justify-between w-full">
                <h1 className="font-inter text-[#505050] font-semibold text-base md:text-lg leading-tight tracking-normal">
                  {poll?.title}
                </h1>
                  <button
                    onClick={() => {
                      setIsEditOpen(!isEditOpen);
                      setCurrentEditPoll(poll?.PollId);
                      setCurrentPoll(poll);
                    }}
                    className={`w-4 h-4 text-[#505050] ${userId == poll?.userId ? "block" : "hidden"}`}
                  >
                    <SquarePen
                      className={`w-4 h-4 text-[#505050] ${userId == poll?.userId ? "block" : "hidden"}`}
                    />
                  </button>
              </div>
              <div className="flex flex-col gap-2 items-start justify-center w-full">
                {poll?.options?.map((option) => (
                  <button
                    key={option?.OptionId}
                    {...(pollVoteStatus[Number(poll.PollId)]?.hasVoted
                      ? { pointerEvents: "none", opacity: 0.6 }
                      : { cursor: "pointer" })}
                    onClick={() => handleVote(option?.OptionId, option?.PollId)}
                    disabled={pollVoteStatus[Number(poll.PollId)]?.hasVoted}
                    className="flex w-full max-w-[477px] h-6 justify-between items-center rounded-[39px] px-4 py-2 opacity-100 border border-[#E2E8F0] bg-[#FAF9F8]"
                  >
                    <p className="font-inter font-normal text-[#505050] text-sm leading-tight tracking-normal">
                      {option?.text}
                    </p>
                    <p
                      className={`${pollVoteStatus[Number(poll.PollId)]?.hasVoted ? "block" : "hidden"} font-inter font-normal text-[#505050] text-sm leading-tight tracking-normal`}
                    >
                      {pollVoteStatus[Number(poll.PollId)]?.hasVoted &&
                      pollVoteStatus[Number(poll.PollId)]?.votedOptionId ===
                        option?.OptionId
                        ? pollVoteStatus[Number(poll.PollId)]?.votes
                        : option?.voteCount}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={handleAllPolls}
        className="font-inter font-semibold text-[#D62828] text-base leading-[30px] tracking-normal w-full text-start"
      >
        See All Polls
      </button>
    </div>
  );
};

export default PollCard;
