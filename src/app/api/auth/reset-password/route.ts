import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, verificationTokens } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, email, newPassword } = await req.json();

    if (!token || !email || !newPassword) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Verify token exists and matches the email
    const tokenRecord = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.token, token),
          eq(verificationTokens.identifier, email)
        )
      )
      .limit(1);

    if (tokenRecord.length === 0) {
      return NextResponse.json({ message: "Invalid or expired reset token" }, { status: 400 });
    }

    // Check if token is expired
    if (new Date() > new Date(tokenRecord[0].expires)) {
      // Clean up expired token
      await db
        .delete(verificationTokens)
        .where(eq(verificationTokens.token, token));
      return NextResponse.json({ message: "Reset token has expired" }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.email, email));

    // Delete the used token
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.token, token));

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
