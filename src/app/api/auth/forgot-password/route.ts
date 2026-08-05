import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connection";
import { User } from "@/lib/models/User";
import { Resend } from "resend";
import crypto from "crypto";
// Need a mongoose model for VerificationToken.
// Mongoose way: add resetPasswordToken and resetPasswordExpires to User model, or use a separate model.
// I will rewrite this to use a separate model.

const resend = new Resend(process.env.RESEND_API_KEY || "fallback_key");

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findByEmail(email);

    if (!user) {
      return NextResponse.json({ message: "If the email exists, a reset link was sent." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    // Using a separate Token model would be cleaner if we wanted to stick to the old DB structure exactly, 
    // but saving to user is easier. Let's create a VerificationToken model quickly in the file or just use mongoose directly here.
    const mongoose = (await import('mongoose')).default;
    const TokenSchema = new mongoose.Schema({
      identifier: String,
      token: String,
      expires: Date,
    });
    const VerificationToken = mongoose.models.VerificationToken || mongoose.model('VerificationToken', TokenSchema);

    await VerificationToken.create({
      identifier: email,
      token: resetToken,
      expires,
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    
    console.log("===================================");
    console.log("PASSWORD RESET LINK:", resetLink);
    console.log("===================================");

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "KataCut Security <security@katacut.com>",
        to: email,
        subject: "Password Reset Request - KataCut",
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Reset your KataCut password</h2>
            <p>We received a request to reset the password for your account.</p>
            <p>Click the secure link below to choose a new password. This link will expire in 1 hour.</p>
            <br/>
            <a href="${resetLink}" style="background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
            <br/><br/>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>— The KataCut Security Team</p>
          </div>
        `,
      });
    } else {
      console.warn("RESEND_API_KEY not set. Reset link generated but not sent via email:", resetLink);
    }

    return NextResponse.json({ message: "If the email exists, a reset link was sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
