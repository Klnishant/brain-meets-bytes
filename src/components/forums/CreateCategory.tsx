"use client";

import { getAuth } from "@/lib/getAuth";
import { useEffect, useState } from "react";
import { set } from "sanity";
import { form } from "sanity/structure";

const CreateCategory = () => {
  const [title, setTitle] = useState("");
  const [route, setRoute] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#2563EB");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
            const [userId, setUserId] = useState<number | null>(null);
          
            useEffect(() => {
              const fetchAuth = async () => {
                const auth = await getAuth();
                if (auth) {
                  setToken(auth.token);
                  setUserId(auth.userId);
                }
                console.log("auth",auth);;
                
              }
              fetchAuth();
            },[])
  const fileToBase64 = async (file: File): Promise<string> => {
  const reader = new FileReader();

  const result: string = await new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("File reading failed"));
    reader.readAsDataURL(file);
  });

  return result;
};



  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const body = {
      "title": title,
      "route": route,
      "description": description,
      "color": color,
      "imageUrl": image ? await fileToBase64(image) : null,
    };

    try {
       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}category`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if(!res.ok){
        throw new Error("Failed to create category");
      }

      const data = await res.json();
      console.log(data);
      alert("Category created successfully");
      setTitle("");
      setRoute("");
      setDescription("");
      setColor("#2563EB");
      setImage(null);
    } catch (error: any) {
      console.error(error?.message,"Failed to create category");
    }
  };

  return (
    <div className="rounded-2xl border bg-white  p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">
        Create Category
      </h3>

      <form
      id="category" 
      method="post"
      noValidate
      encType="multipart/form-data"
      onSubmit={handleSubmit}
      >
        {/* Title */}
      <input
        value={title}
        name="title"
        onChange={(e) => {
          setTitle(e.target.value);
          setRoute(
            e.target.value
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, "")
          );
        }}
        placeholder="Category title"
        className="mb-3 w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-[#64748B] text-sm outline-none"
      />

      {/* Route */}
      <input
        value={route}
        name="route"
        onChange={(e) => setRoute(e.target.value)}
        placeholder="category-route"
        className="mb-3 w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-[#64748B] text-sm outline-none"
      />

      {/* Description */}
      <textarea
        value={description}
        name="description"
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Short description"
        rows={3}
        className="mb-4 w-full resize-none rounded-xl border border-[#E2E8F0] px-4 py-3 text-[#64748B] text-sm outline-none"
      />

      {/* Image & Color */}
      <div className="mb-4 flex items-center gap-4">
        <label className="cursor-pointer rounded-lg  text-[#64748B] text-sm hover:bg-gray-50">
          <div className="inline-flex items-center gap-2 rounded-[36px] border border-[#E2E8F0] bg-white px-6 py-2">
            <span className=" items-center justify-center ">
              <img
                src="/image.png"
                alt="Images"
                className="h-4 w-4 object-contain"
              />
            </span>
            <span className="font-sora text-[14px] text-[#023047]">Images</span>
          </div>
          <input
            type="file"
            name="image"
            hidden
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </label>

        <input
          type="color"
          value={color}
          name="color"
          onChange={(e) => setColor(e.target.value)}
          className="h-9 w-9 cursor-pointer  rounded-md border"
        />

        <span className="text-xs text-gray-500">
          {image ? image.name : "No image selected"}
        </span>
      </div>
      </form>

      {/* Preview */}
      <div className="mb-4 flex items-center gap-3 rounded-xl border p-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: color }}
        >
          {title?.[0] || "C"}
        </div>

        <div>
          <p className="text-sm font-semibold text-[#023047]">{title || "Category Title"}</p>
          <p className="text-xs text-[#505050]">
            {description || "category-description"}
          </p>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button form="category" type="submit" className="rounded-full bg-[#023047] px-6 py-2 text-sm font-semibold text-white">
          Create Category
        </button>
      </div>
    </div>
  );
};

export default CreateCategory;
