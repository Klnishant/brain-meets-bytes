"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef, use, useMemo } from "react";
import { NAV_LINKS, COLORS } from "@/lib/constants";
import { Sign } from "crypto";
import SignupCard from "../authentication/SignupCard";
import SignInCard from "../authentication/SignInCard";
import MembershipCard from "../authentication/MembershipCard";
import { getUser } from "@/lib/getUser";
import { clear, profile } from "console";
import { ChevronDown, LogOut, Router, SquarePen, User } from "lucide-react";
import { getAuth } from "@/lib/getAuth";
import { set } from "sanity";
import ResetPasswordCard from "../authentication/ResetPasswordCard";
import ForgotPasswordCard from "../authentication/ForgotPasswordCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/Redux/store";
import { clearAuth, fetchAuth } from "@/Redux/slices/AuthSlice";
import UpdateProfile from "../authentication/UpdateProfile";
import { closeMembership, openMembership, toggleMembership } from "@/Redux/slices/MemberShipSlice";
import { closeLogIn, openLogIn } from "@/Redux/slices/LogInSlice";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  RoleId: number;
  Rolename: string;
  hasmembership: boolean;
  userId: number;
  ProfilePic: string;
};

type profileDropdownProp = {
  user: User | null;
  onLogout: () => void;
  onMembership: (open: boolean) => void;
  handleUpdate: () => void;
};

const linkToHref = (label: string) => {
  if (label === "Home") return "/";
  if (label === "About Us") return "/about";
  const slug = label.toLowerCase().replace(/\s+/g, "-");
  return `/${slug}`;
};

