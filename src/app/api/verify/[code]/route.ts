import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { links, clicks } from '@/lib/schema';
import { eq, sql } from 'drizzle-orm';
import { parseUserAgent, getGeolocation, getClientIP } from '@/lib/analytics';
import * as bcrypt from 'bcryptjs';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Get link
    const link = await db.select().from(links).where(eq(links.code, code));

    if (link.length === 0) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    const linkData = link[0];

    // Check if link has a password
    if (!linkData.password) {
      return NextResponse.json(
        { error: 'This link is not password protected' },
        { status: 400 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, linkData.password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Password correct! Track the click and return destination URL
    
    // ANALYTICS TRACKING
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const referrer = request.headers.get('referer') || request.headers.get('referrer') || 'Direct';
    const ipAddress = getClientIP(request);
    const deviceInfo = parseUserAgent(userAgent);
    
    // Track click asynchronously
    const trackClick = async () => {
      try {
        const geoData = await getGeolocation(ipAddress);
        
        await db.insert(clicks).values({
          linkId: linkData.id,
          country: geoData?.country || 'Unknown',
          countryCode: geoData?.countryCode || 'XX',
          city: geoData?.city || 'Unknown',
          region: geoData?.region || 'Unknown',
          ipAddress: ipAddress,
          device: deviceInfo.device,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
          referrer: referrer,
          userAgent: userAgent,
          clickedAt: new Date(),
        });
      } catch (error) {
        console.error('Error tracking click:', error);
      }
    };
    
    trackClick();
    
    // Update click count
    await db
      .update(links)
      .set({ 
        clicks: sql`${links.clicks} + 1`,
        lastClickedAt: new Date()
      })
      .where(eq(links.code, code));

    // Return destination URL
    return NextResponse.json({
      success: true,
      redirectUrl: linkData.url
    });
  } catch (error) {
    console.error('Error verifying password:', error);
    return NextResponse.json(
      { error: 'Failed to verify password' },
      { status: 500 }
    );
  }
}