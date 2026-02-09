"use client";

import Footer from "@/components/core/Footer";
import Navbar from "@/components/core/Navbar";
import { useEffect, useState } from "react";

type FooterContent = {
  forumTerms: string;
};

const RefundPolicy = () => {
    const [content, setContent] = useState<FooterContent | null>(null);
    
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
    <main className="min-h-screen bg-[#FAF9F8]">
      <Navbar />
      <section className="w-full bg-[#FAF9F8] pb-24 pt-10 md:pb-28 md:pt-16 min-h-screen">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-4 sm:px-6 lg:px-16">
          <h1 className="font-sora text-[34px] leading-[44px] text-[#D62828] md:text-[48px] md:leading-[60px] lg:text-[56px] lg:leading-[71px]">
            Forum Terms
          </h1>
          <div>
            <p className="text-[#1E293B]">
              {content?.forumTerms ?? "Forum Terms"}
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default RefundPolicy;
