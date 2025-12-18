import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Default password for development
const AUTH_COOKIE_NAME = 'admin-auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function verifyPassword(password: string): Promise<boolean> {
  return password === ADMIN_PASSWORD;
}

export async function setAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
  return authCookie?.value === 'authenticated';
}
