"use client";

import React, { use, useEffect, useRef, useState } from "react";
import SelectCategoryCard from "./SelectCategoryCard";
import { form } from "sanity/structure";
import { set } from "sanity";
import { Edit, Images, Loader } from "lucide-react";
import { getAuth } from "@/lib/getAuth";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";

export type ChildFormRef = {
  submit: () => void;
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


type EditThreadProps = {
  threadId: Number;
  threadImages: string[];
  threadTitle: string;
  threadContent: string;
  threadCategories: Category[];
  isOpen: () => void;
  isCreateThread: (key: boolean) => void;
  onSuccess?: ((data: Thread) => void) | undefined;
};

const EditThread: React.FC<EditThreadProps> = ({
  threadId,
 threadImages,
  threadTitle,
  threadContent,
  threadCategories,
  isOpen,
  isCreateThread,
  onSuccess,
}) => {
  const [title, setTitle] = useState(threadTitle);
  const [content, setContent] = useState(threadContent);
  const [selectedCategories, setSelectedCategories] =
    useState<Category[]>(threadCategories);
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(threadImages);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading,setLoading] = useState(false)
  const [submiting,setSubmiting] = useState(false)
  const [error,setError] = useState<string | null>(null)

   const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setToken(auth?.auth?.token);
    setUserId(auth?.auth?.userId);
  }, [auth]);

  const inputRef = useRef<HTMLInputElement>(null);

  const urlsToFiles = async (
    urls: string[],
    options?: {
      namePrefix?: string;
      mimeType?: string;
    }
  ): Promise<File[]> => {
    return Promise.all(
      urls?.map(async (url, index) => {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to fetch ${url}`);
        }

        const blob = await res.blob();

        return new File(
          [blob],
          `${options?.namePrefix || "file"}-${index}.${blob.type.split("/")[1]}`,
          {
            type: options?.mimeType || blob.type,
          }
        );
      })
    );
  };

  useEffect(() => {
    const convert = async () => {
      try {
        const converted = await urlsToFiles(imageUrls, {
          namePrefix: "edit-image",
        });
        setImages(converted);
      } catch (err) {
        console.error(err);
      }
    };

    convert();
    console.log(threadCategories);
  }, [threadImages]);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    setImages((prev) => [...prev, ...selectedFiles]);

    // Reset input so same image can be re-selected
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  const handleCategoryChange = (categories: Category[]) => {
    setSelectedCategories(categories);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    isCreateThread(true);
    setSubmiting(true);
    setError(null)

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("userId", userId?.toString() || "");
    formData.append(
      "CategoryId",
      selectedCategories.map((category) => category.CategoryId).join(",")
    );
     images.forEach((image) => {
  formData.append("images", image);
});

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}threads?ThreadId=${threadId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update thread");
      }

      const Resdata = await res.json();
      console.log(Resdata);
      toast.success("Thread updated successfully!");
      setTitle("");
      setContent("");
      setSelectedCategories([]);
      setLoading(false);
        isOpen();
        isCreateThread(false);
        onSuccess && onSuccess(Resdata?.data);
    } catch (error: any) {
      setError(error?.message);
      console.log(error?.message, "Failed to update Thread");
      toast.error("Failed to update Thread");
    } finally{
      isCreateThread(false);
      setLoading(false);
      setSubmiting(false);
    }
  };

  return (
    <div
    aria-disabled={loading}
     className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Edit Thread</h3>
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
          threadCategories={threadCategories}
        />

        {/* Image Upload */}
        <div className="mb-4 mt-2 flex items-center gap-4">
          <label
            htmlFor="image-upload"
            className="cursor-pointer rounded-lg text-[#64748B] text-sm hover:bg-gray-50"
          >
            <div className="inline-flex items-center gap-2 rounded-[36px] border border-[#E2E8F0] bg-white px-6 py-2">
              <span className=" items-center justify-center ">
                <img
                  src="/image.png"
                  alt="Images"
                  className="h-4 w-4 object-contain"
                />
              </span>
              <span className="font-sora text-[14px] text-[#023047]">
                Images
              </span>
            </div>
            <input
              id="image-upload"
              name="image-upload"
              ref={inputRef}
              type="file"
              multiple
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>

          <span className="text-xs text-[#64748B]">
            {images.length} selected
          </span>
        </div>

        {/* Image Preview */}
        <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4">
          {images.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="h-24 w-full rounded-lg object-cover"
              />

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-2 top-2 hidden rounded-full bg-black/60 p-1 text-white group-hover:block"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <h3 className="text-sm font-semibold text-red-900">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          )}
        {/* Publish */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submiting}
            className="rounded-full bg-[#023047] px-6 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            {!submiting ? "Edit" : (<Loader size={14} className="animate-spin" />)}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditThread;
