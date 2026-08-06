import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { User } from '@/lib/models/User';
import { generateToken } from '@/lib/utils/jwt';
import { OAuth2Client } from 'google-auth-library';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ message: 'No authorization code provided' }, { status: 400 });
    }

    const client = new OAuth2Client(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'postmessage'
    );

    // Exchange the authorization code for tokens
    const { tokens } = await client.getToken(code);
    
    if (!tokens.id_token) {
      throw new Error("No id_token returned from Google");
    }

    // Verify the ID token and get user info
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error("Failed to get payload from Google token");
    }

    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return NextResponse.json({ message: 'Google account has no email' }, { status: 400 });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // If user exists but was created with credentials, we just log them in
      // Optional: you could update their image or name here if you want
    } else {
      // Create a new user
      user = await User.create({
        name,
        email,
        image: picture,
        passwordHash: 'GOOGLE_OAUTH_USER', 
      });
    }

    // Generate JWT
    const jwtToken = generateToken(user._id.toString());

    return NextResponse.json({
      message: 'Logged in successfully',
      token: jwtToken,
      user: user.toJSON()
    });
  } catch (error: any) {
    console.error('Google Auth Error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
