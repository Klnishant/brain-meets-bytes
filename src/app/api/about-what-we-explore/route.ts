import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanityClient";

export const revalidate = 300;

const query = `*[_type == "aboutWhatWeExplore"][0]{
  _id,
  title,
  items[]{
    label,
    description,
    accentColor,
    "iconUrl": icon.asset->url
  }
}`;

export async function GET() {
  try {
    const data = await sanityClient.fetch(query);
    return NextResponse.json(data ?? null);
  } catch (err) {
    console.error("Error fetching About What We Explore from Sanity", err);
    return NextResponse.json(
      { message: "Failed to load About What We Explore content" },
      { status: 500 }
    );
  }
}
