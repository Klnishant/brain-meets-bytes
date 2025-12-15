import Navbar from "@/components/core/Navbar";
import Footer from "@/components/core/Footer";
import Link from "next/link";
import { sanityClient } from "@/lib/sanityClient";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

type Article = {
  _id: string;
  title: string;
  author?: string;
  date?: string;
  imageUrl?: string;
  tags?: string[];
  excerpt?: string;
  slug?: string;
  authorDetails?: {
    name?: string;
    role?: string;
    bio?: string;
    imageUrl?: string;
  };
  content?: {
    _key: string;
    _type: string;
    children?: { _key: string; text?: string }[];
    style?: string;
  }[];
};

const articleQuery = `*[_type == "article" && slug.current == $slug][0]{
  _id,
  title,
  author,
  date,
  "imageUrl": image.asset->url,
  tags,
  excerpt,
  authorDetails {
    name,
    role,
    bio,
    "imageUrl": image.asset->url
  },
  content
}`;

const relatedQuery = `*[_type == "article" && slug.current != $slug] | order(date desc)[0...3]{
  _id,
  title,
  author,
  date,
  "imageUrl": image.asset->url,
  tags,
  excerpt,
  "slug": slug.current
}`;

const formatDate = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const renderBlocks = (blocks: Article["content"]) => {
  if (!blocks || !Array.isArray(blocks)) return null;

  return blocks.map((block) => {
    if (block._type !== "block") return null;
    const text = (block.children || [])
      .map((child) => child.text || "")
      .join("")
      .trim();

    if (!text) return null;

    if (block.style === "h2") {
      return (
        <h2
          key={block._key}
          className="mt-10 mb-4 font-sora text-[28px] md:text-[32px] font-semibold text-[#1E293B]"
        >
          {text}
        </h2>
      );
    }

    if (block.style === "h3") {
      return (
        <h3
          key={block._key}
          className="mt-8 mb-3 font-sora text-[22px] md:text-[24px] font-semibold text-[#1E293B]"
        >
          {text}
        </h3>
      );
    }

    return (
      <p
        key={block._key}
        className="mb-6 font-inter text-[16px] md:text-[18px] leading-[32px] text-[#505050]"
      >
        {text}
      </p>
    );
  });
};

