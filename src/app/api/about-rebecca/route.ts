import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanityClient";

export const revalidate = 300;

const query = `*[_type == "aboutRebecca"][0]{
  _id,
  badgeLabel,
  heading,
  body,
  ctaLabel,
  "imageUrl": image.asset->url
}`;

export async function GET() {
  try {
    const data = await sanityClient.fetch(query);
    return NextResponse.json(data ?? null);
  } catch (err) {
    console.error("Error fetching about Rebecca from Sanity", err);
    return NextResponse.json(
      { message: "Failed to load About Rebecca content" },
      { status: 500 }
    );
  }
}
