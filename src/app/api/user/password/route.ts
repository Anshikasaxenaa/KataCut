import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth';
import bcrypt from 'bcryptjs';

export const PUT = withAuth(async (req, user) => {
  try {
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing password fields' }, { status: 400 });
    }

    if (!user.passwordHash) {
      return NextResponse.json({ error: 'User does not use password authentication' }, { status: 400 });
    }

    const isValid = await user.comparePassword(currentPassword);

    if (!isValid) {
      return NextResponse.json({ error: 'Incorrect current password' }, { status: 403 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashedPassword;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
});
