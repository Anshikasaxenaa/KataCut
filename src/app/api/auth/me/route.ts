import { NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/auth";

export const GET = withAuth(async (req, user) => {
  return NextResponse.json({ user: user.toJSON() }, { status: 200 });
});
