import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      app: 'web',
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        web: { status: 'healthy' },
      },
    },
    { status: 200 },
  );
}
