import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanityClient";

export const revalidate = 300;

const query = `*[_type == "aboutApproach"][0]{
  _id,
  heading,
  body,
  points[]{
    title,
    description,
    "iconUrl": icon.asset->url
  }
}`;

export async function GET() {
  try {
    const data = await sanityClient.fetch(query);
    return NextResponse.json(data ?? null);
  } catch (err) {
    console.error("Error fetching About approach from Sanity", err);
    return NextResponse.json(
      { message: "Failed to load About approach content" },
      { status: 500 }
    );
  }
}
