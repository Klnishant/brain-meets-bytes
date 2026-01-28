'use client';

import { COLORS } from "@/lib/constants";
import { useState } from "react";
import toast from "react-hot-toast";

const NewsletterSection = () => {
  const [email, setEmail] = useState({
    email: "",
  });
  
      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { name, value } = e.target;
        setEmail((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
      const handleSubsription = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
          const res = await fetch('/api/subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(email),
          });
          if (res.ok) {
            setEmail({ email: "" });
            toast.success('Subscribed successfully!');
          }
        } catch (error: any) {
          console.log(error?.message,"Subscription failed");
          toast.error("Subscription failed");
        }
      }
  return (
    <section className="w-full py-16 md:py-20 lg:py-24">
      <div className="mx-auto px-4 sm:px-6 lg:px-16">
        <div className="relative w-full rounded-[32px] border border-[#FCA5A5] bg-[#FAF9F8] shadow-md overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0 pointer-events-none">
            <img
              src="/newsletter-bg.jpg"
              alt="Newsletter background"
              className="w-full h-full object-cover opacity-60"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-10 px-6 md:px-12 py-10 md:py-16 lg:py-20 text-center">
            <div className="flex flex-col items-center gap-4 max-w-3xl">
              <h2 className="font-sora text-2xl md:text-4xl lg:text-5xl font-bold leading-snug text-[#1E293B]">
                Stay ahead with <span style={{ color: COLORS.brandRed }}>smarter brain</span> health
              </h2>
              <p className="font-inter text-sm md:text-base text-[#505050]">
                Subscribe to get the latest posts sent to your email.
              </p>
            </div>

            {/* Email input + send button */}
            <form
            method="post"
               noValidate
               onSubmit={handleSubsription}
             className="flex w-full max-w-xl items-center gap-4 rounded-full bg-[#E2E8F0] px-4 md:px-6 py-2 md:py-3">
              <input
                type="email"
                placeholder="Enter your Email address"
                name="email"
                value={email.email}
                onChange={handleInputChange}
                className="flex-1 bg-transparent outline-none border-none font-sora text-sm md:text-base text-[#64748B] placeholder:text-[#64748B]"
              />
              <button
                type="submit"
                className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full"
                style={{ backgroundColor: COLORS.brandRed }}
              >
                <img
                  src="/send.png"
                  alt="Send"
                  className="w-4 h-4 object-contain"
                />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
