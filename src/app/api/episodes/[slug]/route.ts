import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanityClient";

export const revalidate = 60; // ISR-style caching

// interface ArticlePageProps {
//   params: Promise<{
//     title: string;
//   }>;
// }
interface Context{
  params: {
    slug: string;
  }
}
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const {slug} = await params;

  const query = `*[_type == "episode" && podcast->slug.current == "${slug}" ] {
  _id,
    title,
    slug,
    kind,
    podcast -> {
      title,
      author,
      "imageUrl": image.asset->url,
      description,
      "slug":slug.current,
      "authorImageUrl":authorImage.asset->url
    },
    date,
    "imageUrl": image.asset->url,
    tags,
    description,
    "media":mediaFile.asset->url,
    "mimeType": mediaFile.asset->mimeType,
    duration,
}`;

  try {
    const data = await sanityClient.fetch(query);
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("Error fetching featured podcasts from Sanity", err);
    return NextResponse.json({ message: `Failed to load podcasts` });
  }
}
