"use client";

import React, { use, useEffect, useRef, useState } from "react";
import SelectCategoryCard from "./SelectCategoryCard";
import { form } from "sanity/structure";
import { set } from "sanity";
import { Edit, Images, Loader } from "lucide-react";
import { getAuth } from "@/lib/getAuth";

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

type EditThreadProps = {
  threadId: Number;
  threadImages: string[];
  threadTitle: string;
  threadContent: string;
  threadCategories: Category[];
  isOpen: () => void;
  isCreateThread: (key: boolean) => void;
  onSuccess: () => void;
};

const EditThread: React.FC<EditThreadProps> = ({
  threadId,
  threadTitle,
  threadContent,
  threadImages,
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

  const urlsToFiles = async (
    urls: string[],
    options?: {
      namePrefix?: string;
      mimeType?: string;
    }
  ): Promise<File[]> => {
    return Promise.all(
      urls.map(async (url, index) => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    isCreateThread(true);

    const base64Images = await filesToBase64(images);

    const data = {
      title: title,
      content: content,
      userId: userId,
      CategoryId: selectedCategories.map((category) => category.CategoryId),
      images: base64Images,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}threads?ThreadId=${threadId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update thread");
      }

      const Resdata = await res.json();
      console.log(Resdata);
      alert("Thread updated successfully!");
      setTitle("");
      setContent("");
      setSelectedCategories([]);
      setLoading(false);
        isOpen();
        isCreateThread(false);
        onSuccess();
    } catch (error: any) {
      console.log(error?.message, "Failed to update Thread");
    } finally{
      isCreateThread(false);
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

        {/* Publish */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#023047] px-6 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            {!loading ? "Edit" : (<Loader size={14} className="animate-spin" />)}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditThread;
