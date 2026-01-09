"use client";

import { getAuth } from "@/lib/getAuth";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Option = {
  votedUserIds: number[];
  OptionId: number;
  PollId: number;
  text: string;
  voteCount: number;
};

type Poll = {
  PollId: number;
  title: string;
  description: string;
  totalVotes: number;
  options: Option[];
};

const PollCard = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isVoted, setIsVoted] = useState(false);
  const [visiblePolls, setVisiblePolls] = useState<Poll[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [pollVoteStatus, setPollVoteStatus] = useState<
    Record<number, { hasVoted: boolean; votedOptionId?: number }>
  >({});
  const [leading,setLoading] = useState(false);

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
  useEffect(() => {
    const fetchPolls = async () => {
      if (!token || !userId) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}polls`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch polls");
        }

        const data = await response.json();
        const polls = data?.data ?? [];
        console.log("polls",polls);
        

        setPolls(polls);
        setVisiblePolls(polls.length ? [polls[0]] : []);

        //BUILD hasVoted MAP
        const voteStatus: Record<
          number,
          { hasVoted: boolean; votedOptionId?: number }
        > = {};

       polls.forEach((poll: Poll) => {
  const votedOption = poll.options.find((option) =>
    option.votedUserIds?.includes(Number(userId))
  );

  console.log("votedOption",{votedOption});
  

  voteStatus[poll.PollId] = {
    hasVoted: !!votedOption,
    votedOptionId: votedOption?.OptionId,
  };
});

        setPollVoteStatus(voteStatus);
        setLoading(false);
        
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };

    fetchPolls();
  }, [token, userId]);

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
          },
        }));
        toast.success("You have successfully voted on this poll");
      }
    } catch (error: any) {
      console.log(error?.message, "Failed to vote");
      toast.error("Failed to vote");
    }
  };

  return (
    <div className="flex flex-col gap-2 justify-between h-full">
      {
        leading ? (
          <div className="flex items-center justify-center h-full w-full">
            <Loader size={24} className="animate-spin" color="black" />
          </div>
        ): (
          <div>
        {visiblePolls?.map((poll) => (
          <div key={poll?.PollId} className="flex mt-2 flex-col gap-4">
            <div>
              <h1 className="font-inter text-[#505050] font-semibold text-base md:text-lg leading-tight tracking-normal">
                {poll?.title}
              </h1>
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
                    {option?.voteCount}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
        )
      }
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
