'use client';

const GUEST_SESSION_KEY = 'resumate_guest_session_id';
const ACTIVE_RESUME_KEY = 'resumate_active_resume_id';
const AUTH_TOKEN_KEY = 'resumate_auth_token';

/**
 * Retrieves or initializes a unique, secure guest session ID.
 */
export function getOrCreateGuestSessionId(): string {
  if (typeof window === 'undefined') {
    return 'guest_server';
  }

  let sessionId = localStorage.getItem(GUEST_SESSION_KEY);
  if (!sessionId) {
    sessionId = 'gst_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now().toString(36);
    localStorage.setItem(GUEST_SESSION_KEY, sessionId);
  }

  // Also maintain cookie for server API reading
  try {
    document.cookie = `x-guest-session-id=${sessionId}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  } catch (e) {
    // Ignore cookie errors
  }

  return sessionId;
}

/**
 * Gets the active resume ID from local storage.
 */
export function getActiveResumeId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_RESUME_KEY);
}

/**
 * Sets the active resume ID in local storage.
 */
export function setActiveResumeId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_RESUME_KEY, id);
}

/**
 * Gets the current auth JWT token if logged in.
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Sets the current auth JWT token.
 */
export function setAuthToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}
