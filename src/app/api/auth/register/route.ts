import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { User } from "@/lib/models/User";
import { generateToken } from "@/lib/utils/jwt";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      passwordHash,
      preferences: {}
    });

    const token = generateToken(user._id.toString());

    return NextResponse.json(
      { 
        message: "User registered successfully",
        token,
        user: user.toJSON()
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
