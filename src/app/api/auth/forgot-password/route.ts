import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, verificationTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY || "fallback_key");

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const userRecord = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userRecord.length === 0) {
      // Don't leak that the email isn't in our DB for security reasons
      return NextResponse.json({ message: "If the email exists, a reset link was sent." });
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // Set expiration for 1 hour from now
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    // Save token in the database
    // We use the existing verificationToken table created by NextAuth
    await db.insert(verificationTokens).values({
      identifier: email,
      token: resetToken,
      expires,
    });

    // Determine the base URL for the reset link
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    
    // Log the link for local testing since email delivery can be tricky
    console.log("===================================");
    console.log("PASSWORD RESET LINK:", resetLink);
    console.log("===================================");

    // Send the email using Resend
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "KataCut Security <security@katacut.com>", // Replace with verified domain in prod
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
