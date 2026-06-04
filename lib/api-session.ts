import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getSessionIdFromHeader } from '@/lib/session';

const SESSION_COOKIE = 'reclama_session_id';

export function resolveSessionId(request: Request): string {
  return getSessionIdFromHeader(request) ?? randomUUID();
}

export function withSessionCookie(response: NextResponse, sessionId: string) {
  response.cookies.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 90,
  });
  return response;
}
