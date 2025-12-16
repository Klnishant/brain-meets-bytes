'use client'
import Link from "next/link";

export default function Pagination({ current = 1, total = 10 }) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-6 py-6 select-none">
      {/* Previous Button */}
      <Link
        href={`?page=${current - 1}`}
        className={`flex items-center gap-2 px-6 py-2 rounded-full bg-[#023047] text-white text-sm font-medium shadow-md transition-all hover:opacity-90 ${
          current === 1 ? "pointer-events-none opacity-40" : ""
        }`}
      >
        <span>◀</span> Previous
      </Link>

      {/* Page Numbers */}
      <div className="flex items-center gap-4">
        {pages.map((page) => (
          <Link
            key={page}
            href={`?page=${page}`}
            className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-semibold transition-all ${
              page === current
                ? "bg-[#D62828] text-white"
                : "text-[#1E293B] hover:text-[#787c84] hover:scale-110"
            }`}
          >
            {page}
          </Link>
        ))}
      </div>

      {/* Next Button */}
      <Link
        href={`?page=${current + 1}`}
        className={`flex items-center gap-2 px-6 py-2 rounded-full bg-[#023047] text-white text-sm font-medium shadow-md transition-all hover:opacity-90 ${
          current === total ? "pointer-events-none opacity-40" : ""
        }`}
      >
        Next <span>▶</span>
      </Link>
    </div>
  );
}
