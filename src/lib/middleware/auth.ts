import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../utils/jwt";
import { connectDB } from "../db/connection";
import { User } from "../models/User";

export function withAuth(handler: (req: any, user: any) => Promise<NextResponse>) {
  return async (req: any, context: any) => {
    try {
      const authHeader = req.headers.get('authorization');
      const token = authHeader?.split(' ')[1] || req.cookies.get('token')?.value;

      if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
      }

      await connectDB();
      const user = await User.findById(decoded.userId).select('-passwordHash');
      
      if (!user) {
        return NextResponse.json({ message: "User no longer exists" }, { status: 401 });
      }

      return handler(req, user);
    } catch (error) {
      console.error("Auth middleware error:", error);
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  };
}
