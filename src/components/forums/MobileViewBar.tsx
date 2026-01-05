"use client";

import { Search, Bell, MessageCircle, Plus, Menu } from "lucide-react";
import { useState, useRef, FormEvent } from "react";
import CreateThread from "./CreateThread";
import CreatePoll from "./CreatePoll";
import CategoryCard from "./CategoryCard";
import PollCard from "./PollCard";
import UsersCard from "./UsersCard";

const MobileViewBar = ({ className }: { className?: string }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isPollOpen, setIsPollOpen] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isTopicsOpen, setIsTopicsOpen] = useState(false);
  const [isPollsOpen, setIsPollsOpen] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);

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

  const handleParentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formRef.current?.submit();
  };

  return (
    <div>
      {/* Search Bar */}
      <div
        className={`${isSearchOpen ? "block" : "hidden"} items-center justify-between gap-4 rounded-[42px] border border-[#E2E8F0] bg-white px-6 py-3`}
      >
        <input
          type="text"
          placeholder="Search for a tread...."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none text-[12px] md:text-base text-[#1E293B] placeholder-[#64748B]"
        />
        <button className="flex h-[44px] w-[136px] items-center justify-center gap-2 rounded-[34px] bg-[#D62828] text-[16px] text-white">
          <span>Search</span>
          <img
            src="/search.png"
            alt="Search"
            className="h-4 w-4 object-contain"
          />
        </button>
      </div>
      {/* Composer */}
      <div
        className={`${isComposerOpen ? "block" : "hidden"} flex flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5`}
      >
        <div className="flex items-center gap-4">
          <div className="h-[60px] w-[60px] overflow-hidden rounded-full border-2 border-[#D62828] shrink-0">
            <img
              src="/forum-user-1.jpg"
              alt="Current user"
              className="h-full w-full object-cover"
            />
          </div>
          <div
            className={`${isComposerOpen ? "block" : "hidden"} flex justify-end w-full`}
          >
            <button
              onClick={() => setIsComposerOpen(false)}
              className="rounded-lg border border-[#CBD5E1] px-4 py-2 text-sm text-[#475569] hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
          <div
            onClick={() => setIsComposerOpen(true)}
            className={`${isComposerOpen ? "hidden" : "block"} flex flex-1 items-center gap-3 rounded-[42px] border border-[#E2E8F0] bg-[#FAF9F8] px-6 py-3`}
          >
            <span className="font-sora text-[16px] text-[#64748B]">
              What&apos;s on your mind?
            </span>
          </div>
        </div>

        {/* Composer form */}

        <div className={`${isComposerOpen ? "block" : "hidden"}`}>
          <CreateThread images={images} ref={formRef} />
        </div>

        {/* Polls */}
        <div className={`${isPollOpen ? "block" : "hidden"} z-10`}>
          <CreatePoll handleClick={() => setIsPollOpen(!isPollOpen)} />
        </div>
        <form noValidate onSubmit={handleParentSubmit}>
          <div className="flex flex-col gap-3 border-t border-[#E2E8F0] pt-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-1 md:gap-3">
              {/* Image Upload */}
              <div className="flex items-center md:gap-4">
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer rounded-lg text-[#64748B] text-sm hover:bg-gray-50"
                >
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-[36px] border border-[#E2E8F0] bg-white px-6 py-2 font-sora text-[14px] text-[#023047]"
                  >
                    <img src="/image.png" className="h-4 w-4 object-contain" />
                    Images
                  </button>
                  <input
                    id="image-upload"
                    name="image-upload"
                    type="file"
                    multiple
                    ref={inputRef}
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <button className="inline-flex items-center gap-2 rounded-[36px] border border-[#E2E8F0] bg-white px-6 py-2">
                <span className=" items-center justify-center">
                  <img
                    src="/video.png"
                    alt="Videos"
                    className="h-4 w-4 object-contain"
                  />
                </span>
                <span className="font-sora text-[14px] text-[#023047]">
                  Videos
                </span>
              </button>
              <button
                onClick={() => setIsPollOpen(!isPollOpen)}
                className="inline-flex items-center gap-2 rounded-[36px] border border-[#E2E8F0] bg-white px-6 py-2"
              >
                <span className=" items-center justify-center ">
                  <img
                    src="/poll.png"
                    alt="Polls"
                    className="h-4 w-4 object-contain"
                  />
                </span>
                <span className="font-sora text-[14px] text-[#023047]">
                  Polls
                </span>
              </button>
            </div>

            <button
              type="submit"
              className="mt-2 flex h-[50px] w-[136px] items-center justify-center rounded-[34px] bg-[#023047] text-[16px] text-white md:mt-0"
            >
              Publish
            </button>
          </div>
        </form>
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
                className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white group-hover:block"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Menu */}
       <div className={`${isMenuOpen ? "block" : "hidden"}`}>
            <div className={`${isCategoriesOpen ? "block" : "hidden"} flex h-[426px] flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5`}>
              <h3 className="font-sora text-[24px] font-semibold text-[#1E293B]">
                Top Categories
              </h3>

              {/* categories list */}
              <div className="flex flex-col justify-between h-full overflow-x-auto scrollbar-hide">
                <div className="flex flex-col gap-2 h-full">
                  <CategoryCard />
                </div>
              </div>
            </div>

            

            <div className={`${isUsersOpen ? "block" : "hidden"} flex h-[426px] flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5`}>
              <h3 className="font-sora text-[24px] font-semibold text-[#1E293B]">
                You may know
              </h3>
              {/* users list */}
              <div className="flex flex-col gap-2 h-full overflow-x-auto scrollbar-hide">
                <UsersCard />
              </div>
            </div>

            <div className={`${isPollsOpen ? "block" : "hidden"} flex h-[426px] flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5`}>
              <h3 className="font-sora text-[24px] font-semibold text-[#1E293B]">
                Latest Poll
              </h3>
              {/* poll card */}
              <div className="flex flex-col gap-2 h-full overflow-x-auto scrollbar-hide">
                <PollCard />
              </div>
            </div>
          </div>
      {/* Menu items */}
      <div className={`${isMenuOpen ? "block" : "hidden"} rounded-3xl p-2 flex flex-col gap-2 bg-[#023047]`}>
        <button onClick={()=>(setIsCategoriesOpen(!isCategoriesOpen))}>
          Top Categories
        </button>
        <button className="hidden" onClick={()=>(setIsTopicsOpen(!isTopicsOpen))}>
          Recomended Topics
        </button>
        <button onClick={()=>(setIsUsersOpen(!isUsersOpen))}>
          You May Know
        </button>
        <button onClick={()=>(setIsPollsOpen(!isPollsOpen))}>
          Poll
        </button>
      </div>
      <div
        className={`flex items-center justify-between h-[48px] w-[361px] gap-3 bg-[#023047] px-1.5 py-2 rounded-full ${className ?? ""}`}
      >
        {/* Icon Buttons */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => (setIsSearchOpen(!isSearchOpen))}
            className="h-9 w-9 bg-[#D62828] rounded-full flex justify-center items-center"
          >
            <Search size={"16px"} />
          </button>

          <button className="h-9 w-9 bg-[#D62828] rounded-full flex justify-center items-center">
            <Bell size={"16px"} />
          </button>

          <button className="h-9 w-9 bg-[#D62828] rounded-full flex justify-center items-center">
            <MessageCircle size={"16px"} />
          </button>

          <button
            onClick={() => setIsComposerOpen(!isComposerOpen)}
            className="h-9 w-9 bg-[#D62828] rounded-full flex justify-center items-center"
          >
            <Plus size={"16px"} />
          </button>
        </div>
        {/* Menu Button */}
        <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 bg-white text-[#0B2A3A] px-4 py-2 rounded-full font-semibold text-sm">
          <Menu size={"18px"} />
          Menu
        </button>
      </div>
    </div>
  );
};

export default MobileViewBar;
