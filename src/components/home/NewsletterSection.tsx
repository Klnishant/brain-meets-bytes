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
    <section className="w-full bg-[#FAF9F8] py-20 md:py-24 lg:py-28">
      <div className="relative mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-16" style={{ height: 730 }}>
        {/* Dark blue panel */}
        <div className="absolute left-1/2 top-[120px] w-full max-w-[calc(100%+128px)] -translate-x-1/2 overflow-hidden rounded-none bg-[#023047] shadow-[0_0_4px_rgba(0,0,0,0.2)]" style={{ height: 490 }}>
          {/* Background image overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <img
              src="/40515529_w15.jpg"
              alt="Newsletter background"
              className="h-[1037px] w-full -translate-y-[274px] object-cover opacity-20"
            />
          </div>

          {/* Centered content */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center gap-12 px-4">
            <div className="flex max-w-[1211px] flex-col items-center gap-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <h2 className="font-sora text-3xl md:text-4xl lg:text-[48px] font-bold leading-tight text-center">
                  <span style={{ color: COLORS.brandRed }}>Stay Curious.</span>{" "}
                  <span className="text-white">Stay Connected.</span>
                </h2>
                <p className="font-sora text-sm md:text-base lg:text-[18px] leading-relaxed text-center text-[#E2E8F0] max-w-[1211px]">
                  Weekly insights, highlights, and research updates — straight to your inbox.
                </p>
              </div>

              {/* Email input + send button (stacked) */}
              <form
               className="flex w-full max-w-[547px] flex-col items-center gap-4"
               method="post"
               noValidate
               onSubmit={handleSubsription}
               >
                <div className="w-full rounded-[42px] bg-[#E2E8F0] px-6 py-4">
                  <input
                    type="email"
                    name="email"
                    value={email.email}
                    onChange={handleInputChange}
                    placeholder="Enter your Email address"
                    className="w-full border-none bg-transparent font-sora text-base text-[#64748B] placeholder:text-[#64748B] outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="flex h-[44px] w-full md:w-auto min-w-[136px] items-center justify-center gap-2 rounded-[34px] px-5"
                  style={{ backgroundColor: COLORS.brandRed }}
                >
                  <span className="font-sora text-[18px] font-semibold text-white">Send</span>
                  <img src="/send.png" alt="Send" className="h-4 w-4 object-contain" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
