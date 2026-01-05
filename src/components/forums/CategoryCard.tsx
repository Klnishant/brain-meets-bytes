"use client";

import { COLORS } from "@/lib/constants";
import Link from "next/link";
import React, { useEffect, useState } from "react";

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


    const token: string = localStorage.getItem("token") ?? "";

    useEffect(() => {
      let mounted = true;
  
      const load = async () => {
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
    },[]);

    const visibleCategories = categories.slice(0, visibleCount);
    console.log(visibleCategories);
    

    const handleAllCategories = () => {
      setVisibleCount((prev) => prev + 5);
    }
  return (
    <div className="flex flex-col justify-between h-full gap-2">
      <div className="flex flex-col gap-2">
      {
        visibleCategories && visibleCategories.map((category) => (
          <Link
          key={category?._id}
      href={category?.route}
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
            <div className="rounded-full px-3 py-[2px] gap-[10px] border border-[#E2E8F0] bg-[#FAF9F8]">
              <p className="font-inter font-normal text-[12px] leading-[100%] tracking-normal text-[#505050]">
                {`${category?.threadCount || 0} Threads`}
              </p>
            </div>
          </div>
          <div className="w-full">
            <p className="font-inter font-normal text-[#505050] text-[14px] leading-[100%] tracking-normal">
              {category?.description || "No description"}
            </p>
          </div>
        </div>
      </div>
    </Link>
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
