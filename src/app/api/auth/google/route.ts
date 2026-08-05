import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import { User } from '@/lib/models/User';
import { generateToken } from '@/lib/utils/jwt';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 400 });
    }

    // Fetch user profile from Google using the access token
    const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!googleRes.ok) {
      return NextResponse.json({ message: 'Failed to authenticate with Google' }, { status: 401 });
    }

    const googleUser = await googleRes.json();
    const { email, name, picture, sub: googleId } = googleUser;

    if (!email) {
      return NextResponse.json({ message: 'Google account has no email' }, { status: 400 });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // If user exists but was created with credentials, we just log them in
      // Optional: you could update their image or name here if you want
    } else {
      // Create a new user (with a dummy password since they use Google)
      // They can reset their password later if they want to log in with email
      user = await User.create({
        name,
        email,
        image: picture,
        passwordHash: 'GOOGLE_OAUTH_USER', 
      });
    }

    // Generate JWT
    const jwtToken = generateToken(user.id);

    return NextResponse.json({
      message: 'Logged in successfully',
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      }
    });
  } catch (error: any) {
    console.error('Google Auth Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
