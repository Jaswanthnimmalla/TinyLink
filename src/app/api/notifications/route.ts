import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { clicks, links } from '@/lib/schema';
import { desc, gte, sql } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const since = searchParams.get('since');
    
    // Get recent notifications (last 5 minutes by default)
    const sinceDate = since 
      ? new Date(since) 
      : new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago

    // Fetch emitted notifications (link created, deleted, etc.)
    let emittedNotifications = [];
    try {
      const emitResponse = await fetch(
        `${new URL(request.url).origin}/api/notifications/emit?since=${sinceDate.toISOString()}`
      );
      if (emitResponse.ok) {
        const emitData = await emitResponse.json();
        emittedNotifications = emitData.notifications || [];
      }
    } catch (error) {
      console.error('Error fetching emitted notifications:', error);
    }

    // Fetch click notifications from database
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

    // Transform click notifications
    const clickNotifications = recentClicks.map((click) => ({
      id: `notif-click-${click.id}`,
      type: 'click',
      title: '🔗 New Click!',
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

    // Combine all notifications and sort by timestamp
    const allNotifications = [...emittedNotifications, ...clickNotifications].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({
      notifications: allNotifications,
      count: allNotifications.length,
      since: sinceDate.toISOString(),
      breakdown: {
        emitted: emittedNotifications.length,
        clicks: clickNotifications.length,
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}