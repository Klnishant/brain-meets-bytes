"use client";

import { COLORS } from "@/lib/constants";
import { getAuth } from "@/lib/getAuth";
import { getUser } from "@/lib/getUser";
import { Loader, SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import EditCategory from "./EditCategory";
import toast from "react-hot-toast";
import { deleteCategory, fetchCategories } from "@/Redux/slices/CategorySlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Redux/store";

type Category = {
  _id: string;
  CategoryId: number;
  title: string;
  route: string;
  color: string;
  description: string;
  threadCount: number;
  image: string;
};

const CategoryCard = () => {
 //const [error, setError] = useState<string | null>(null);
  //const [loading, setLoading] = useState(false);
  //const [categories, setCategories] = useState<Category[]>([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [user, setUser] = useState<{ data: { RoleId: number } } | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentEditCategory, setCurrentEditCategory] = useState<number>();
  const [visibleCategories, setVisibleCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      if (user) {
        setUser(user);
      }
      console.log(user);
    };
    fetchUser();
  }, []);

  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setToken(auth?.auth?.token);
    setUserId(auth?.auth?.userId);
  }, [auth]);

  console.log("token:", token);

  

 const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  const categories = useSelector(
  (state: RootState) => state.categories.list
);

const loading = useSelector(
  (state: RootState) => state.categories.loading
);

const error = useSelector(
  (state: RootState) => state.categories.error
);
  

  // const onDelete = (CategoryId: number)=> {
  //   setCategories((prev) => prev.filter((c) => c.CategoryId !== CategoryId));
  // }

  // const onSuccess = (data?: Category) => {
  //   setCategories((prev) => prev.map((c) => (c.CategoryId === data?.CategoryId ? data : c)));
  // };

  useEffect(() => {
    const visibleCategories = () => {
      setVisibleCategories(categories.slice(0, visibleCount));
    };
    visibleCategories();
  }, [visibleCount, categories]);

  const handleAllCategories = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement>,
    CategoryId: number
  ) => {
    if(!token) return;
    e.preventDefault();
    setIsDeleting(true);

   dispatch(
      deleteCategory({
        categoryId: Number(CategoryId),
        token,
      })
    );
  };
  return (
    <div className="flex flex-col justify-between h-full gap-2">
      <div
        className={` text-[#505050] ${isEditOpen && currentEditCategory === currentCategory?.CategoryId ? "block" : "hidden"} z-10 absolute top-0 left-0`}
      >
        <div className="w-full flex justify-end">
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
              onClick={() => setIsEditOpen(false)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
        <EditCategory
          key={currentCategory?._id}
          titles={currentCategory?.title || ""}
          routes={currentCategory?.route || ""}
          descriptions={currentCategory?.description || ""}
          colors={currentCategory?.color || ""}
          images={currentCategory?.image || ""}
          cateGoryId={currentCategory?.CategoryId || 0}
          isOpen={()=>{setIsEditOpen(!isEditOpen)}}
        />
      </div>
      <div>
        {loading ? (
          <div className="flex items-center justify-center h-full w-full">
            <Loader size={24} className="animate-spin" color="black" />
          </div>
        ) : (
          <div>
            <div className="flex flex-col gap-2">
              {visibleCategories &&
                visibleCategories.map((category) => (
                  <div key={category?._id}>
                    <div
                      //href={category?.route}
                      className="flex flex-col w-full items-center gap-2 rounded-md border border-zinc-200 p-1"
                    >
                      <div
                        className={`flex items-center p-1 gap-3 rounded-md w-full`}
                      >
                        <div
                          className={`w-[56px] h-[49px] rounded-full opacity-100  flex items-center justify-center`}
                          style={{
                            backgroundColor: category?.color || "black",
                          }}
                        >
                          {
                            category?.image ? (
                              <img
                            src={category?.image}
                            alt={category?.title[0]}
                            className=" w-8 h-8 opacity-100 object-cover rounded-full z-5 items-center justify-center"
                          />
                            ) : (
                              <span className="font-inter font-bold text-white text-2xl">
                              {category?.title[0].toUpperCase()}
                            </span>
                            )
                          }
                        </div>
                        <div className="w-full">
                          <div className="w-full flex items-center justify-between gap-1">
                            <div className="">
                              <h1 className="font-inter font-semibold text-[#023047] text-lg leading-7">
                                {category?.title}
                              </h1>
                            </div>
                            <div className="flex gap-1 items-center">
                              <div className="rounded-full px-3 py-[2px] gap-[10px] border border-[#E2E8F0] bg-[#FAF9F8]">
                                <p className="font-inter font-normal text-[12px] leading-[100%] tracking-normal text-[#505050]">
                                  {`${category?.threadCount || 0} Threads`}
                                </p>
                              </div>
                              <button
                                onClick={(e) =>
                                  handleDelete(e, category?.CategoryId)
                                }
                                className={`w-4 h-4 text-[#505050] ${user?.data?.RoleId === 2 ? "block" : "hidden"}`}
                              >
                                <Trash2
                                  className={`w-4 h-4 text-[#505050] ${user?.data?.RoleId === 2 ? "block" : "hidden"}`}
                                />
                              </button>

                              <button
                                onClick={() => {
                                  setIsEditOpen(!isEditOpen);
                                  setCurrentEditCategory(category?.CategoryId);
                                  setCurrentCategory(category);
                                }}
                                className={`w-4 h-4 text-[#505050] ${user?.data?.RoleId === 2 ? "block" : "hidden"}`}
                              >
                                <SquarePen
                                  className={`w-4 h-4 text-[#505050] ${user?.data?.RoleId === 2 ? "block" : "hidden"}`}
                                />
                              </button>
                            </div>
                          </div>
                          <div className="w-full">
                            <p className="font-inter font-normal text-[#505050] text-[14px] leading-[100%] tracking-normal">
                              {category?.description || "No description"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
      <button
        onClick={handleAllCategories}
        className="font-inter font-semibold text-[#D62828] text-base leading-[30px] tracking-normal w-full text-start"
      >
        See all Categories
      </button>
    </div>
  );
};

export default CategoryCard;
  function useAppDispatch() {
    throw new Error("Function not implemented.");
  }

  function useAppSelector(arg0: (state: any) => any): { list: any; loading: any; error: any; } {
    throw new Error("Function not implemented.");
  }

