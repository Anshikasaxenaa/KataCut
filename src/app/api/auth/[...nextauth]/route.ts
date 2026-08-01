import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "fallback_key");

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Send a welcome email when a new user signs up
      if (user.email && process.env.RESEND_API_KEY) {
        try {
          await resend.emails.send({
            from: "KataCut <welcome@katacut.com>", // Replace with verified domain in prod
            to: user.email,
            subject: "Welcome to KataCut! ✂️",
            html: `
              <div style="font-family: sans-serif; padding: 20px;">
                <h2>Welcome to KataCut, ${user.name || "friend"}!</h2>
                <p>We're excited to help you track your subscriptions securely.</p>
                <p>Remember, your financial data never leaves your device. Everything is encrypted locally.</p>
                <br/>
                <p>Happy tracking!</p>
                <p>— The KataCut Team</p>
              </div>
            `,
          });
          console.log(`Welcome email sent to ${user.email}`);
        } catch (error) {
          console.error("Failed to send welcome email", error);
        }
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
