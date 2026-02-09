"use client";

import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import SelectCategoryCard from "./SelectCategoryCard";
import { form } from "sanity/structure";
import { set } from "sanity";
import { getAuth } from "@/lib/getAuth";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Redux/store";
import { fetchAuth } from "@/Redux/slices/AuthSlice";

export type CreatThreadFormRef = {
  submit: (e: React.FormEvent<HTMLFormElement>) => void;
};

type Like = {
  userId: number;
  ThreadId: number;
};

type Comment = {
  _id: string;
  userId: number;
  comment: string;
  CommentId: number;
  createdAt: string;
  replies: Array<Comment>;
};
type Thread = {
  _id: string;
  title: string;
  content: string;
  CategoryId: Array<Number>;
  images: Array<string>;
  videos: Array<string>;
  userId: Number;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  ThreadId: Number;
  user: {
    userId: Number;
    name: string;
    email: string;
    ProfilePic: string;
  };
  categories: Array<Category>;
  comments: Array<Comment>;
  likes: Array<Like>;
};

type CreateThreadProps = {
  images: File[];
  videos: File[];
  isOpen: () => void;
  isCreateThread: (key: boolean) => void;
  onSuccess: (data: Thread) => void;
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
      [],
    );
    const [query, setQuery] = useState("");
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAuth());
  },[]);

    const auth = useSelector((state: RootState) => state?.auth);

  useEffect(() => {
    setToken(auth?.auth?.token);
    setUserId(auth?.auth?.userId);
  }, [auth]);

  console.log("Create Thread token:",token);
  
    const inputRef = useRef<HTMLInputElement>(null);

    const handleCategoryChange = useCallback((categories: Category[]) => {
      setSelectedCategories(categories);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      isCreateThread(true);
      setError(null);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("userId", userId?.toString() || "");
      formData.append(
        "CategoryId",
        selectedCategories.map((category) => category.CategoryId).join(","),
      );
      images.forEach((image) => {
  formData.append("images", image);
});

videos.forEach((video) => {
  formData.append("videos", video);
});
      try {
        if (!token) {
          console.log("token not found");
          
          throw new Error("Token not found");
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}threads`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
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
        onSuccess(Resdata?.data);
      } catch (error: any) {
        setError(error?.message);
        console.log(error?.message, "Failed to create Thread");
        toast.error("Failed to create Thread");
      } finally {
        isCreateThread(false);
      }
    };

    useImperativeHandle(ref, () => ({
      submit: handleSubmit,
    }));

    return (
      <div
        aria-disabled={loading}
        className="rounded-2xl border bg-white p-5 shadow-sm"
      >
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
        {error && (
          <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>
        )}
      </div>
    );
  },
);

export default CreateThread;
