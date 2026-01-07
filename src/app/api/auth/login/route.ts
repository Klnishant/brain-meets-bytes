import { NextResponse } from "next/server";

export async function POST(req: Request) {
   const body = await req.json();

   try {
     const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
      console.log(res);
      const result = await res.json();
      if (!res.ok) {
        return NextResponse.json(result, { status: res.status });
      }
      const {token, userId, ...restUserData} = result.data;
       const response = NextResponse.json({
        message: result.message,
        user:{
            userId,
            ...restUserData
        }
       });
       response.cookies.set("token", token,{
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7
       });
       response.cookies.set("userId", userId, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7
       })
       return response
   } catch (err) {
    console.error("Error logging in:", err);
    return NextResponse.json({ message: "Failed to log in" }, { status: 500 });
   }
}