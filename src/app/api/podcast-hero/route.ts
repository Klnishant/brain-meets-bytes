import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanityClient";

export const revalidate = 300;

const query = `*[_type == "podcastHero"][0]{
  _id,
  heading,
  description,
  newReleasePodcastTitle,
  author,
  "imageUrl": image.asset->url,
  date,
  tags,
  "podcastCount": count(*[_type == "podcast"])
}`;

export async function GET() {
  try {
    const data = await sanityClient.fetch(query);
    return NextResponse.json(data ?? null);
  } catch (err) {
    console.error("Error fetching Podcast hero from Sanity", err);
    return NextResponse.json(
      { message: "Failed to load Podcast hero content" },
      { status: 500 }
    );
  }
}