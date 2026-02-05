import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("hello");
  
   const {email, password, remeberMe} = await req.json();
   console.log({email, password, remeberMe});
   

   try {
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }
     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password}),
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
        expires: remeberMe
    ? new Date(Date.now() + 7 * 24 * 60 * 60)
    : undefined,
       });
       response.cookies.set("userId", userId, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        expires: remeberMe
    ? new Date(Date.now() + 7 * 24 * 60 * 60)
    : undefined,
       })
       return response
   } catch (err: any) {
    console.error("Error logging in:", err);
    return NextResponse.json({ message: "Failed to log in", error: err?.message }, { status: 500 });
   }
}