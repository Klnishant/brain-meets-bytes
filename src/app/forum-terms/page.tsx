"use client";

import Footer from "@/components/core/Footer";
import Navbar from "@/components/core/Navbar";
import { PortableText, PortableTextReactComponents } from "next-sanity";
import { useEffect, useState } from "react";
import { TypedObject } from "sanity";
type FooterContent = {
  forumTerms: TypedObject[];
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
            Forum Terms
          </h1>
          <div className="text-[#505050] prose mx-auto p-6">
            {(content?.forumTerms && (
              <PortableText value={content?.forumTerms } components={components} />
            )) ?? (
              <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Optio mollitia officia cum, laudantium quos exercitationem repellat soluta ratione perspiciatis architecto maxime est corporis debitis ducimus repudiandae expedita, quidem qui, animi facilis accusamus placeat. Officia aspernatur eveniet placeat ipsa, tempore beatae ea quisquam nobis voluptate labore voluptas harum recusandae veniam cum neque rerum nihil dolore facere voluptates iure natus sit, eum maxime? Alias qui nobis dolores ducimus. Culpa nam doloribus ad, cum eos quod sit necessitatibus aspernatur alias itaque odio sapiente quisquam numquam possimus, facere quibusdam, deserunt cumque ipsum placeat. Saepe laborum qui deserunt reprehenderit ex animi aspernatur eaque maiores corporis quisquam provident a necessitatibus molestiae distinctio quos, nemo debitis impedit optio, officia mollitia magni explicabo. Similique quibusdam excepturi sunt aliquam impedit commodi expedita distinctio, sed corrupti alias iusto quae quod maxime consectetur optio. Sit minus delectus dolor laudantium nam molestiae ratione dolore beatae praesentium optio velit voluptatibus deserunt a expedita quam recusandae tempora corrupti ea, culpa eveniet eos repellat nobis voluptatum? Excepturi quo iure quibusdam delectus quia totam voluptate cupiditate libero repellat fuga temporibus, repudiandae blanditiis quam culpa autem laboriosam neque quidem enim unde tempore quaerat distinctio quas molestiae. Atque laboriosam perferendis veniam totam mollitia debitis consectetur eaque id dignissimos.</p>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default RefundPolicy;
