import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

// Simple in-memory rate limiting (for demo purposes)
const rateLimit = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function POST(req: Request) {
  try {
    const { to, subject, body } = await req.json();

    if (!to || !subject || !body) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (to, subject, body)" },
        { status: 400 }
      );
    }

    // In a real app, use the authenticated user's ID
    const userId = req.headers.get("x-forwarded-for") || "anonymous_user";
    
    // Rate limit check
    const now = Date.now();
    const userLimit = rateLimit.get(userId);
    
    if (userLimit && now < userLimit.resetTime) {
      if (userLimit.count >= RATE_LIMIT_MAX) {
        return NextResponse.json(
          { success: false, error: "Rate limit exceeded. Try again later." },
          { status: 429 }
        );
      }
      userLimit.count += 1;
    } else {
      rateLimit.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    }

    // Send email via Resend
    // For demo purposes, we send FROM a verified domain you own or the resend default 'onboarding@resend.dev'
    const { data, error } = await resend.emails.send({
      from: 'KataCut Support <onboarding@resend.dev>', // Replace with your verified domain
      to: [to],
      subject: subject,
      text: body,
      // If you want to CC the user so they have a copy
      // cc: ['user@example.com']
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, messageId: data?.id });
  } catch (error: any) {
    console.error("Failed to send email:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
