"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS, COLORS } from "@/lib/constants";
import { Sign } from "crypto";
import SignupCard from "../authentication/SignupCard";
import SignInCard from "../authentication/SignInCard";
import MembershipCard from "../authentication/MembershipCard";
import { getUser } from "@/lib/getUser";

const linkToHref = (label: string) => {
  if (label === "Home") return "/";
  if (label === "About Us") return "/about";
  const slug = label.toLowerCase().replace(/\s+/g, "-");
  return `/${slug}`;
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isForumsPage = pathname === "/forums";
  const [openLogIn, setOpenLogIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openMembership, setOpenMembership] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      setUser(user);
      setIsLoggedIn(user);
    };
    fetchUser();
  }, []);

  const handleLogout = async() => {
   const res = await fetch("/api/auth/logout", {
  method: "POST"
 });
 console.log(res);
 
  if (res.ok) {
    setIsLoggedIn(false);
    setUser(null);
  }
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
              style={{ backgroundColor: COLORS.badgeBg, color: COLORS.brandMutedText }}
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
              className=" flex justify-center items-center px-4 lg:px-6 py-2 lg:py-3 rounded-full text-xs md:text-sm lg:text-base text-[#F9FAFB] whitespace-nowrap transition duration-200 ease-out hover:bg-[#b81f1f] hover:shadow-md hover:-translate-y-0.5"
              style={{ backgroundColor: COLORS.brandRed }}
              onClick={()=> setOpenMembership(true)}
            >
              Become a member
            </button>

            {/* Login */}
            {
              !user ? (
                <button
              className="hidden md:flex justify-center items-center px-4 lg:px-6 py-2 lg:py-3 border rounded-full text-xs md:text-sm lg:text-base whitespace-nowrap"
              onClick={() => setOpenLogIn(true)}
              style={isForumsPage? {
                borderColor: COLORS.white,
                color: COLORS.white,
              } :{
                borderColor: COLORS.brandNavy,
                color: COLORS.brandNavy,
              } }
            >
              Login
            </button>
              ) : (
                <button
              className="flex justify-center items-center px-4 lg:px-6 py-2 lg:py-3 border rounded-full text-xs md:text-sm lg:text-base whitespace-nowrap"
              style={isForumsPage? {
                borderColor: COLORS.white,
                color: COLORS.white,
              } :{
                borderColor: COLORS.brandNavy,
                color: COLORS.brandNavy,
              } }
              onClick={handleLogout}
            >
              Logout
            </button>
              )
            }
          </div>
        </div>
            
        {/* Hamburger Menu Button (mobile) */}
        <div className="fixed top-2 left-0 right-0 z-50 flex lg:hidden items-start justify-end pointer-events-auto"
>
        <div className="w-full flex justify-end mr-1">
          {/* Search with hover expand animation */}
            <button
              className="group flex items-center px-2.5 gap-2 rounded-full text-xs md:text-sm lg:text-base overflow-hidden transition-all duration-300 ease-out w-9 h-9 lg:h-auto lg:w-12 hover:w-40"
              style={{ backgroundColor: COLORS.badgeBg, color: COLORS.brandMutedText }}
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
          <div className={`${isOpen ? "bg-[#FAF9F8] border border-[#E2E8F0]  rounded-xl" : "bg-none"}  px-4 py-2`}>
            <button
          className={`lg:hidden focus:outline-none w-full flex justify-end ${
            "text-slate-800"
          }`}
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
                isOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
        {/* Middle + Right content group */}
        <div className={`flex-1 flex flex-col items-center justify-between ${isOpen ? "block" : "hidden"}`}>
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
              className="flex justify-center items-center px-4 lg:px-6 py-2 lg:py-3 rounded-full text-xs md:text-sm lg:text-base text-[#F9FAFB] whitespace-nowrap transition duration-200 ease-out hover:bg-[#b81f1f] hover:shadow-md hover:-translate-y-0.5"
              style={{ backgroundColor: COLORS.brandRed }}
              onClick={()=> setOpenMembership(true)}
            >
              Become a member
            </button>

            {/* Login */}
            {
              !user ? (
                <button
              className="flex justify-center items-center px-4 lg:px-6 py-2 lg:py-3 border rounded-full text-xs md:text-sm lg:text-base whitespace-nowrap"
              onClick={() => setOpenLogIn(true)}
              style={{
                borderColor: COLORS.brandNavy,
                color: COLORS.brandNavy,
              } }
            >
              Login
            </button>
              ) : (
                <button
              className="flex justify-center items-center px-4 lg:px-6 py-2 lg:py-3 border rounded-full text-xs md:text-sm lg:text-base whitespace-nowrap"
              style={{
                borderColor: COLORS.brandNavy,
                color: COLORS.brandNavy,
              } }
              onClick={()=>(setIsLoggedIn(false))}
            >
              Logout
            </button>
              )
            }
          </div>
          </div>
          </div>
        </div>
      </div>

      {/* SignIn Modal */}
      {openLogIn && (
        <SignInCard 
        onClose={() => setOpenLogIn(false)} handleSignup={() => {
          setOpenLogIn(false);
          setOpenSignUp(true);
        }} 
        handleIsLoggedIn={() => setIsLoggedIn(true)}
        />
      )}

      {/* SignUp Modal */}
      {openSignUp && (
        <SignupCard onClose={() => setOpenSignUp(false)} 
        handleSignIn={() => {
          setOpenSignUp(false);
          setOpenLogIn(true);
        }}
        />
      )}

      {/* Membership Modal */}
      {openMembership && (
        <MembershipCard onClose={() => (setOpenMembership(false))} />
      )}
      
    </header>
  );
};

export default Navbar;
