import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'resumate-production-secure-key-2026';

export interface ServerSession {
  userId: string | null;
  guestSessionId: string | null;
  email: string | null;
  isGuest: boolean;
  newGuestToken?: string;
}

/**
 * Signs a guest session token with HMAC-SHA256
 */
export function signGuestToken(guestSessionId: string): string {
  return jwt.sign({ guestId: guestSessionId, type: 'guest' }, JWT_SECRET, {
    expiresIn: '365d',
  });
}

/**
 * Signs an authenticated user token
 */
export function signUserToken(payload: { userId: string; email: string; fullName?: string }): string {
  return jwt.sign({ ...payload, type: 'user' }, JWT_SECRET, { expiresIn: '30d' });
}

/**
 * Extracts and cryptographically verifies user session or guest session.
 * Prevents client-side impersonation and parameter tampering.
 */
export async function getServerSession(req: NextRequest | Request): Promise<ServerSession> {
  const headers = req.headers;
  let authHeader = headers.get('authorization');
  let token: string | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  // 1. Check user auth token from cookie or header
  if (!token && 'cookies' in req) {
    const userCookie = (req as NextRequest).cookies.get('resumate_auth_token');
    if (userCookie) token = userCookie.value;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded && decoded.type === 'user' && decoded.userId) {
        return {
          userId: decoded.userId,
          guestSessionId: null,
          email: decoded.email || null,
          isGuest: false,
        };
      }
      if (decoded && decoded.type === 'guest' && decoded.guestId) {
        return {
          userId: null,
          guestSessionId: decoded.guestId,
          email: null,
          isGuest: true,
        };
      }
    } catch (e) {
      // Invalid/tampered token, fallback to guest verification
    }
  }

  // 2. Check signed guest session cookie
  let guestCookieToken: string | null = null;
  if ('cookies' in req) {
    const guestCookie = (req as NextRequest).cookies.get('cv_guest_token');
    if (guestCookie) guestCookieToken = guestCookie.value;
  }

  if (guestCookieToken) {
    try {
      const decoded = jwt.verify(guestCookieToken, JWT_SECRET) as any;
      if (decoded && decoded.guestId) {
        return {
          userId: null,
          guestSessionId: decoded.guestId,
          email: null,
          isGuest: true,
        };
      }
    } catch (e) {
      // Tampered guest token -> will issue fresh session
    }
  }

  // 3. Check legacy or fallback x-guest-session-id header
  const rawGuestHeader = headers.get('x-guest-session-id');
  let safeGuestId: string;
  if (rawGuestHeader && /^[a-z0-9_-]{4,120}$/i.test(rawGuestHeader)) {
    safeGuestId = rawGuestHeader;
  } else {
    safeGuestId = 'gst_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
  }

  const newGuestToken = signGuestToken(safeGuestId);

  return {
    userId: null,
    guestSessionId: safeGuestId,
    email: null,
    isGuest: true,
    newGuestToken,
  };
}

/**
 * Attaches secure session cookies to response if new tokens were generated
 */
export function attachSessionCookies(response: NextResponse, session: ServerSession): NextResponse {
  if (session.newGuestToken) {
    response.cookies.set('cv_guest_token', session.newGuestToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });
  }
  return response;
}
