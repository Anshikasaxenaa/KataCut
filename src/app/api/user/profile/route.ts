import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth';

export const PUT = withAuth(async (req, user) => {
  try {
    const { name, image } = await req.json();

    if (name !== undefined) user.name = name;
    if (image !== undefined) user.image = image;

    await user.save();

    return NextResponse.json({ success: true, user: user.toJSON() });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
});
