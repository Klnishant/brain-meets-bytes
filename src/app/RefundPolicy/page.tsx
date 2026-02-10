"use client";

import Footer from "@/components/core/Footer";
import Navbar from "@/components/core/Navbar";
import { useEffect, useState } from "react";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import { TypedObject } from "sanity";

type FooterContent = {
    refundPolicy: TypedObject[];
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
            Refund Policy
          </h1>
          <div className="text-[#505050] prose mx-auto p-6">
            {(content?.refundPolicy && (
              <PortableText value={content?.refundPolicy } components={components} />
            )) ?? (
              <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ratione delectus molestiae libero aperiam vero rerum quos eligendi sed quo nesciunt dolor reprehenderit amet cum, soluta unde iste. Sed explicabo cumque autem maxime iste. Quidem assumenda nobis numquam pariatur neque exercitationem ut porro unde error similique eius ipsa corrupti placeat voluptatibus minima laudantium laborum cumque repudiandae, illo eos est dicta iure. Qui animi distinctio, nihil ipsam voluptatibus cupiditate tenetur accusantium eveniet minima eos laboriosam quos inventore! Perferendis, tenetur? Quaerat ipsam ea eos cupiditate! Quas ad consectetur perspiciatis ipsum necessitatibus, iure ducimus nulla possimus aspernatur assumenda quasi a provident numquam minus exercitationem deleniti dolorem! Ad animi iure assumenda ex dolor minus quos quam dignissimos laboriosam amet provident maxime suscipit, fugit tenetur reprehenderit pariatur exercitationem in error architecto magni neque! Cumque, cupiditate dolorum? Error reiciendis dignissimos dolorum provident tenetur qui. Aliquid ab cupiditate obcaecati ad quia quidem consequuntur labore eius similique rem incidunt neque ducimus magnam ipsum veniam rerum temporibus quos dolorem, eligendi in sequi nam. Earum dicta laudantium maiores sed unde, voluptatum debitis tempora qui pariatur similique sit. Minus, assumenda. Iusto cum voluptatibus ad harum iure velit numquam accusamus dolore qui. Asperiores animi neque nihil pariatur tempore cum consequuntur! Ipsam, placeat. Saepe.</p>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default RefundPolicy;