const ProfileDropdown: React.FC<profileDropdownProp> = ({
  user,
  onLogout,
  onMembership,
  handleUpdate,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-full bg-gradient-to-r from-[#D62828] to-[#701515]
 px-4 py-2 text-white shadow-md hover:bg-[#9E0F22] transition"
      >
        <div className="relative h-[34px] w-[34px] border-[2px] bg-[#FAF9F8]  overflow-hidden rounded-full">
          <img src={user?.ProfilePic} className="h-full w-full object-cover" />
        </div>

        <span
          className="font-sora font-bold text-[#FAF9F8] text-[20px] leading-[30px] tracking-normal
"
        >
          {user?.name}
        </span>

        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden z-50">
          <div className="px-4 py-3 border-b">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-gray-900">
                {user?.name}
              </p>
              <p className="text-sm font-semibold text-[#D62828]">
                <span className="text-gray-900">{"Role: "}</span>
                {user?.RoleId === 2 ? "Admin" : "User"}
              </p>
              <button
                onClick={handleUpdate}
                className={`w-4 h-4 text-[#505050]`}
              >
                <SquarePen
                  className={`w-4 h-4 text-[#505050]`}
                />
              </button>
            </div>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>

          <div className="flex flex-col gap-3">
            {/* Saved Pages */}
            <div>
              <Link
                href="/forums/MySavedThreads"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700"
              >
                My Saved Threads
              </Link>
              <Link
                href="/articles/MySavedArticle"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700"
              >
                My Saved Articles
              </Link>
              <Link
                href="/podcasts/MySavedPodcast"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700"
              >
                My Saved Episodes
              </Link>
              <Link
                href="/forums/Thread/GetReports"
                className={`flex items-center gap-3 px-4 py-2 text-sm text-gray-700 ${user?.RoleId === 2 ? "block" : "hidden"}`}
              >
                Reported Threads
              </Link>
              <Link
                href="/admin/createCategory"
                className={`flex items-center gap-3 px-4 py-2 text-sm text-gray-700 ${user?.RoleId === 2 ? "block" : "hidden"}`}
              >
                Create Category
              </Link>
            </div>

            {/* Membership */}
            <button
              className="w-fit flex justify-center items-center px-2 py-2  rounded-full text-xs md:text-sm  text-[#F9FAFB] whitespace-nowrap transition duration-200 ease-out hover:bg-[#b81f1f] hover:shadow-md"
              style={{ backgroundColor: COLORS.brandRed }}
              onClick={() => onMembership(true)}
            >
              Become a member
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isForumsPage = pathname === "/forums";
  const [openSignUp, setOpenSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAuth());
  },[]);

  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setToken(auth?.auth?.token);
    setUserId(auth?.auth?.userId);
  }, [auth]);

  useEffect(() => {
    const user = async () => {
      if (!token) return;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/one?userId=${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const data = await res.json();

      if (res.ok) {
        setUser(data?.data);
      }
    };
    user();
  }, [token]);

  const openMemberships = useSelector(
    (state: RootState) => state.membership.openMembership,
  );

  const openLogin = useSelector(
    (state: RootState) => state.login.openLogIn,
  );

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
    });
    console.log(res);

    if (res.ok) {
      setIsLoggedIn(false);
      setUser(null);
      window.location.reload();
    }
  };

  const handleUpdate = (data: User) => {
    setUser(data);
  };

  const handleOpenUpdate = () => {
    setOpenUpdate((prev) => !prev);
  };

  return (
    <header
      className={`w-full ${
        isForumsPage ? "absolute left-0 top-0 z-20" : "relative"
      }`}
    >
      <div className="mx-auto flex md:items-center gap-4 px-4 py-4 sm:px-6 lg:gap-8  lg:py-6">
        {/* Logo - fixed on the left */}
        <Link href="/" className="shrink-0">
          <img
            src={isForumsPage ? "/logo-white.png" : "/logo.png"}
            alt="Logo"
            className="h-10 md:h-14 w-auto object-contain"
          />
        </Link>

        {/* Middle + Right content group */}
        <div className="hidden flex-1 lg:flex items-center justify-between">
          {/* Nav Links */}
          <nav
            className={`flex items-center lg:gap-4 static shadow-md md:shadow-none z-10`}
          >
            {NAV_LINKS.map((link) => {
              const href = linkToHref(link);
              const isActive =
                (href === "/" && pathname === "/") ||
                (href !== "/" && pathname.startsWith(href));

              return (
                <Link
                  key={link}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`transition-colors ${
                    isActive
                      ? "text-[#D62828] font-semibold"
                      : isForumsPage
                        ? "text-white opacity-70 hover:opacity-100 hover:text-[#D62828]"
                        : "text-[#1E293B] opacity-50 hover:opacity-100 hover:text-[#D62828]"
                  }`}
                >
                  {link}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT SIDE — Search + Membership + Login (desktop) */}
          <div className="flex items-center gap-3 lg:gap-6 shrink-0">
            {/* Search with hover expand animation */}
            <button
              className="group flex items-center gap-2 rounded-full text-xs md:text-sm lg:text-base overflow-hidden transition-all duration-300 ease-out w-12 px-3.5 py-3 hover:w-40"
              style={{
                backgroundColor: COLORS.badgeBg,
                color: COLORS.brandMutedText,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 shrink-0"
                style={{ color: COLORS.brandMutedText }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
                />
              </svg>
              <span className="whitespace-nowrap opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-left">
                Search
              </span>
            </button>

            {/* Membership */}
            <button
              className={`${users ? "hidden" : ""} flex justify-center items-center px-4 lg:px-6 py-2 lg:py-3 rounded-full text-xs md:text-sm lg:text-base text-[#F9FAFB] whitespace-nowrap transition duration-200 ease-out hover:bg-[#b81f1f] hover:shadow-md hover:-translate-y-0.5`}
              style={{ backgroundColor: COLORS.brandRed }}
              onClick={() => dispatch(openMembership())}
            >
              Become a member
            </button>

            {/* Login */}
            {!users ? (
              <button
                className="hidden md:flex justify-center items-center px-4 lg:px-6 py-2 lg:py-3 border rounded-full text-xs md:text-sm lg:text-base whitespace-nowrap"
                onClick={() => dispatch(openLogIn())}
                style={
                  isForumsPage
                    ? {
                        borderColor: COLORS.white,
                        color: COLORS.white,
                      }
                    : {
                        borderColor: COLORS.brandNavy,
                        color: COLORS.brandNavy,
                      }
                }
              >
                Login
              </button>
            ) : (
              <div>
                <ProfileDropdown
                  user={users}
                  onLogout={handleLogout}
                  onMembership={(open: boolean) => dispatch(openMembership())}
                  handleUpdate={handleOpenUpdate}
                />
              </div>
            )}
          </div>
        </div>

        {/* Hamburger Menu Button (mobile) */}
        <div className="fixed top-2 left-0 right-0 z-50 flex lg:hidden items-start justify-end pointer-events-auto">
          <div className="w-full flex justify-end mr-1">
            {/* Search with hover expand animation */}
            <button
              className="group flex items-center px-2.5 gap-2 rounded-full text-xs md:text-sm lg:text-base overflow-hidden transition-all duration-300 ease-out w-9 h-9 lg:h-auto lg:w-12 hover:w-40"
              style={{
                backgroundColor: COLORS.badgeBg,
                color: COLORS.brandMutedText,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 shrink-0"
                style={{ color: COLORS.brandMutedText }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
                />
              </svg>
              <span className="whitespace-nowrap opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-left">
                Search
              </span>
            </button>
          </div>
          <div
            className={`${isOpen ? "bg-[#FAF9F8] border border-[#E2E8F0]  rounded-xl" : "bg-none"}  px-4 py-2`}
          >
            <button
              className={`lg:hidden focus:outline-none w-full flex justify-end ${isForumsPage && !isOpen ? "text-white" : "text-slate-800"}`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
            {/* Middle + Right content group */}
            <div
              className={`flex-1 flex flex-col items-center justify-between ${isOpen ? "block" : "hidden"}`}
            >
              {/* Nav Links */}
              <nav
                className={`flex flex-col items-center gap-5 md:gap-6 ${
                  isOpen ? "flex" : "hidden"
                }  z-10`}
              >
                {NAV_LINKS.map((link) => {
                  const href = linkToHref(link);
                  const isActive =
                    (href === "/" && pathname === "/") ||
                    (href !== "/" && pathname.startsWith(href));

                  return (
                    <Link
                      key={link}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={`transition-colors ${
                        isActive
                          ? "text-[#D62828] font-semibold"
                          : "text-[#1E293B] opacity-50 hover:opacity-100 hover:text-[#D62828]"
                      }`}
                    >
                      {link}
                    </Link>
                  );
                })}
              </nav>

              {/* RIGHT SIDE — Search + Membership + Login (desktop) */}
              <div className="flex flex-col items-center gap-3 lg:gap-6 shrink-0 mt-5">
                {/* Membership */}
                <button
                  className={`${users ? "hidden" : ""} flex justify-center items-center px-4 lg:px-6 py-2 lg:py-3 rounded-full text-xs md:text-sm lg:text-base text-[#F9FAFB] whitespace-nowrap transition duration-200 ease-out hover:bg-[#b81f1f] hover:shadow-md hover:-translate-y-0.5`}
                  style={{ backgroundColor: COLORS.brandRed }}
                  onClick={() => dispatch(openMembership())}
                >
                  Become a member
                </button>

                {/* Login */}
                {!users ? (
                  <button
                    className="flex justify-center items-center px-4 lg:px-6 py-2 lg:py-3 border rounded-full text-xs md:text-sm lg:text-base whitespace-nowrap"
                    onClick={() => dispatch(openLogIn())}
                    style={{
                      borderColor: COLORS.brandNavy,
                      color: COLORS.brandNavy,
                    }}
                  >
                    Login
                  </button>
                ) : (
                  <div>
                    <ProfileDropdown
                      user={users}
                      onLogout={handleLogout}
                      onMembership={(open: boolean) => dispatch(toggleMembership())}
                      handleUpdate={handleOpenUpdate}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SignIn Modal */}
      {openLogin && (
        <SignInCard
          onClose={() => dispatch(closeLogIn())}
          handleSignup={() => {
            dispatch(closeLogIn());
            setOpenSignUp(true);
          }}
          handleIsLoggedIn={() => {
            setIsLoggedIn(true);
            router.refresh();
          }}
          handleForgetPassword={() => {
            dispatch(closeLogIn());
            setOpenForgotPassword(true);
          }}
        />
      )}

      {/* SignUp Modal */}
      {openSignUp && (
        <SignupCard
          onClose={() => setOpenSignUp(false)}
          handleSignIn={() => {
            setOpenSignUp(false);
            dispatch(openLogIn());
          }}
        />
      )}

      {/* Membership Modal */}
      {openMemberships && (
        <MembershipCard 
        onClose={() => dispatch(closeMembership())}
        handleSignIn={() => {
            dispatch(closeMembership());
            dispatch(openLogIn());
          }}
         />
      )}

      {/* Reset Password Modal */}
      {openResetPassword && (
        <ResetPasswordCard
          onClose={() => setOpenResetPassword(false)}
          handleSignIn={() => {
            setOpenResetPassword(false);
            dispatch(openLogIn());
          }}
        />
      )}

      {/* Forgot Password Modal */}
      {openForgotPassword && (
        <ForgotPasswordCard
          onClose={() => setOpenForgotPassword(false)}
          handleResetPassword={() => {
            setOpenForgotPassword(false);
            setOpenResetPassword(true);
          }}
        />
      )}

      {/* Update Profile Modal */}
      {openUpdate && (
        <UpdateProfile
        name={users?.name ?? null}
        email={users?.email ?? null}
        ProfilePic={users?.ProfilePic ?? null}
          onClose={handleOpenUpdate}
          userId={Number(users?.userId)}
          handleUpdate={handleUpdate}
        />
      )}
    </header>
  );
};

export default Navbar;
