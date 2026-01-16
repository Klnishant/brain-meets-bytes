"use client";

import { getAuth } from "@/lib/getAuth";
import { updateCategory } from "@/Redux/slices/CategorySlice";
import { AppDispatch } from "@/Redux/store";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

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

type EditCategoryProps = {
  titles: string;
  routes: string;
  descriptions: string;
  colors: string;
  images: string| null;
  cateGoryId: number;
  isOpen: ()=>void;
};

const EditCategory: React.FC<EditCategoryProps> = ({
  titles,
  routes,
  descriptions,
  colors,
  images,
  cateGoryId,
  isOpen
}) => {
  const [title, setTitle] = useState(titles);
  const [route, setRoute] = useState(routes);
  const [description, setDescription] = useState(descriptions);
  const [color, setColor] = useState(colors);
  const [image, setImage] = useState<File | null>();
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
      console.log("auth", auth);
    };
    fetchAuth();
  }, []);
  const fileToBase64 = async (file: File): Promise<string> => {
    const reader = new FileReader();

    const result: string = await new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("File reading failed"));
      reader.readAsDataURL(file);
    });

    return result;
  };
  
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!token) return

    dispatch(
        updateCategory({
          categoryId: cateGoryId,
          token,
            title: title,
            route: route,
            color: color,
            description: description,
            image: image ? await fileToBase64(image) : null,
        })
      );
      toast.success("Category edited successfully");
      setTitle("");
      setRoute("");
      setDescription("");
      setColor("#2563EB");
      setImage(null);
      setLoading(false);
      isOpen();
  };

  return (
    <div className="rounded-2xl border bg-white  p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">
        Edit Category
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
              <span className="font-sora text-[14px] text-[#023047]">
                Images
              </span>
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
          <p className="text-sm font-semibold text-[#023047]">
            {title || "Category Title"}
          </p>
          <p className="text-xs text-[#505050]">
            {description || "category-description"}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex justify-end">
        <button
          form="category"
          type="submit"
          className="rounded-full bg-[#023047] px-6 py-2 text-sm font-semibold text-white"
        >
          {!loading ? "Edit Category" : (<Loader size={14} className="animate-spin" />)}
        </button>
      </div>
    </div>
  );
};

export default EditCategory;
