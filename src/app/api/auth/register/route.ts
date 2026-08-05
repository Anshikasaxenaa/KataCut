import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { User } from "@/lib/models/User";
import { generateToken } from "@/lib/utils/jwt";

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

    // Create the user (pre-save hook hashes password... wait, I didn't add password hashing in pre-save. The instructions said hash with bcrypt. I need to do it here or update User model.)
    // Let's import bcrypt and hash here, since my User model didn't have a pre-save hook for hashing.
    const bcrypt = await import("bcryptjs");
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
