"use client";

import Footer from "@/components/core/Footer";
import Navbar from "@/components/core/Navbar";
import { PortableText, PortableTextReactComponents } from "next-sanity";
import { useEffect, useState } from "react";
import { TypedObject } from "sanity";

type FooterContent = {
    privacyPolicy: TypedObject[];
};

const components: Partial<PortableTextReactComponents> = {
  block: {
    h2: ({ children }) => <h2 className="mt-4 mb-1 text-lg font-semibold">{children}</h2>,
    normal: ({ children }) => <p className="mb-1 leading-relaxed ">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc ml-5 space-y-1">{children}</ul>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
  },
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
            Privay Policy
          </h1>
          <div className="text-[#505050] prose mx-auto p-6">
            {(content?.privacyPolicy && (
              <PortableText value={content?.privacyPolicy } components={components} />
            )) ?? (
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Est aut eveniet quam adipisci perspiciatis nesciunt tempora minima, iste suscipit possimus non nulla voluptas fuga repellat voluptate sit officiis quae illum unde optio dolores quo nostrum? Earum cupiditate repellat quae odit architecto nesciunt magnam quibusdam? Quidem veniam ut enim voluptate veritatis. Cupiditate animi veniam explicabo assumenda dignissimos molestiae sint, a, temporibus dolores nihil natus non magni ad tempora, sapiente odio quia maiores odit ipsam! Culpa quis deserunt quidem accusantium fugiat consequatur quos suscipit, veniam rerum nam libero minima sit reprehenderit? Quae ipsam atque delectus doloribus saepe! A dignissimos laboriosam eveniet cupiditate doloremque quos illum dolore facilis, maxime magni accusantium voluptas perferendis iste quisquam enim inventore dolorem vitae vel ut. Laboriosam voluptas amet cum alias ipsum debitis illo pariatur unde vero quo, minus ducimus quam earum illum magnam nostrum repudiandae adipisci voluptatem delectus veritatis vel eligendi reiciendis. Quos, dolores distinctio. Asperiores, natus. Cumque eveniet ea veritatis consequuntur vero, amet, placeat quod earum libero rem aspernatur molestias blanditiis eaque harum quibusdam dicta assumenda fuga unde dolorum repellendus dolore, quo cupiditate? Fuga quae repudiandae tempora odit iusto commodi voluptas, nostrum ipsum nemo. Error perspiciatis saepe tenetur aperiam impedit ad aliquam accusantium distinctio autem ex!</p>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default RefundPolicy;
