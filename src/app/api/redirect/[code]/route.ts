import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { links } from '@/lib/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const link = await db.select().from(links).where(eq(links.code, code));
    
    if (link.length === 0) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }
    
    // Increment click count and update last clicked timestamp
    await db
      .update(links)
      .set({ 
        clicks: sql`${links.clicks} + 1`,
        lastClickedAt: new Date()
      })
      .where(eq(links.code, code));
    
    // Perform HTTP 302 redirect
    return NextResponse.redirect(link[0].url, { status: 302 });
  } catch (error) {
    console.error('Error redirecting:', error);
    return NextResponse.json(
      { error: 'Failed to redirect' },
      { status: 500 }
    );
  }
}
