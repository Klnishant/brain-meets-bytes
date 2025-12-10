import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanityClient";

export const revalidate = 300;

const query = `*[_type == "aboutMission"][0]{
  _id,
  title,
  body,
  ctaLabel,
  "imageUrl": image.asset->url
}`;

export async function GET() {
  try {
    const data = await sanityClient.fetch(query);
    return NextResponse.json(data ?? null);
  } catch (err) {
    console.error("Error fetching About mission from Sanity", err);
    return NextResponse.json(
      { message: "Failed to load About mission content" },
      { status: 500 }
    );
  }
}
