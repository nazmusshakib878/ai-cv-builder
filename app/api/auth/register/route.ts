import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/utils/supabase/db';
import { signUserToken, getServerSession } from '@/utils/authServer';
import { checkRateLimit, getClientIdentifier } from '@/utils/rateLimiter';

export const runtime = 'nodejs';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Protection (15 registrations / min)
    const clientId = getClientIdentifier(req, 'auth_reg');
    const rateLimit = checkRateLimit(clientId, 15, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again in a moment.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetSeconds) } }
      );
    }

    const session = await getServerSession(req);
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    const { email, password, fullName } = body;

    // 2. Input Validation
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await db.findUserByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 400 });
    }

    // 3. Create user
    const user = await db.createUser(cleanEmail, password, fullName);

    // 4. Claim and migrate guest CVs, clearing old guest session ownership
    if (session.guestSessionId) {
      await db.claimGuestResumes(session.guestSessionId, user.id);
    }

    // 5. Issue secure user JWT
    const token = signUserToken({ userId: user.id, email: user.email, fullName: user.full_name });

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, fullName: user.full_name },
      token,
      message: 'Account created successfully',
    });

    response.cookies.set('resumate_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    // Invalidate guest session cookie on registration
    response.cookies.delete('cv_guest_token');

    return response;
  } catch (error: any) {
    console.error('Register Error:', error);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
