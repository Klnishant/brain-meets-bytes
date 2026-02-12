"use client";

import Footer from "@/components/core/Footer";
import Navbar from "@/components/core/Navbar";
import { useEffect, useState } from "react";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import { set, TypedObject } from "sanity";

type FooterContent = {
  refundPolicy: TypedObject[];
};

const components: Partial<PortableTextReactComponents> = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-4 mb-1 text-lg font-semibold">{children}</h2>
    ),
    normal: ({ children }) => (
      <p className="mb-1 leading-relaxed ">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc ml-5 space-y-1">{children}</ul>
    ),
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
  },
};


const RefundPolicy = () => {
  const [content, setContent] = useState<FooterContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
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
            Refund Policy
          </h1>
          <div className="text-[#505050] prose mx-auto p-6">
            {(content?.refundPolicy && (
              <PortableText
                value={content?.refundPolicy}
                components={components}
              />
            )) ?? (
              <div>
                <h1>Loading...</h1>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default RefundPolicy;
