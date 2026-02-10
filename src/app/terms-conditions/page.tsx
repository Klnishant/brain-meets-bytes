"use client";

import Footer from "@/components/core/Footer";
import Navbar from "@/components/core/Navbar";
import { PortableText, PortableTextReactComponents } from "next-sanity";
import { useEffect, useState } from "react";
import { TypedObject } from "sanity";

type FooterContent = {
  tremsAndConditions: TypedObject[];
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
            Terms &amp; Conditions
          </h1>
          <div className="text-[#505050] prose mx-auto p-6">
            {(content?.tremsAndConditions && (
              <PortableText
                value={content?.tremsAndConditions}
                components={components}
              />
            )) ?? (
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates repudiandae magnam soluta. Ipsum ad perferendis libero officiis debitis aut beatae cupiditate quae? Magnam atque cupiditate error illum, ipsum maiores accusamus distinctio quibusdam. Alias repudiandae omnis nisi corporis facere dolore voluptate iusto aut et ea modi est similique nesciunt officia perspiciatis at, sed optio recusandae in ex quibusdam mollitia eos possimus nam. Ducimus consequuntur ipsum, illum accusantium, non laboriosam harum debitis a atque animi voluptas. Velit porro molestiae expedita odit. Blanditiis velit in sit voluptate id fugit odio nemo laboriosam porro tempora minima ex amet rem veritatis modi adipisci, ad iste quo ea quia incidunt accusantium! Consequuntur quisquam veritatis est eveniet rem perspiciatis suscipit obcaecati, adipisci, aspernatur culpa deleniti asperiores provident corrupti, possimus cumque nobis beatae quos nemo? Officia suscipit nobis illum vero, in cupiditate nostrum placeat ut saepe assumenda numquam? Officia beatae sed laudantium, saepe iure velit blanditiis autem aut dolore? Doloremque, libero commodi sapiente temporibus maxime ullam itaque iusto ab et modi vitae praesentium facilis magni quia quam veniam, necessitatibus aliquid saepe architecto aspernatur. Ad numquam est cum non minus ducimus, deserunt repellendus inventore eius vero neque eligendi perspiciatis quo fugit, exercitationem maiores iste molestiae at officiis facere doloremque.</p>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default RefundPolicy;
