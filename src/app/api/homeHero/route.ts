import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanityClient";

export const revalidate = 300;

const query = `*[_type == "homeHero"][0]{
  _id,
  heading,
  description,
  tag,
}`;

export async function GET() {
  try {
    const data = await sanityClient.fetch(query);
    return NextResponse.json(data ?? null);
  } catch (err) {
    console.error("Error fetching Home hero from Sanity", err);
    return NextResponse.json(
      { message: "Failed to load Home hero content" },
      { status: 500 }
    );
  }
}