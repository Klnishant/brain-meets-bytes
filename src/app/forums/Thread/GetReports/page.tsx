"use client";

import Footer from "@/components/core/Footer";
import Navbar from "@/components/core/Navbar";
import ThreadsCard from "@/components/forums/ThreadsCard";
import { getAuth } from "@/lib/getAuth";
import {
  AlertTriangle,
  Calendar,
  Loader,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { set } from "sanity";
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

type ReportThread = {
  ThreadId: number;
  reason: string;
  createdAt: string;
  thread: {
    title: string;
    content: string;
    reportsCount: number;
  };
  reportedBy: {
    userId: number;
    name: string;
    email: string;
  };
};

type ReportedThreadCardProps = {
  report: ReportThread;
  handleDelete: (
    e: React.MouseEvent<HTMLButtonElement>,
    ThreadId: number,
  ) => void;
  handleDismissReport: (
    e: React.MouseEvent<HTMLButtonElement>,
    ThreadId: number,
    userId: number,
  ) => void;
  isDeleting: boolean;
  isDismissed: boolean;
};

const ReportedThreadCard: React.FC<ReportedThreadCardProps> = ({
  report,
  handleDelete,
  handleDismissReport,
  isDeleting,
  isDismissed,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchAuth = async () => {
      const auth = await getAuth();
      if (auth) {
        setToken(auth.token);
        setUserId(auth.userId);
      }
    };
    fetchAuth();
  }, []);

  const formatDate = (dateString = report?.createdAt) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getReasonColor = (reason = report?.reason) => {
    const colors: { [key: string]: string } = {
      spam: "bg-orange-100 text-orange-700 border-orange-200",
      harassment: "bg-red-100 text-red-700 border-red-200",
      inappropriate: "bg-purple-100 text-purple-700 border-purple-200",
      default: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[reason] || colors.default;
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 overflow-hidden">
      {/* Header with Report Count Badge */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {report?.thread?.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Thread ID: #{report?.ThreadId}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow-sm">
              {report?.thread?.reportsCount}{" "}
              {report?.thread?.reportsCount === 1 ? "Report" : "Reports"}
            </span>
          </div>
        </div>
      </div>

      {/* Thread Content */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="flex items-start gap-2">
          <MessageSquare className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
            {report?.thread?.content}
          </p>
        </div>
      </div>

      {/* Report Details */}
      <div className="px-6 py-4 space-y-4">
        {/* Reason Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Reason:</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getReasonColor(report?.reason)}`}
          >
            {report?.reason?.charAt(0).toUpperCase() + report?.reason.slice(1)}
          </span>
        </div>

        {/* Reported By Section */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <p className="text-xs font-semibold text-blue-900 mb-3">
            Reported By
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {report?.reportedBy?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-sm text-gray-700">
                {report?.reportedBy?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-200">
          <Calendar className="w-3.5 h-3.5" />
          <span>Reported on {formatDate(report?.createdAt)}</span>
        </div>
      </div>
      {/* Action Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
        <Link
          href={`/forums/${report?.ThreadId}`}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 text-center"
        >
          Review Thread
        </Link>
        <button
          disabled={isDeleting}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            handleDelete(e, report?.ThreadId)
          }
          className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
        >
          {isDeleting ? (
            <div className="flex w-full items-center justify-center">
              <Loader className="text-white animate-spin" />
            </div>
          ) : (
            "Delete Thread"
          )}
        </button>
        <button 
        onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
          handleDismissReport(e, report?.ThreadId, report?.reportedBy?.userId)
        }
        disabled={isDismissed}
        className="flex-1 px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-lg border border-gray-300 transition-colors duration-200">
          {isDismissed ? (
            <div className="flex w-full items-center justify-center">
              <Loader className="text-black animate-spin" />
            </div>
          ) : (
            "Dismiss Report"
          )}
        </button>
      </div>
    </div>
  );
};

const MySavedThreads = () => {
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [threads, setThreads] = useState<ReportThread[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [deleting, setIsDeleting] = useState(false);
  const [dismissed, setIsDismissed] = useState(false);

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

  const fetchThreads = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}threads/getReports`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to load threads");
      }

      const data = (await res.json())?.data as ReportThread[];

      console.log(data);

      const fetchedThreads = Array.isArray(data) ? data : [];
      setThreads(fetchedThreads);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load threads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [token, page]);

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement>,
    ThreadId: number,
  ) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}threads?ThreadId=${ThreadId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!res?.ok) {
        toast.error("Failed to delete thread");
        throw new Error("Failed to delete thread");
      }
      if (res.ok) {
        toast.success("Thread deleted successfully!");
        setThreads((prev) =>
          prev.filter((thread) => thread?.ThreadId !== ThreadId),
        );
      }
    } catch (error: any) {
      console.log(error?.message, "Failed to delete thread");
      toast.error("Failed to delete thread");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDismissReport = async (
    e: React.MouseEvent<HTMLButtonElement>,
    ThreadId: number,
    userId: number,
  ) => {
    try {
      e.preventDefault();
      setIsDismissed(true);
      const data = { ThreadId, userId };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}threads/deleteReport`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );
      if (res.ok) {
        toast.success("Report dismissed successfully!");
        setThreads((prev) =>
          prev.filter((thread) => thread?.ThreadId !== ThreadId),
        );
      }
      else {
        throw new Error("Failed to dismiss report");
      }
    } catch (error: any) {
      console.log(error?.message, "Failed to dismiss report");
      toast.error("Failed to dismiss report");
    } finally {
      setIsDismissed(false);
    }
  };
  const onEdit = (data: Thread) => {
    console.log(data);
  };
  return (
    <main className="min-h-screen bg-[#FAF9F8] relative">
      <Navbar />
      <section className="w-full bg-[#FAF9F8] pb-24 pt-10 md:pb-28 md:pt-16 min-h-screen">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-4 sm:px-6 lg:px-16">
          <h1 className="font-sora text-[34px] leading-[44px] text-[#1E293B] md:text-[48px] md:leading-[60px] lg:text-[56px] lg:leading-[71px]">
            Reported Threads
          </h1>
          <p className="max-w-[875px] font-inter text-[16px] leading-[26px] text-[#505050] md:text-[18px] md:leading-[28px]">
            Here you can find your reported threads
          </p>
          {loading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse"
                >
                  {/* Header Section */}
                  <div className="bg-gray-300 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {/* Alert Icon Skeleton */}
                        <div className="w-6 h-6 bg-gray-300 rounded"></div>

                        <div className="flex-1">
                          {/* Title Skeleton */}
                          <div className="h-6 bg-gray-300 rounded w-2/3 mb-2"></div>
                          {/* Thread ID Skeleton */}
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>

                      {/* Reports Badge Skeleton */}
                      <div className="h-7 w-24 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-start gap-2">
                      {/* Message Icon Skeleton */}
                      <div className="w-4 h-4 bg-gray-300 rounded mt-1"></div>

                      {/* Content Text Skeleton */}
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                        <div className="h-4 bg-gray-300 rounded w-4/5"></div>
                      </div>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="px-6 py-4 space-y-4">
                    {/* Reason Badge Skeleton */}
                    <div className="flex items-center gap-2">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                    </div>

                    {/* Reported By Section Skeleton */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>

                      <div className="space-y-3">
                        {/* User Info Skeleton */}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                            <div className="h-3 bg-gray-100 rounded w-24"></div>
                          </div>
                        </div>

                        {/* Email Skeleton */}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                          <div className="h-4 bg-gray-200 rounded w-48"></div>
                        </div>
                      </div>
                    </div>

                    {/* Timestamp Skeleton */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      <div className="h-3 bg-gray-300 rounded w-56"></div>
                    </div>
                  </div>

                  {/* Action Buttons Skeleton */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
                    <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2 ">
              {/* Threads cards */}
              {threads &&
                threads.map((thread) => (
                  <ReportedThreadCard
                    key={thread.ThreadId}
                    report={thread}
                    handleDelete={handleDelete}
                    handleDismissReport={handleDismissReport}
                    isDeleting={deleting}
                    isDismissed={dismissed}
                  />
                ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default MySavedThreads;
