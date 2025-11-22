import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { links } from '@/lib/schema';
import { createLinkSchema } from '@/lib/validation';
import { nanoid, isValidCode } from '@/lib/utils';
import { eq } from 'drizzle-orm';

// GET all links
export async function GET() {
  try {
    const allLinks = await db.select().from(links).orderBy(links.createdAt);
    return NextResponse.json(allLinks);
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

// POST create new link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = createLinkSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }
    
    const validated = validationResult.data;
    
    // Generate or use custom code
    let code: string;
    
    if (validated.customCode) {
      code = validated.customCode;
      
      // Validate custom code format
      if (!isValidCode(code)) {
        return NextResponse.json(
          { error: 'Custom code must be 6-8 alphanumeric characters [A-Za-z0-9]' },
          { status: 400 }
        );
      }
    } else {
      code = nanoid(6);
    }
    
    // Check if code already exists (globally unique enforcement)
    const existing = await db.select().from(links).where(eq(links.code, code));
    
    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Code already exists. Please choose a different custom code.' },
        { status: 409 }
      );
    }
    
    // Create new link
    const newLink = await db.insert(links).values({
      code,
      url: validated.url,
      createdAt: new Date(),
      clicks: 0,
      lastClickedAt: null,
    }).returning();
    
    return NextResponse.json(newLink[0], { status: 201 });
  } catch (error) {
    console.error('Error creating link:', error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    );
  }
}
