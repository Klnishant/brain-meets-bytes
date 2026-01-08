"use client";

import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import SelectCategoryCard from "./SelectCategoryCard";
import { form } from "sanity/structure";
import { set } from "sanity";
import { getAuth } from "@/lib/getAuth";
import toast from "react-hot-toast";

export type CreatThreadFormRef = {
  submit: (e: React.FormEvent<HTMLFormElement>) => void;
};

type CreateThreadProps = {
  images: File[];
  videos: File[];
  isOpen: ()=>void;
  isCreateThread: (key: boolean) => void;
  onSuccess: () => void;
};
type Category = {
  _id: string;
  CategoryId: number;
  title: string;
  route: string;
  color: string;
  description: string;
  threadCount: number;
  imageUrl: string;
};

const CreateThread = React.forwardRef<CreatThreadFormRef, CreateThreadProps>(
  ({ images, videos, isOpen, isCreateThread, onSuccess }, ref) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<Category[]>(
      []
    );
    const [query, setQuery] = useState("");
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
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

    const inputRef = useRef<HTMLInputElement>(null);

    const handleCategoryChange = (categories: Category[]) => {
      setSelectedCategories(categories);
    };

    const filesToBase64 = async (files: File[]): Promise<string[]> => {
      const base64Images: string[] = [];

      for (const file of files) {
        const reader = new FileReader();

        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("File reading failed"));
          reader.readAsDataURL(file);
        });

        base64Images.push(base64);
      }

      return base64Images;
    };

    const videosToBase64 = async (files: File[]): Promise<string[]> => {
      const base64Videos: string[] = [];

      for (const file of files) {
        const reader = new FileReader();

        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("File reading failed"));
          reader.readAsDataURL(file);
        });

        base64Videos.push(base64);
      }

      return base64Videos;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      isCreateThread(true);

      const base64Images = await filesToBase64(images);
      const base64Videos = await videosToBase64(videos);

      const data = {
        title: title,
        content: content,
        userId: userId,
        CategoryId: selectedCategories.map((category) => category.CategoryId),
        images: base64Images,
        videos: base64Videos,
      };

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}threads`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          console.log(res);
          throw new Error("Failed to create thread");
        }

        const Resdata = await res.json();
        console.log(Resdata);
        toast.success("Thread created successfully!");
        setTitle("");
        setContent("");
        setSelectedCategories([]);
        setLoading(false);
        isOpen();
        isCreateThread(false);
        onSuccess();
      } catch (error: any) {
        console.log(error?.message, "Failed to create Thread");
        toast.error("Failed to create Thread");
      } finally{
        isCreateThread(false);
      }
    };

    useImperativeHandle(ref, () => ({
      submit: handleSubmit,
    }));

    return (
      <div
      aria-disabled={loading}
       className="rounded-2xl border bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          Create Thread
        </h3>
        <form
          method="post"
          noValidate
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          {/* Title */}
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Thread title"
            className="mb-3 w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-[#64748B] text-sm outline-none"
          />

          {/* Content */}
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What’s on your mind?"
            rows={4}
            className="mb-4 w-full resize-none rounded-xl border border-[#E2E8F0] px-4 py-3 text-[#64748B] text-sm outline-none"
          />

          {/* Category Selector */}
          <SelectCategoryCard
            onChange={handleCategoryChange}
            threadCategories={[]}
          />
        </form>
      </div>
    );
  }
);

export default CreateThread;
