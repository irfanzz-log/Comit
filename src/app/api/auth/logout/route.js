import { NextResponse } from 'next/server';

export async function POST(req) {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: 'token',
    value: '',
    path: '/',
    maxAge: 0, // hapus cookie
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return response;
}