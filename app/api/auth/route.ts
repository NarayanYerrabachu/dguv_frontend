import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { emmaId, email } = await request.json();

    if (!emmaId || typeof emmaId !== 'string') {
      return NextResponse.json(
        { error: 'emmaId is required and must be a string' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'email is required and must be a string' },
        { status: 400 }
      );
    }

    const authUrl = process.env.AUTH_URL;
    const authHeader = process.env.AUTH_HEADER;

    let authData = {
      hey_gen_allowed: true,
      idle_time: 1000000,
    };

    if (!authUrl || !authHeader) {
      if (emmaId !== '1234' || email !== 'test@test.com') {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }
    } else {
      try {
        const headers = JSON.parse(authHeader);
        const response = await fetch(authUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify({ emmaId, email }),
        });

        if (!response.ok) {
          return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 401 }
          );
        }

        authData = await response.json();
      } catch (error) {
        console.error('Auth service error:', error);
        return NextResponse.json(
          { error: 'Authentication service error' },
          { status: 500 }
        );
      }
    }

    const jwtSecret = process.env.JWT_SECRET || 'avatar-webcomp-jwt-secret';
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '8h';

    const accessToken = jwt.sign({ emmaId, email }, jwtSecret, {
      expiresIn: jwtExpiresIn as jwt.SignOptions['expiresIn'],
    });

    return NextResponse.json({
      ...authData,
      accessToken,
    });
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
