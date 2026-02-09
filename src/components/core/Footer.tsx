"use client";

import { NAV_LINKS } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const linkToHref = (label: string) => {
  if (label === "Home") return "/";
  if (label === "About Us") return "/about";
  const slug = label.toLowerCase().replace(/\s+/g, "-");
  return `/${slug}`;
};

type FooterContent = {
  description: string;
  phone: string;
  email: string;
  address: string;
  instalink: string;
  facebooklink: string;
  youtubelink: string;
  linkedinlink: string;
};

const FALL_BACK_CONTENT: FooterContent = {
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae hendrerit lectus. Praesent vitae consequat mi. Maecenas auctor sed sapien ut bibendum. Nam in viverra justo.",
  phone: "(123) 456-7890",
  email: "O0Bt9@example.com",
  address: "123 Main Street, Anytown, USA",
  instalink: "",
  facebooklink: "",
  youtubelink: "",
  linkedinlink: "",
};

const Footer = () => {
  const [content, setContent] = useState<FooterContent | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetch("/api/footer");
        if (!res.ok) {
          throw new Error("Failed to load articles");
        }

        const data = (await res.json()) as FooterContent | null;
        if (!mounted) return;
        setContent(data);
      } catch (e: any) {
        if (!mounted) return;
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);
  return (
    <footer className="w-full bg-white shadow-md">
      <div className=" mx-auto px-4 sm:px-6 lg:px-16 py-12 md:py-16 flex flex-col gap-10 md:gap-14">
        {/* Top section: columns */}
        <div className="flex flex-col gap-10 lg:gap-0 md:flex-row md:items-start md:justify-between">
          {/* About / logo */}
          <div className="w-full md:max-w-sm flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <img
                src="/logo.png"
                alt="Brain Meets Bytes logo"
                className="w-44 h-auto object-contain"
              />
              <p className="font-inter text-sm md:text-base leading-7 text-[#505050] max-w-md">
                {content?.description ?? FALL_BACK_CONTENT.description}
              </p>
            </div>
          </div>

          {/* Menu */}
          <div className="w-full md:w-auto flex flex-col gap-6 ml-5">
            <h3 className="font-sora text-lg md:text-xl font-bold text-[#1E293B]">
              Menu
            </h3>
            <nav className="flex flex-col gap-4 font-inter text-sm md:text-base">
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
                    className={`transition-colors font-inter text-sm md:text-base text-[#505050] ${
                      isActive ? "text-[#D62828] font-semibold" : ""
                    }`}
                  >
                    {link}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Important */}
          <div className="w-full md:w-auto flex flex-col gap-6 ml-5">
            <h3 className="font-sora text-lg md:text-xl font-bold text-[#1E293B]">
              Important
            </h3>
            <div className="flex flex-col gap-3 font-inter text-sm md:text-base text-[#505050]">
              <Link href={'/RefundPolicy'}><span>Refund Policy</span></Link>
              <Link href={'/PrivacyPolicy'}><span>Privacy Policy</span></Link>
              <Link href={'/terms-conditions'}> <span>Terms &amp; Conditions</span> </Link>
              <Link href={'/forum-terms'}><span>Forum terms</span></Link>
            </div>
          </div>

          {/* Contact */}
          <div className="w-full md:w-auto flex flex-col gap-6 ml-5">
            <h3 className="font-sora text-lg md:text-xl font-bold text-[#1E293B]">
              Contact
            </h3>
            <div className="flex flex-col gap-4 font-inter text-sm md:text-base text-[#505050]">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center">
                  <img
                    src="/phone.png"
                    alt="Phone"
                    className="w-3.5 h-3.5 object-contain"
                  />
                </div>
                <span>{content?.phone ?? FALL_BACK_CONTENT.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center">
                  <img
                    src="/email.png"
                    alt="Email"
                    className="w-3.5 h-3.5 object-contain"
                  />
                </div>
                <span>{content?.email ?? FALL_BACK_CONTENT.email}</span>
              </div>
              {/* <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center mt-1">
                  <img
                    src="/location.png"
                    alt="Location"
                    className="w-3.5 h-3.5 object-contain"
                  />
                </div>
                <span>{content?.address ?? FALL_BACK_CONTENT.address}</span>
              </div> */}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full" style={{ backgroundColor: "#D62828" }} />

        {/* Bottom: Follow us + socials */}
        <div className="flex flex-row items-center justify-between gap-6">
          <h3 className="font-sora text-lg md:text-xl font-bold text-[#1E293B]">
            Follow us
          </h3>

          <div className="flex items-center gap-3 md:gap-6">
            {[
              { name: "instagram", url: content?.instalink },
              { name: "facebook", url: content?.facebooklink },
              { name: "youtube", url: content?.youtubelink },
              { name: "linkedin", url: content?.linkedinlink },
            ].map(({ name, url }) => {
              const isDisabled = !url;

              const IconButton = (
                <button
                  aria-label={name}
                  disabled={isDisabled}
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center bg-[#F5F5F5] shadow-inner hover:scale-105 transition
        `}
                >
                  <img
                    src={`/${name}.png`}
                    alt={name}
                    className="w-6 h-6 object-contain"
                  />
                </button>
              );

              return isDisabled ? (
                <div key={name}>{IconButton}</div>
              ) : (
                <Link
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {IconButton}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;