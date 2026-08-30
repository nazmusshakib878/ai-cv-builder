import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/utils/supabase/db';
import { signUserToken, getServerSession } from '@/utils/authServer';
import { checkRateLimit, getClientIdentifier } from '@/utils/rateLimiter';

export const runtime = 'nodejs';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Protection (Brute-force mitigation: max 15 attempts / min)
    const clientId = getClientIdentifier(req, 'auth_login');
    const rateLimit = checkRateLimit(clientId, 15, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait a moment before trying again.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.resetSeconds) } }
      );
    }

    const session = await getServerSession(req);
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Malformed JSON payload' }, { status: 400 });
    }

    const { email, password } = body;

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await db.findUserByEmail(cleanEmail);

    if (!user || user.password_hash !== password) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Claim and migrate any current guest CVs to the logged in user
    if (session.guestSessionId) {
      await db.claimGuestResumes(session.guestSessionId, user.id);
    }

    const token = signUserToken({ userId: user.id, email: user.email, fullName: user.full_name });

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, fullName: user.full_name },
      token,
      message: 'Logged in successfully',
    });

    response.cookies.set('resumate_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    // Invalidate guest session cookie on login
    response.cookies.delete('cv_guest_token');

    return response;
  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 });
  }
}
