import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { links } from '@/lib/schema';
import { sql, gte, or } from 'drizzle-orm';

export async function GET() {
  try {
    // Get total links count
    const totalLinksResult = await db.select({ count: sql<number>`count(*)::int` }).from(links);
    const totalLinks = totalLinksResult[0]?.count || 0;

    // Get total clicks
    const totalClicksResult = await db.select({ total: sql<number>`sum(${links.clicks})::int` }).from(links);
    const totalClicks = totalClicksResult[0]?.total || 0;

    // Get links created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const linksTodayResult = await db.select({ count: sql<number>`count(*)::int` })
      .from(links)
      .where(gte(links.createdAt, today));
    const linksToday = linksTodayResult[0]?.count || 0;

    // Get clicks in last hour (approximate based on last clicked at)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const clicksLastHourResult = await db.select({ count: sql<number>`count(*)::int` })
      .from(links)
      .where(gte(links.lastClickedAt, oneHourAgo));
    const clicksLastHour = clicksLastHourResult[0]?.count || 0;

    // Calculate active users based on recent activity (last 15 minutes)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    
    // Count unique users who either:
    // 1. Created a link in last 15 minutes
    // 2. Had their link clicked in last 15 minutes
    const recentActivityResult = await db.select({ count: sql<number>`count(distinct id)::int` })
      .from(links)
      .where(
        or(
          gte(links.createdAt, fifteenMinutesAgo),
          gte(links.lastClickedAt, fifteenMinutesAgo)
        )
      );
    
    // Active users = number of links with recent activity
    // (in a real app with auth, this would count distinct user IDs)
    let activeUsers = recentActivityResult[0]?.count || 0;
    
    // If no recent activity, show at least 1 if there are any links
    // This represents the current user viewing the page
    if (activeUsers === 0 && totalLinks > 0) {
      activeUsers = 1;
    }

    return NextResponse.json({
      totalLinks,
      totalClicks,
      linksToday,
      clicksLastHour,
      activeUsers
    });
  } catch (error) {
    console.error('Error fetching live stats:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch live statistics',
        totalLinks: 0,
        totalClicks: 0,
        linksToday: 0,
        clicksLastHour: 0,
        activeUsers: 0
      },
      { status: 500 }
    );
  }
}