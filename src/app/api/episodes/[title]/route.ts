import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanityClient";

export const revalidate = 60; // ISR-style caching

interface ArticlePageProps {
  params: Promise<{
    title: string;
  }>;
}
export async function GET(
  req: Request,
  { params }: { params: { title: string } },
  res: NextResponse
) {
  const title = await params?.title;
  const query = `*[_type == "episode" && references(*[_type == "podcast" _id == $title])] | order(date desc){
  _id,
  title,
  author,
  slug,
  kind,
  podcast,
  date,
  "imageUrl": image.asset->url,
  tags,
  description,
  mediafile,
  duration,
}`;

  try {
    const data = await sanityClient.fetch(query);
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("Error fetching featured podcasts from Sanity", err);
    return NextResponse.json({ message: `Failed to load podcasts ${title}` });
  }
}
