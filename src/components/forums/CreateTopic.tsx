"use client";

import { getAuth } from "@/lib/getAuth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { set } from "sanity";

export default function CreateTopic() {
  const [title, setTitle] = useState("");
  const [route, setRoute] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = {
      title: title,
      route: route,
      isActive: isActive,
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}topics`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to create topic");
      }

      const resData = await res.json();
      console.log(resData);
      toast.success("Topic created successfully!");
      setTitle("");
      setRoute("");
      setIsActive(true);
    } catch (error: any) {
      setError(error?.message);
      console.log(error?.message, "Failed to create topics");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form method="post" noValidate onSubmit={handleSubmit}>
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        {/* Header */}
        <h2 className="text-lg font-semibold text-[#023047]">Create Topic</h2>
        <p className="mt-1 text-sm text-gray-500">Add a new discussion topic</p>

        {/* Title */}
        <div className="mt-5">
          <label className="text-sm font-medium text-gray-700">Title</label>
          <input
            value={title}
            name="title"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Longevity Research"
            className="mt-1 w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-[#64748B] text-sm outline-none"
          />
        </div>

        {/* Route */}
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700">Route</label>
          <input
            value={route}
            name="route"
            onChange={(e) => setRoute(e.target.value)}
            placeholder="/topics/longevity"
            className="mt-1 w-full rounded-lg border border-[#E2E8F0] px-3 py-2 text-[#64748B] text-sm outline-none"
          />
          <p className="mt-1 text-xs text-gray-400">URL path for this topic</p>
        </div>

        {/* Is Active Toggle */}
        <div className="mt-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Active</p>
            <p className="text-xs text-gray-400">
              Enable or disable this topic
            </p>
          </div>

          <button
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              isActive ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                isActive ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Error */}
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

        {/* Action */}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-[#023047] px-4 py-2 text-sm font-medium text-white hover:bg-[#012737]"
        >
          {loading ? "Creating..." : "Create Topic"}
        </button>
      </div>
    </form>
  );
}