const RelatedArticleCard = ({ article }: { article: any }) => {
  const { title, author, date, imageUrl, tags = [], excerpt, slug } = article;

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-[#FAF9F8]">
      <div className="px-5 pt-5">
        <div className="relative w-full overflow-hidden rounded-lg bg-[#CDCDCD] pt-[54%]">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-5 pb-5 pt-6">
        <div className="flex items-center gap-4 text-xs text-[#505050]">
          <span className="inline-flex items-center rounded-full bg-[#E2E8F0] px-3 py-1 text-[11px] text-[#64748B]">
            {author || "Unknown"}
          </span>
          <span className="text-[11px] text-[#505050]">{formatDate(date)}</span>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 text-[11px]">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-[#64748B] px-3 py-1 text-[#64748B]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="font-sora text-[20px] font-semibold leading-[30px] text-[#1E293B]">
          {title}
        </h3>

        <p className="font-inter text-[14px] leading-[24px] text-[#505050]">
          {excerpt}
        </p>

        <div className="mt-4 h-[2px] w-full rounded-full bg-[#E2E8F0]" />

        <div className="mt-3 flex items-center justify-between">
          {slug ? (
            <Link
              href={`/articles/${slug}`}
              className="inline-flex items-center gap-2 rounded-[36px] border border-[#D62828] px-6 py-2 text-[14px] font-normal text-[#D62828]"
            >
              Read More
            </Link>
          ) : (
            <button className="inline-flex items-center gap-2 rounded-[36px] border border-[#D62828] px-6 py-2 text-[14px] font-normal text-[#D62828]">
              Read More
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

const ArticlePage = async ({ params }: ArticlePageProps) => {
  const { slug } = await params;
  const article = (await sanityClient.fetch(articleQuery, { slug })) as Article | null;
  const related = (await sanityClient.fetch(relatedQuery, { slug })) as any[];

  if (!article) {
    return (
      <main className="min-h-screen bg-[#FAF9F8]">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-24 text-center font-inter text-[#1E293B]">
          Article not found.
        </div>
        <Footer />
      </main>
    );
  }

  const { title, author, date, imageUrl, tags = [], excerpt, authorDetails, content } = article;

  const displayAuthorName = authorDetails?.name || author || "Unknown";
  const displayAuthorRole = authorDetails?.role;
  const displayAuthorBio =
    authorDetails?.bio ||
    "I am a seasoned professional with a rich background in health, technology and leadership. Drawing on extensive experience in the memory care sector and emerging technologies, I am dedicated to exploring the dynamic landscape of brain health and longevity.";
  const authorImageUrl = authorDetails?.imageUrl;

  return (
    <main className="min-h-screen bg-[#FAF9F8]">
      <Navbar />

      {/* Breadcrumb */}
      <section className="w-full pt-8">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-16">
          <div className="flex items-center justify-between rounded-[20px] border border-[#E2E8F0] bg-white px-5 py-4 text-sm text-[#1E293B]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-inter text-[14px] text-[#1E293B]">Home</span>
              <span className="text-[#1E293B]">/</span>
              <span className="font-inter text-[14px] text-[#1E293B]">Articles</span>
              <span className="text-[#1E293B]">/</span>
              <span className="font-inter text-[14px] text-[#1E293B]">
                {title}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Article content */}
      <section className="w-full pb-20 pt-10 md:pb-24 md:pt-12 lg:pb-28">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-16">
          <div className="flex flex-col gap-10">
            {/* Title + meta */}
            <div className="flex flex-col gap-6">
              <h1 className="font-sora text-[32px] md:text-[42px] lg:text-[56px] font-semibold leading-[1.25] text-[#1E293B]">
                {title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="inline-flex items-center gap-3 rounded-full bg-[#E2E8F0] px-4 py-2">
                  <span className="font-inter text-[14px] text-[#64748B]">{displayAuthorName}</span>
                  {displayAuthorRole && (
                    <span className="font-inter text-[12px] text-[#94A3B8]">{displayAuthorRole}</span>
                  )}
                </div>
                <span className="font-inter text-[14px] text-[#505050]">{formatDate(date)}</span>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full border border-[#64748B] px-4 py-2 font-inter text-[14px] text-[#64748B]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Hero image */}
            {imageUrl && (
              <div className="overflow-hidden rounded-[32px] bg-[#CDCDCD]">
                <img
                  src={imageUrl}
                  alt={title}
                  className="h-[580px] w-full object-cover"
                />
              </div>
            )}

            {/* Intro / excerpt */}
            {excerpt && (
              <p className="font-inter text-[16px] md:text-[18px] leading-[32px] text-[#505050]">
                {excerpt}
              </p>
            )}

            {/* Main body blocks */}
            <div className="flex flex-col">
              {renderBlocks(content)}
            </div>

            {/* Author card */}
            <div className="flex flex-col gap-6 rounded-[32px] bg-[#E2E8F0] p-6 md:flex-row md:items-center md:p-8">
              {authorImageUrl && (
                <div className="relative h-[221px] w-[221px] flex-shrink-0">
                  <div className="absolute left-0.5 top-3 h-[221px] w-[221px] rounded-[32px] bg-[#023047]" />
                  <div className="absolute left-0.5 top-0 h-[221px] w-[221px] overflow-hidden rounded-[32px] border-4 border-[#FAF9F8]">
                    <img src={authorImageUrl} alt={displayAuthorName} className="h-full w-full object-cover " />
                  </div>
                </div>
              )}

              <div className="flex flex-1 flex-col gap-4">
                <h3 className="font-sora text-[24px] font-semibold text-[#1E293B]">{displayAuthorName}</h3>
                <p className="font-inter text-[16px] md:text-[18px] leading-[32px] text-[#505050]">
                  {displayAuthorBio}
                </p>
              </div>
            </div>

            {/* Related articles */}
            {related && related.length > 0 && (
              <div className="mt-8 flex flex-col items-center gap-10">
                <div className="flex flex-col items-center gap-3 text-center">
                  <h2 className="font-sora text-[32px] md:text-[36px] font-bold leading-[45px] text-[#000000]">
                    Related Articles &amp; Interviews
                  </h2>
                  <p className="max-w-[700px] font-inter text-[16px] md:text-[18px] leading-[22px] text-[#505050]">
                    Nam vulputate faucibus urna non mollis. Vivamus a vulputate turpis. Aenean
                    efficitur aliquam dui a elementum.
                  </p>
                </div>

                <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {related.map((a) => (
                    <RelatedArticleCard key={a._id} article={a} />
                  ))}
                </div>

                <button
                  className="inline-flex items-center justify-center gap-3 rounded-[36px] bg-[#023047] px-10 py-3 text-[16px] text-white"
                >
                  Discover all 200+
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ArticlePage;
