import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    message: "Logged out successfully",
  });

  // Clear access token
  response.cookies.delete("token")
  // Clear userId
  response.cookies.delete("userId")

  return response;
}
