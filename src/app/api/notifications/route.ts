import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { clicks, links } from '@/lib/schema';
import { desc, gte, sql } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const since = searchParams.get('since');
    
    // Get recent clicks (last 5 minutes by default)
    const sinceDate = since 
      ? new Date(since) 
      : new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago

    // Get recent clicks with link information
    const recentClicks = await db
      .select({
        id: clicks.id,
        linkId: clicks.linkId,
        linkCode: links.code,
        country: clicks.country,
        city: clicks.city,
        device: clicks.device,
        browser: clicks.browser,
        clickedAt: clicks.clickedAt,
      })
      .from(clicks)
      .innerJoin(links, sql`${clicks.linkId} = ${links.id}`)
      .where(gte(clicks.clickedAt, sinceDate))
      .orderBy(desc(clicks.clickedAt))
      .limit(20);

    // Transform into notifications format
    const notifications = recentClicks.map((click) => ({
      id: `notif-${click.id}`,
      type: 'click',
      title: 'New Click!',
      message: `Your link /${click.linkCode} was just clicked`,
      linkCode: click.linkCode,
      data: {
        location: click.city ? `${click.city}, ${click.country}` : click.country || 'Unknown',
        device: `${click.device} - ${click.browser}`,
        timestamp: click.clickedAt?.toISOString() || new Date().toISOString(),
      },
      timestamp: click.clickedAt?.toISOString() || new Date().toISOString(),
      read: false,
    }));

    return NextResponse.json({
      notifications,
      count: notifications.length,
      since: sinceDate.toISOString(),
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}