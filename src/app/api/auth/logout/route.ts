import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // In a token-based auth system (JWT in localStorage), logout is mostly handled client-side.
  // If we were using httpOnly cookies, we would clear them here.
  return NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );
}
