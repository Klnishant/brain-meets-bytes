"use client";

import { X, Mic, FileText, MessageCircle, Star } from "lucide-react";

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
    red: "border-red-500 bg-red-50 text-red-600",
    green: "border-green-600 bg-green-50 text-green-700",
    cyan: "border-cyan-500 bg-cyan-50 text-cyan-600",
    purple: "border-purple-600 bg-purple-50 text-purple-600",
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
}: {
  onClose?: () => void;
}) => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-50">

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

            <button className="mt-8 rounded-full bg-[#D62828] px-8 py-3 text-[#FAF9F8] font-semibold hover:bg-red-700 transition">
              Join Membership
            </button>

            <p className="mt-4 font-inter font-weight-[400] text-[18px] text-[#505050]">
              Already a member?{" "}
              <span className="cursor-pointer text-[#D62828]">
                Sign in
              </span>
            </p>
          </div>

          {/* RIGHT FEATURES */}
          <div className="relative">
            <div className=" absolute z-0 w-[740px] h-[750px] -top-30 -left-10">
                <img src="./article-bg.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative space-y-5">

            <FeatureCard
              icon={<Mic />}
              title="Member Exclusive Episodes"
              color="red"
              align="left"
            />

            <FeatureCard
              icon={<FileText />}
              title="Member Exclusive Articles"
              color="green"
              align="right"
            />

            <FeatureCard
              icon={<MessageCircle />}
              title="Private Forum Access"
              color="cyan"
              align="left"
            />

            <FeatureCard
              icon={<Star />}
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