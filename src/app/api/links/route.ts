import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { links, tags, linkTags } from '@/lib/schema';
import { createLinkSchema } from '@/lib/validation';
import { nanoid, isValidCode } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';

// GET all links with their tags
export async function GET() {
  try {
    const allLinks = await db.select().from(links).orderBy(links.createdAt);
    
    // Get tags for each link
    const linksWithTags = await Promise.all(
      allLinks.map(async (link) => {
        const linkTagsData = await db
          .select({
            tagId: linkTags.tagId,
            tagName: tags.name,
            tagColor: tags.color
          })
          .from(linkTags)
          .leftJoin(tags, eq(linkTags.tagId, tags.id))
          .where(eq(linkTags.linkId, link.id));
        
        return {
          ...link,
          tags: linkTagsData.map(t => ({ id: t.tagId, name: t.tagName, color: t.tagColor }))
        };
      })
    );
    
    return NextResponse.json(linksWithTags);
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

// POST create new link with optional expiration, password, and tags
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
    
    // Handle optional password (hash it)
    let hashedPassword: string | null = null;
    if (body.password && body.password.trim()) {
      hashedPassword = await bcrypt.hash(body.password, 10);
    }
    
    // Handle optional expiration date
    let expiresAt: Date | null = null;
    if (body.expiresAt) {
      expiresAt = new Date(body.expiresAt);
    } else if (body.expiresInDays) {
      // Alternative: expires in X days
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(body.expiresInDays));
    }
    
    // Handle max clicks
    const maxClicks = body.maxClicks ? parseInt(body.maxClicks) : null;
    
    // Create new link
    const newLink = await db.insert(links).values({
      code,
      url: validated.url,
      createdAt: new Date(),
      clicks: 0,
      lastClickedAt: null,
      expiresAt: expiresAt,
      maxClicks: maxClicks,
      password: hashedPassword,
      isActive: true
    }).returning();
    
    const linkId = newLink[0].id;
    
    // Handle tags if provided
    if (body.tags && Array.isArray(body.tags) && body.tags.length > 0) {
      for (const tagName of body.tags) {
        if (!tagName || !tagName.trim()) continue;
        
        // Check if tag exists, create if not
        let tag = await db.select().from(tags).where(eq(tags.name, tagName.trim()));
        
        let tagId: number;
        if (tag.length === 0) {
          // Create new tag with default color
          const newTag = await db.insert(tags).values({
            name: tagName.trim(),
            color: '#6366f1', // Default indigo
            createdAt: new Date()
          }).returning();
          tagId = newTag[0].id;
        } else {
          tagId = tag[0].id;
        }
        
        // Create link-tag association
        await db.insert(linkTags).values({
          linkId: linkId,
          tagId: tagId,
          createdAt: new Date()
        });
      }
    }
    
    // Fetch the created link with tags
    const linkTagsData = await db
      .select({
        tagId: linkTags.tagId,
        tagName: tags.name,
        tagColor: tags.color
      })
      .from(linkTags)
      .leftJoin(tags, eq(linkTags.tagId, tags.id))
      .where(eq(linkTags.linkId, linkId));
    
    const linkWithTags = {
      ...newLink[0],
      tags: linkTagsData.map(t => ({ id: t.tagId, name: t.tagName, color: t.tagColor }))
    };
    
    return NextResponse.json(linkWithTags, { status: 201 });
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
