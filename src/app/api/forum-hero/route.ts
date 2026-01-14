import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanityClient";

export const revalidate = 300;

const query = `*[_type == "forumHero"][0]{
  _id,
  heading,
  description,
  "imageUrl": image.asset->url,
  authors[]{
    name,
    content,
    "imageUrl": image.asset->url
  },
  date,
}`;

export async function GET() {
  try {
    const data = await sanityClient.fetch(query);
    return NextResponse.json(data ?? null);
  } catch (err) {
    console.error("Error fetching forum hero from Sanity", err);
    return NextResponse.json(
      { message: "Failed to load forum hero content" },
      { status: 500 }
    );
  }
}