"use client";

import React, { useState, useRef, useEffect, use } from "react";
import CreateCategory from "./CreateCategory";
import { set } from "sanity";
import { getAuth } from "@/lib/getAuth";

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


type SelectCategoryCardProps = {
  onChange: (categories: Category[]) => void;
  threadCategories: Category[];
};

const SelectCategoryCard : React.FC<SelectCategoryCardProps> = ({onChange, threadCategories})=> {
  const [categories, setCategories] = useState<Category[]>();
  const [selected, setSelected] = useState<Category[]>(threadCategories);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
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
  const wrapperRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
        let mounted = true;
    
        const load = async () => {
          try {
            setLoading(true);
            setError(null);
    
            if(!token) return;
    
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
      },[token]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setOpenCreate(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = categories?.filter(
    (cat) =>
      cat?.title.toLowerCase().includes(query.toLowerCase()) &&
      !selected?.includes(cat)
  );

  const visibleCategories = query
    ? filtered
    : filtered?.slice(0, 5);

  const selectCategory = (cat: Category) => {
  setSelected((prev) => {
    const updated = [...prev, cat];
    onChange?.(updated);
    return updated;
  });
  setQuery("");
  setOpen(false);
  setOpenCreate(false);
};

const removeCategory = (cat: Category) => {
  setSelected((prev) => {
    const updated = prev.filter((c) => c !== cat);
    onChange?.(updated);
    return updated;
  });
};


  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      {/* Input Box */}
      <div
        onClick={() => setOpen(true)}
        className="flex min-h-[44px] flex-wrap items-center gap-2 rounded-xl border border-[#E2E8F0] px-3 py-2"
      >
        {selected?.map((cat) => (
          <span
            key={cat?._id}
            className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700"
          >
            {cat?.title}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeCategory(cat);
              }}
            >
              ✕
            </button>
          </span>
        ))}

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={
            selected?.length === 0 ? "Select categories" : ""
          }
          className="flex-1 border-none text-[#64748B] text-sm outline-none"
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border bg-white shadow">
          {/* Close Button */}
          <div className="flex items-center justify-between border-b px-4 py-2">
            <span className="text-xs font-medium text-gray-500">
              Categories
            </span>
            <button
              onClick={() => {
                setOpen(false);
                setOpenCreate(false);
              }}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Close ✕
            </button>
          </div>

          {/* Category List */}
          {visibleCategories?.map((cat) => (
            <button
              key={cat?._id}
              onClick={() => selectCategory(cat)}
              className="block w-full px-4 py-2 text-left text-[#64748B] text-sm hover:bg-gray-100"
            >
              {cat?.title}
            </button>
          ))}

          {/* Create Category */}
          {query && filtered?.length === 0 && (
           <div>
            {/* Create Category */}
            <div className={`${openCreate ? "block" : "hidden"}`}>
                <CreateCategory />
            </div>
             <button
              onClick={() => setOpenCreate(!openCreate)}
              className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50"
            >
              ➕ Create
            </button>
           </div>
          )}

          {!query && filtered && filtered.length > 5 && (
            <div className="px-4 py-2 text-xs text-gray-400">
              Search to see more categories
            </div>
          )}
        </div>
      )}
    </div>
  );
}
 export default SelectCategoryCard;