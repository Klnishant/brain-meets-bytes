"use client";

import { COLORS } from "@/lib/constants";
import { getAuth } from "@/lib/getAuth";
import { getUser } from "@/lib/getUser";
import { SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import EditCategory from "./EditCategory";

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

const CategoryCard = () => {
  const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [visibleCount, setVisibleCount] = useState(4);
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
   const [user, setUser] = useState<{ data: { roll: string } } | null>(null);
   const [isEditOpen, setIsEditOpen] = useState(false);
   const [currentEditCategory, setCurrentEditCategory] = useState<number>();
   const [visibleCategories, setVisibleCategories] = useState<Category[]>([]);
   
     useEffect(() => {
      const fetchUser = async () => {
        const user = await getUser();
        if (user) {
          setUser(user);
        }
      };
      fetchUser();
    }, []);
    
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

      console.log("token:",token);
      
    useEffect(() => {
      let mounted = true;
  
      const load = async () => {
        if(!token) return;
        if(!user) return;
        try {
          setLoading(true);
          setError(null);
  
          const res = await fetch(
            `http://54.172.93.35:7000/api/category`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log(res);
          
          if (!res.ok) {
            throw new Error("Failed to load threads");
          }
  
          const data = (await res.json())?.data as Category[];
          if (!mounted) return;
          setCategories(Array.isArray(data) ? data : []);
        } catch (e: any) {
          if (!mounted) return;
          setError(e?.message ?? "Failed to load threads");
        } finally {
          if (mounted) setLoading(false);
        }
      };
  
      load();
  
      return () => {
        mounted = false;
      };
    },[token,user,isEditOpen]);

    useEffect(() => {
      const visibleCategories = ()=>{
        setVisibleCategories(categories.slice(0, visibleCount));
      }
      visibleCategories();
    },[visibleCount,categories]);
    

    const handleAllCategories = () => {
      setVisibleCount((prev) => prev + 5);
    }

    const handleDelete = async(e: React.MouseEvent<HTMLButtonElement>, CategoryId: number)=>{
      e.preventDefault();

      try {
        const res = await fetch(`http://54.172.93.35:7000/api/category?CategoryId=${CategoryId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res?.ok) {
          throw new Error("Failed to delete thread");
        }
        if(res.ok) {
          alert('Thread deleted successfully!');
        }
      } catch (error: any) {
        console.log(error?.message,"Failed to delete thread");
      }
    }
  return (
    <div className="flex flex-col justify-between h-full gap-2 relative">
      <div className="flex flex-col gap-2">
      {
        visibleCategories && visibleCategories.map((category) => (
          
         <div>
           <div className={`w-7 h-7 text-[#505050] ${isEditOpen && currentEditCategory === category.CategoryId ? "block" : "hidden"} z-10 w-full absolute top-0 left-0`}>
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
              <EditCategory titles={category?.title} routes={category?.route} descriptions={category?.description} colors={category?.color} images={null} cateGoryId={category?.CategoryId} />
            </div>
           <div
          key={category?._id}
      //href={category?.route}
      className="flex flex-col w-full items-center gap-2 rounded-md border border-zinc-200 p-1"
    >
      <div className={`flex items-center p-1 gap-3 rounded-md w-full`}>
        <div
          className={`w-[56px] h-[49px] rounded-full opacity-100  flex items-center justify-center`}
          style={{ backgroundColor: category?.color || "black" }}
        >
          <img
            src={category?.imageUrl}
            alt=""
            className=" w-6 h-6 opacity-100 object-cover items-center justify-center"
          />
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
            onClick={(e) => handleDelete(e, category?.CategoryId)}
            className={`w-4 h-4 text-[#505050] `}
            >
              <Trash2 className={`w-4 h-4 text-[#505050] `} />
            </button>

            <button 
            onClick={() => {
              setIsEditOpen(!isEditOpen);
              setCurrentEditCategory(category?.CategoryId);
            }}
            className={`w-4 h-4 text-[#505050] `}>
              <SquarePen className={`w-4 h-4 text-[#505050] `} />
            </button >
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
        ))
      }
    </div>
    <button 
    onClick={handleAllCategories}
    className="font-inter font-semibold text-[#D62828] text-base leading-[30px] tracking-normal w-full text-start">
                  See all Categories
                </button>
    </div>
  );
};

export default CategoryCard;
