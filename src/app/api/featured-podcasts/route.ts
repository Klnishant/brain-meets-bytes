import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanityClient";

export const revalidate = 60; // ISR-style caching

const query = `*[_type == "podcast"] | order(date desc)[0...6]{
  _id,
  "slug": slug.current,
  title,
  author,
  date,
  "imageUrl": image.asset->url,
  tags,
  "podcastCount": count(*[_type == "episode" && references(^._id)])
}`;

export async function GET() {
  try {
    const data = await sanityClient.fetch(query);
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("Error fetching featured podcasts from Sanity", err);
    return NextResponse.json(
      { message: "Failed to load podcasts" },
      { status: 500 }
    );
  }
}
