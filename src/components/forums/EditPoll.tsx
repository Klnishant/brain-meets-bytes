"use client";

import { getAuth } from "@/lib/getAuth";
import { updatePoll } from "@/Redux/slices/PollSlice";
import { AppDispatch } from "@/Redux/store";
import { Loader } from "lucide-react";
import React, { useEffect, useImperativeHandle, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { set } from "sanity";

type Option = {
  votedUserIds: number[];
  OptionId: number;
  PollId: number;
  text: string;
  voteCount: number;
};
type EditPollProps = {
  pollId: number;
  pollQuestion: string;
  pollOptions: Option[];
  isCreatePoll: (key: boolean) => void;
};

const EditPoll: React.FC<EditPollProps> = ({
  isCreatePoll,
  pollId,
  pollQuestion,
  pollOptions,
}) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    setQuestion(pollQuestion);
    setOptions(pollOptions);
  }, [pollQuestion, pollOptions]);
  const updateOption = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = { ...updated[index], text: value };
    setOptions(updated);
  };

  const dispatch = useDispatch<AppDispatch>();

  const handleEditPoll = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    isCreatePoll(true);
    setError(null);
    if (!token) return;
    try {
      const data = {
        title: question,
        description: "",
        options: options,
      };

     dispatch(updatePoll(
      {
        PollId: pollId,
        title: question,
        description: "",
        options:  options.map(option => option.text),
        token,
      }
     ))
      toast.success("Poll Edited successfully!");
      isCreatePoll(false);
    } catch (error: any) {
      setError(error?.message);
      console.log(error?.message, "Failed to Edit poll");
      toast.error("Failed to edit poll");
    } finally {
        setLoading(false);
    }
  };
  return (
    <form
      method="post"
      noValidate
      onSubmit={handleEditPoll}
      className="flex w-full justify-center py-10"
    >
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
            <div key={index} className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E2E8F0] text-sm font-medium text-[#475569]">
                {index + 1}
              </span>

              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option?.text}
                onChange={(e) => updateOption(index, e.target.value)}
                className="flex-1 rounded-lg border border-[#E2E8F0] px-4 py-2 text-[#64748B] text-sm outline-none"
              />
            </div>
          ))}
        </div>

        {/* Error */}
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        {/* Actions */}
        <div className="flex justify-end">
        <button
          disabled={loading}
          type="submit"
          className="rounded-full bg-[#023047] px-6 py-2 text-sm font-semibold text-white"
        >
          {!loading ? "Edit Poll" : (<Loader size={14} className="animate-spin" />)}
        </button>
      </div>
      </div>
    </form>
  );
};

export default EditPoll;
