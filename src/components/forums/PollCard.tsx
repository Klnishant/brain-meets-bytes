"use client";

import React, { useState } from "react";

type Option = {
  option: string;
  votes: number;
};

type Poll = {
  question: string;
  options: Option[];
};

const PollCard = () => {
  const [polls, setPolls] = useState<Poll[]>([
    {
    question: "What is your favorite color?",
    options: [
      { option: "Red", votes: 0 },
      { option: "Blue", votes: 0 },
      { option: "Green", votes: 0 },
      { option: "Violet", votes: 0 },
    ],
  },
  ]);
  const [isVoted, setIsVoted] = useState(false);

  const handleVote = (index: number) => {
    const updatedPolls = [...polls];
    updatedPolls[0].options[index].votes += 1;
    setPolls(updatedPolls);
    setIsVoted(true);
  };

  return (
    <div className="flex flex-col gap-2 justify-between h-full">
      <div>
        {polls.map((poll,i) => (
        <div 
        key={i}
        className="flex flex-col gap-4">
          <div>
            <h1 className="font-inter text-[#505050] font-semibold text-base md:text-lg leading-tight tracking-normal">
                {poll.question}
            </h1>
          </div>
          <div className="flex flex-col gap-2 items-start justify-center w-full">
            {poll.options.map((option,i) => (
              <button
              key={i}
              {...(isVoted ? { pointerEvents: 'none', opacity: 0.6 } : { cursor: 'pointer' })}
               onClick={() => handleVote(poll.options.indexOf(option))}
               disabled={isVoted}
               className="flex w-full max-w-[477px] h-6 justify-between items-center rounded-[39px] px-4 py-2 opacity-100 border border-[#E2E8F0] bg-[#FAF9F8]"
>
                <p className="font-inter font-normal text-[#505050] text-sm leading-tight tracking-normal">
                    {option.option}
                </p>
                <p className={`${isVoted? "block" : "hidden"} font-inter font-normal text-[#505050] text-sm leading-tight tracking-normal`}>
                    {option.votes}
                </p>
              </button>
            ))}
          </div>
        </div>
      ))}
      </div>
      <button
     
     className="font-inter font-semibold text-[#D62828] text-base leading-[30px] tracking-normal w-full text-start">
                  See All Polls
                </button>
    </div>
  );
};

export default PollCard;
