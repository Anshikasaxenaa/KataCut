import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { User } from "@/lib/models/User";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, email, newPassword } = await req.json();

    if (!token || !email || !newPassword) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    
    // Reuse the VerificationToken model
    const TokenSchema = new mongoose.Schema({
      identifier: String,
      token: String,
      expires: Date,
    });
    const VerificationToken = mongoose.models.VerificationToken || mongoose.model('VerificationToken', TokenSchema);

    const tokenRecord = await VerificationToken.findOne({
      token,
      identifier: email
    });

    if (!tokenRecord) {
      return NextResponse.json({ message: "Invalid or expired reset token" }, { status: 400 });
    }

    if (new Date() > new Date(tokenRecord.expires)) {
      await VerificationToken.deleteOne({ _id: tokenRecord._id });
      return NextResponse.json({ message: "Reset token has expired" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { email },
      { $set: { passwordHash: hashedPassword } }
    );

    await VerificationToken.deleteOne({ _id: tokenRecord._id });

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
