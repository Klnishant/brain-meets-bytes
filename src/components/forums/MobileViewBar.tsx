"use client";

import { Search, Bell, MessageCircle, Plus, Menu, Loader } from "lucide-react";
import { useState, useRef, FormEvent, useEffect } from "react";
import CreateThread, { CreatThreadFormRef } from "./CreateThread";
import CreatePoll, { CreatePollFormRef } from "./CreatePoll";
import CategoryCard from "./CategoryCard";
import PollCard from "./PollCard";
import UsersCard from "./UsersCard";
import { set } from "sanity";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Redux/store";
import { openLogIn } from "@/Redux/slices/LogInSlice";

type User = {
  _id: string;
  name: string;
  role: string;
  userId: number;
  ProfilePic: string;
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

type Topic = {
  _id: string;
  title: string;
  route: string;
  isActive: boolean;
  topicId: number;
};
type MobileViewBarProps = {
  className?: string;
  user: User | null;
  onSuccess: (data: Thread) => void;
  handleSearch: (searchText: string) => void;
};

const MobileViewBar: React.FC<MobileViewBarProps> = ({
  className,
  user,
  onSuccess,
  handleSearch,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const formRef = useRef<CreatThreadFormRef>(null);
  const pollFormRef = useRef<CreatePollFormRef>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isPollOpen, setIsPollOpen] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isTopicsOpen, setIsTopicsOpen] = useState(false);
  const [isPollsOpen, setIsPollsOpen] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [isCreatingPoll, setIsCreatingPoll] = useState(false);
  const [isCreatePollOpen, setIsCreatePollOpen] = useState(false);
  const [isCreateThread, setIsCreateThread] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [topicsCount, setTopicsCount] = useState(5);
    const [token, setToken] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [isLoadingTopics, setIsLoadingTopics] = useState(false);
    const [error, setError] = useState<string | null>(null);

  const pathname = usePathname();
  const isForumsPage = pathname === "/forums";

  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  
    useEffect(() => {
      setToken(auth?.auth?.token);
      setUserId(auth?.auth?.userId);
    }, [auth]);

  const fetchTopics = async () => {
      try {
        setIsLoadingTopics(true);
        setError(null);
  
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}topics`);
        if (!res.ok) {
          throw new Error("Failed to load topics");
        }
  
        const topicData = (await res.json())?.meta?.data as Topic[];
  
        setTopics(Array.isArray(topicData) ? topicData : []);
        console.log(topicData);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load topics");
      } finally {
        setIsLoadingTopics(false);
      }
    };
    useEffect(() => {
      fetchTopics();
    }, [token]);

    const visibleTopics = topics.slice(0, topicsCount);

  const handleTopic = () => {
    setTopicsCount(topicsCount + 5);
  };

  const handleSearchInputChange = (searchText?: string) => {
    handleSearch(searchText!);
  };

  useEffect(() => {
    handleSearchInputChange(search);
  }, [search]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    setImages((prev) => [...prev, ...selectedFiles]);

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    setVideos((prev) => [...prev, ...selectedFiles]);

    e.target.value = "";
  };

  const handleParentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isComposerOpen) {
      formRef.current?.submit(e);
    }

    if (isPollOpen) {
      pollFormRef.current?.submit(e);
    }
  };

  return (
    <div>
      {/* Search Bar */}
      <div
        className={`${isSearchOpen ? "block" : "hidden"} flex items-center justify-between gap-4 rounded-[42px] border border-[#E2E8F0] bg-white px-6 py-3`}
      >
        <input
          type="text"
          placeholder="Search for a thread...."
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
              src={user?.ProfilePic || "/forum-user.png"}
              alt="Current user"
              className="h-full w-full object-cover shrink-0"
            />
          </div>
          <div
            className={`${isComposerOpen ? "block" : "hidden"} flex justify-end w-full`}
          >
            {isCreateThread ? (
              <button
                onClick={() => setIsComposerOpen(false)}
                className="rounded-lg border border-[#CBD5E1] px-4 py-2 text-sm text-[#475569] hover:bg-gray-50"
              >
                Cancel
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsCreateThread(true);
                  setIsCreatePollOpen(false);
                }}
                className="rounded-lg border border-[#CBD5E1] px-4 py-2 text-sm text-[#475569] hover:bg-gray-50"
              >
                Create Thread
              </button>
            )}
          </div>
          <div
            onClick={() => {
              setIsComposerOpen(true);
              setIsPollOpen(false);
            }}
            className={`${isComposerOpen ? "hidden" : "block"} flex flex-1 items-center gap-3 rounded-[42px] border border-[#E2E8F0] bg-[#FAF9F8] px-6 py-3`}
          >
            <span className="font-sora text-[16px] text-[#64748B]">
              What&apos;s on your mind?
            </span>
          </div>
        </div>

        {/* Composer form */}

        <div className={`${isCreateThread ? "block" : "hidden"}`}>
          <CreateThread
            images={images}
            videos={videos}
            ref={formRef}
            isOpen={() => setIsCreateThread(!isCreateThread)}
            isCreateThread={(key: boolean) => {
              setIsCreatingThread(key);
            }}
            onSuccess={(data: Thread) => {
              onSuccess(data);
            }}
          />
        </div>

        {/* Polls */}
        <div className={`${isCreatePollOpen ? "block" : "hidden"} z-10`}>
          <CreatePoll
            handleClick={() => setIsCreatePollOpen(!isCreatePollOpen)}
            isCreatePoll={(key: boolean) => {
              setIsCreatingPoll(key);
            }}
          />
        </div>
        <form noValidate onSubmit={handleParentSubmit}>
          <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-4 md:flex-row md:items-center md:justify-between w-full">
            <div className="flex items-center w-full">
              {/* Image Upload */}
              {/* <div className="flex items-center gap-4">
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
                    type="file"
                    multiple
                    hidden
                    disabled={!isComposerOpen}
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div> */}
              {/* video Upload */}
              {/* <div aria-disabled={true} className="hidden items-center gap-4">
                <label
                  htmlFor="video-upload"
                  className="cursor-pointer rounded-lg text-[#64748B] text-sm hover:bg-gray-50"
                >
                  <div className="inline-flex items-center gap-2 rounded-[36px] border border-[#E2E8F0] bg-white px-6 py-2">
                    <span className=" items-center justify-center ">
                      <img
                        src="/video.png"
                        alt="Images"
                        className="h-4 w-4 object-contain"
                      />
                    </span>
                    <span className="font-sora text-[14px] text-[#023047]">
                      Videos
                    </span>
                  </div>
                  <input
                    id="video-upload"
                    name="video-upload"
                    type="file"
                    multiple
                    hidden
                    disabled={!isComposerOpen}
                    accept="video/*"
                    capture="environment"
                    onChange={handleVideoChange}
                  />
                </label>
              </div> */}
              <button
                type="button"
                onClick={() => {
                  setIsCreatePollOpen(!isCreatePollOpen);
                  setIsCreateThread(false);
                }}
                className="inline-flex items-center gap-2 rounded-[36px] border border-[#E2E8F0] bg-white px-2 py-1"
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

            <div className="w-full flex items-center">
              <button
                type="submit"
                disabled={
                  isCreatingThread ||
                  isCreatingPoll ||
                  (!isComposerOpen && !isPollOpen)
                }
                className=" flex px-2 py-1 items-center justify-center rounded-[34px] bg-[#023047] text-[16px] text-white md:mt-0"
              >
                {!isCreatingThread ? (
                  "Publish"
                ) : (
                  <Loader size={14} className="animate-spin" />
                )}
              </button>
            </div>
          </div>
        </form>
        {/* Image Preview */}
        <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4 shrink-0">
          {images.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="h-24 w-full rounded-lg object-cover shrink-0"
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
      </div>
      {/* Menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"}`}>
        <div
          className={`${isCategoriesOpen ? "block" : "hidden"} flex h-[426px] flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5`}
        >
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

        <div className={`${isTopicsOpen ? "block" : "hidden"} flex h-[222px] flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5`}>
          <h3 className="font-sora text-[24px] font-semibold text-[#1E293B]">
            Recommended Topics
          </h3>
          <div className="flex flex-col justify-between h-full overflow-x-auto scrollbar-hide">
            {isLoadingTopics ? (
              <div className="flex items-center justify-center h-full">
                <Loader size={24} className="animate-spin" color="black" />
              </div>
            ) : (
              <div className="flex gap-2.5">
                {/* topics list */}
                {visibleTopics &&
                  visibleTopics.map((topic) => (
                    <Link
                      key={topic._id}
                      href={topic.route}
                      className="flex w-fit items-center gap-2 px-4 py-2 rounded-full border border-[#E2E8F0] bg-[#FAF9F8]"
                    >
                      <p className="font-inter font-normal text-[#505050] text-sm leading-none">
                        {topic.title}
                      </p>
                    </Link>
                  ))}
              </div>
            )}
            <button
              onClick={handleTopic}
              className="font-inter font-semibold text-[#D62828] text-base leading-[30px] tracking-normal w-full text-start"
            >
              See all Topics
            </button>
          </div>
        </div>

        <div
          className={`${isUsersOpen ? "block" : "hidden"} flex h-[426px] flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5`}
        >
          <h3 className="font-sora text-[24px] font-semibold text-[#1E293B]">
            You may know
          </h3>
          {/* users list */}
          <div className="flex flex-col gap-2 h-full overflow-x-auto scrollbar-hide">
            <UsersCard />
          </div>
        </div>

        <div
          className={`${isPollsOpen ? "block" : "hidden"} flex h-[426px] flex-col gap-4 rounded-[20px] border border-[#E2E8F0] bg-white p-5`}
        >
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
      <div
        className={`${isMenuOpen ? "block" : "hidden"} rounded-3xl p-2 flex flex-col gap-2 bg-[#023047]`}
      >
        <button
          onClick={() => {
            setIsCategoriesOpen(!isCategoriesOpen);
            setIsTopicsOpen(false);
            setIsPollsOpen(false);
            setIsUsersOpen(false);
          }}
        >
          Top Categories
        </button>
        <button
          onClick={() => {
            setIsTopicsOpen(!isTopicsOpen);
            setIsCategoriesOpen(false);
            setIsPollsOpen(false);
            setIsUsersOpen(false);
          }}
        >
          Recomended Topics
        </button>
        <button
          className="hidden"
          onClick={() => {
            setIsUsersOpen(!isUsersOpen);
            setIsCategoriesOpen(false);
            setIsTopicsOpen(false);
            setIsPollsOpen(false);
          }}
        >
          You May Know
        </button>
        <button
          onClick={() => {
            setIsPollsOpen(!isPollsOpen);
            setIsCategoriesOpen(false);
            setIsTopicsOpen(false);
            setIsUsersOpen(false);
          }}
        >
          Poll
        </button>
      </div>
     <div className="w-full flex items-center justify-center">
       <div
        className={`flex items-center justify-between h-[48px] w-[231px] gap-3 bg-[#023047] px-1.5 py-2 rounded-full ${className ?? ""}`}
      >
        {/* Icon Buttons */}
        <div className={`flex items-center justify-between w-full`}>
          <button
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              setIsComposerOpen(false);
              setIsMenuOpen(false);
            }}
            className={`h-9 w-9 bg-[#D62828] rounded-full flex justify-center items-center ${isForumsPage ? "block" : "hidden"}`}
          >
            <Search size={"16px"} />
          </button>

          <button className="h-9 w-9 bg-[#D62828] rounded-full hidden justify-center items-center">
            <Bell size={"16px"} />
          </button>

          <button className="h-9 w-9 bg-[#D62828] rounded-full hidden justify-center items-center">
            <MessageCircle size={"16px"} />
          </button>

          <button
            onClick={() => {
              if(!token){
                dispatch(openLogIn());
                return
              }
              setIsComposerOpen(!isComposerOpen);
              setIsSearchOpen(false);
              setIsMenuOpen(false);
            }}
            className={`h-9 w-9 bg-[#D62828] rounded-full flex justify-center items-center ${isForumsPage ? "block" : "hidden"}`}
          >
            <Plus size={"16px"} />
          </button>
          {/* Menu Button */}
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsSearchOpen(false);
              setIsComposerOpen(false);
            }}
            className={`flex items-center gap-2 bg-white text-[#0B2A3A] px-4 py-2 rounded-full font-semibold text-sm ${isForumsPage ? "" : "w-full justify-center"}`}
          >
            <Menu size={"18px"} />
            Menu
          </button>
        </div>
      </div>
     </div>
    </div>
  );
};

export default MobileViewBar;
