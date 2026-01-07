import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanityClient";

export const revalidate = 60; // ISR-style caching

interface Context{
  params: {
    slug: string;
  }
}

const query = `*[_type == "podcast" && slug.current != $slug] | order(date desc)[0...6]{
  _id,
  title,
  author,
  date,
  "imageUrl": image.asset->url,
  tags,
  "podcastCount": count(*[_type == "episode" && references(^._id)])
}`;

export async function GET(
    req: NextRequest,
   { params }: { params: Promise<{slug: string }> }
) {
    const { slug } = await params;
  try {
    const data = await sanityClient.fetch(query, { slug });
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("Error fetching featured podcasts from Sanity", err);
    return NextResponse.json(
      { message: "Failed to load podcasts" },
      { status: 500 }
    );
  }
}