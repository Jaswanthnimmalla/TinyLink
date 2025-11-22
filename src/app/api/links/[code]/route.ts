import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { links } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// GET link stats by code
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
    
    // Return link with all statistics
    return NextResponse.json(link[0]);
  } catch (error) {
    console.error('Error fetching link:', error);
    return NextResponse.json(
      { error: 'Failed to fetch link' },
      { status: 500 }
    );
  }
}

// DELETE link by code
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    
    // Check if link exists before deleting
    const existing = await db.select().from(links).where(eq(links.code, code));
    
    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }
    
    // Delete the link
    await db.delete(links).where(eq(links.code, code));
    
    return NextResponse.json({ 
      success: true,
      message: 'Link deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json(
      { error: 'Failed to delete link' },
      { status: 500 }
    );
  }
}
