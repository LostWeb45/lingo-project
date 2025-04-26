// app/api/register/route.ts
import { registerUser } from "@/app/actions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await registerUser(body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
  }
}
