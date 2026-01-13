"use client";

import { getAuth } from "@/lib/getAuth";
import React, { useEffect, useImperativeHandle, useState } from "react";
import toast from "react-hot-toast";
import { set } from "sanity";

export type CreatePollFormRef = {
  submit: (e: React.FormEvent<HTMLFormElement>) => void;
}
type CreatePollProps = {
  handleClick: () => void;
  isCreatePoll: (key: boolean) => void;
};

const CreatePoll = React.forwardRef<CreatePollFormRef, CreatePollProps>(
  ({ handleClick,isCreatePoll }, ref) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

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
  const updateOption = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleCreatePoll = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    isCreatePoll(true);
    setError(null);
    try {
      const data = {
        title: question,
        description: "",
        options: options,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}polls`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(res);

      if (!res.ok) {
        throw new Error("Failed to create poll");
      }
      toast.success("Poll created successfully!");
      handleClick();
    } catch (error: any) {
      setError(error?.message);
      console.log(error?.message, "Failed to create poll");
      toast.error("Failed to create poll");
    } finally {
      isCreatePoll(false);
    }
  };

  useImperativeHandle(ref, () => ({
        submit: handleCreatePoll,
      }));
  return (
    <form method="post" noValidate onSubmit={handleCreatePoll}>
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
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                className="flex-1 rounded-lg border border-[#E2E8F0] px-4 py-2 text-[#64748B] text-sm outline-none"
              />
            </div>
          ))}
        </div>

        {/* Error */}
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          
        </div>
      </div>
    </form>
  );
}
);

export default CreatePoll;
