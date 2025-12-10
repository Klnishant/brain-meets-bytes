import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanityClient";

export const revalidate = 300;

const query = `*[_type == "aboutHero"][0]{
  _id,
  heading,
  highlightText,
  body,
  primaryCtaLabel
}`;

export async function GET() {
  try {
    const data = await sanityClient.fetch(query);
    return NextResponse.json(data ?? null);
  } catch (err) {
    console.error("Error fetching About hero from Sanity", err);
    return NextResponse.json(
      { message: "Failed to load About hero content" },
      { status: 500 }
    );
  }
}
