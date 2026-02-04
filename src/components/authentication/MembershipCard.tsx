"use client";

import { getUser } from "@/lib/getUser";
import { X, Mic, FileText, MessageCircle, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

/* Feature Card Component */
const FeatureCard =({
  icon,
  title,
  color,
  align,
}: {
  icon: React.ReactNode;
  title: string;
  color: "red" | "green" | "cyan" | "purple";
  align: "left" | "right";
}) => {
  const colorMap = {
    red: "border border-[#D62828] bg-gradient-to-r from-[#FFDEDE] to-[#FAF9F8] text-[#D62828]",
    green: "border border-[#00692C] bg-gradient-to-r from-[#E0FFED] to-[#FAF9F8] text-[#00692C]",
    cyan: "border border-[#0099A4] bg-gradient-to-r from-[#D8FCFF] to-[#FAF9F8]  text-[#0099A4]",
    purple: "border border-[#4F00A4] bg-gradient-to-r from-[#E7D0FF] to-[#FAF9F8] text-[#4F00A4]",
  };

  return (
    <div
      className={`w-[258px] flex items-center gap-4 rounded-2xl border px-4 ${colorMap[color]} ${
        align === "left" ? "justify-self-start" : "justify-self-end"
      }`}
    >
      <div className="flex h-15 w-15 items-center justify-center rounded-full">
        {icon}
      </div>
      <span className="font-semibold text-sm">{title}</span>
    </div>
  );
}


const MembershipCard = ({
  onClose,
  handleSignIn,
}: {
  onClose?: () => void;
  handleSignIn?: () => void;
}) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
    useEffect(() => {
      const fetchUser = async () => {
        const user = await getUser();
        setUser(user);
      };
      fetchUser();
    }, []);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl rounded-[48px] bg-white p-10 shadow-xl overflow-hidden">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute z-40 right-6 top-6 rounded-full border border-[#E2E8F0] bg-gray-100 p-2 hover:bg-gray-200"
        >
          <X size={18} className="text-[#023047]" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-50">

          {/* LEFT CONTENT */}
          <div className="w-[511px]">
            <h2 className="text-4xl font-sora font-bold text-[#1E293B] leading-tight">
              Become a <span className="text-[#D62828]">Member</span> of Brain
              <br /> Meets Bytes
            </h2>

            <p className="mt-5 font-inter font-weight-[400] text-[#505050] text-[18px] leading-relaxed">
              Unlock deeper insights, exclusive conversations, and a community
              dedicated to smarter brain health and longevity.
            </p>

            <p className="mt-4 font-inter font-weight-[500] text-[18px] text-[#505050]">
              Cancel anytime · No spam · Evidence-based content only
            </p>

            <Link href={'/checkout'}>
              <button className="mt-8 rounded-full bg-[#D62828] px-8 py-3 text-[#FAF9F8] font-semibold hover:bg-red-700 transition">
              Join Membership
            </button>
            </Link>

            {
              !user && (
                <p className="mt-4 font-inter font-weight-[400] text-[18px] text-[#505050]">
              Already a member?{" "}
              <span
                onClick={handleSignIn}
               className="cursor-pointer text-[#D62828]">
                Sign in
              </span>
            </p>
              )
            }
          </div>

          {/* RIGHT FEATURES */}
          <div className="relative">
            <div className=" absolute z-0 w-[790px] h-[800px] -top-45 -left-12">
                <img src="/article-bg.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative space-y-5">

            <FeatureCard
              icon={<img src="/podcast-bold.png" alt=""  />}
              title="Member Exclusive Episodes"
              color="red"
              align="left"
            />

            <FeatureCard
              icon={<img src="/articles-rtl.png" alt="" />}
              title="Member Exclusive Articles"
              color="green"
              align="right"
            />

            <FeatureCard
              icon={<img src="/healthicons_forum.png" alt="" />}
              title="Private Forum Access"
              color="cyan"
              align="left"
            />

            <FeatureCard
              icon={<img src="/feature-highlight.png" alt="" />}
              title="Early Access to New Features"
              color="purple"
              align="right"
            />
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipCard;