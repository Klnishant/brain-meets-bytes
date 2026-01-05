'use client';

import React, { useState } from 'react'

type CreatePollProps = {
  handleClick: () => void
}

const CreatePoll: React.FC<CreatePollProps> = ({handleClick}) => {
    const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);

  const updateOption = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };
  return (
    <div className="w-full max-w-xl rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
      {/* Header */}
      <h2 className="mb-4 text-xl font-semibold text-[#023047]">
        Create Poll
      </h2>

      {/* Question */}
      <div className="mb-5">
        <label className="mb-1 block text-sm font-medium text-[#334155]">
          Question
        </label>
        <input
          type="text"
          placeholder="Ask your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2 text-[#64748B] text-sm outline-none"
        />
      </div>

      {/* Options */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#334155]">
          Options
        </label>

        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-center gap-3"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E2E8F0] text-sm font-medium text-[#475569]">
              {index + 1}
            </span>

            <input
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) =>
                updateOption(index, e.target.value)
              }
              className="flex-1 rounded-lg border border-[#E2E8F0] px-4 py-2 text-[#64748B] text-sm outline-none"
            />
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-end gap-3">
        <button 
        onClick={handleClick}
        className="rounded-lg border border-[#CBD5E1] px-4 py-2 text-sm text-[#475569] hover:bg-gray-50">
          Cancel
        </button>

        <button className="rounded-lg bg-[#023047] px-5 py-2 text-sm font-medium text-white ">
          Create Poll
        </button>
      </div>
    </div>
  )
}

export default CreatePoll