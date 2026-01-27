import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanityClient";

export async function GET() {
  try {
    const data = await sanityClient.fetch(`
      *[_type == "homeForum"][0]{
        _id,
        heading,
        description,
        Card{
          title,
          description,
          user,
          role,
          tags,
          date,
          repliesCount,
          reactionCount,
          "profileImageUrl": profileImage.asset->url
        }
      }
    `);

    return NextResponse.json(data);
  } catch (error) {
    console.error("HOME FORUM API ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch home forum" },
      { status: 500 }
    );
  }
}
