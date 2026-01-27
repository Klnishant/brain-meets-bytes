import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanityClient";

export const revalidate = 60;

const query = `*[_type == "article"] | order(date desc)[0...100]{
  _id,
  title,
  authors[]{
    name,
    role,
    bio,
    "imageUrl": image.asset->url
  },
  date,
  "imageUrl": image.asset->url,
  tags,
  excerpt,
  "slug": slug.current
}`;

export async function GET() {
  try {
    const data = await sanityClient.fetch(query);
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("Error fetching articles from Sanity", err);
    return NextResponse.json(
      { message: "Failed to load articles" },
      { status: 500 }
    );
  }
}
