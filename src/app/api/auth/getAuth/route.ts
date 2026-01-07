import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();

    const response = NextResponse.json({
        token: cookieStore.get("token")?.value || null,
        userId: cookieStore.get("userId")?.value || null
    });
    return response
}