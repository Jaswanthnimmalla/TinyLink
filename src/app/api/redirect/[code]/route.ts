import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { links, clicks } from '@/lib/schema';
import { eq, sql } from 'drizzle-orm';
import { parseUserAgent, getGeolocation, getClientIP } from '@/lib/analytics';
// import { emitNotification } from '@/lib/socket-server';

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
    
    const linkData = link[0];
    
    // Check if link is active
    if (!linkData.isActive) {
      return NextResponse.redirect(new URL(`/expired?reason=inactive&code=${code}`, request.url));
    }
    
    // Check if link has expired (by date)
    if (linkData.expiresAt && new Date(linkData.expiresAt) < new Date()) {
      // Mark as inactive
      await db
        .update(links)
        .set({ isActive: false })
        .where(eq(links.code, code));
      
      return NextResponse.redirect(new URL(`/expired?reason=date&code=${code}`, request.url));
    }
    
    // Check if max clicks reached
    if (linkData.maxClicks && linkData.clicks >= linkData.maxClicks) {
      // Mark as inactive
      await db
        .update(links)
        .set({ isActive: false })
        .where(eq(links.code, code));
      
      return NextResponse.redirect(new URL(`/expired?reason=clicks&code=${code}&max=${linkData.maxClicks}`, request.url));
    }
    
    // Check if password is required
    if (linkData.password) {
      // Redirect to password verification page
      return NextResponse.redirect(new URL(`/verify/${code}`, request.url));
    }
    
    // ANALYTICS TRACKING - Capture data
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const referrer = request.headers.get('referer') || request.headers.get('referrer') || 'Direct';
    const ipAddress = getClientIP(request);
    
    // Parse device info from user agent
    const deviceInfo = parseUserAgent(userAgent);
    
    // Get geolocation (async, don't block redirect)
    const trackClick = async () => {
      try {
        const geoData = await getGeolocation(ipAddress);
        
        // Store click data in database
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

        // TODO: Real-time notification emission (requires custom server setup)
        // Uncomment when custom server is running
        /*
        emitNotification({
          type: 'click',
          title: 'New Click!',
          message: `Your link /${code} was just clicked`,
          linkCode: code,
          data: {
            location: geoData?.city ? `${geoData.city}, ${geoData.country}` : geoData?.country || 'Unknown',
            device: `${deviceInfo.device} - ${deviceInfo.browser}`,
            timestamp: new Date().toISOString(),
          }
        });
        */
      } catch (error) {
        console.error('Error tracking click:', error);
      }
    };
    
    // Track click asynchronously (don't wait for it)
    trackClick();
    
    // Increment click count and update last clicked timestamp
    await db
      .update(links)
      .set({ 
        clicks: sql`${links.clicks} + 1`,
        lastClickedAt: new Date()
      })
      .where(eq(links.code, code));
    
    // Perform HTTP 302 redirect
    return NextResponse.redirect(linkData.url, { status: 302 });
  } catch (error) {
    console.error('Error redirecting:', error);
    return NextResponse.json(
      { error: 'Failed to redirect' },
      { status: 500 }
    );
  }
}
