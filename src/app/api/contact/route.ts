import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanityClient";

export const revalidate = 300;

const query = `*[_type == "contact"][0]{
  _id,
  heading,
  body,
  phone,
  email,
}`;

export async function GET() {
  try {
    const data = await sanityClient.fetch(query);
    return NextResponse.json(data ?? null);
  } catch (err) {
    console.error("Error fetching contact from Sanity", err);
    return NextResponse.json(
      { message: "Failed to load contact content" },
      { status: 500 }
    );
  }
}