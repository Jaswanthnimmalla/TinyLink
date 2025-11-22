import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { links } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    // Check if code exists in database
    const existingLink = await db.select().from(links).where(eq(links.code, code));

    return NextResponse.json({ 
      available: existingLink.length === 0,
      code 
    });
  } catch (error) {
    console.error('Error checking code availability:', error);
    return NextResponse.json({ error: 'Failed to check availability' }, { status: 500 });
  }
}