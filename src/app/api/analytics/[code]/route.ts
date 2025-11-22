import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { links, clicks } from '@/lib/schema';
import { eq, sql, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    // Get link data
    const link = await db.select().from(links).where(eq(links.code, code));

    if (link.length === 0) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    const linkData = link[0];

    // Get all clicks for this link
    const linkClicks = await db
      .select()
      .from(clicks)
      .where(eq(clicks.linkId, linkData.id))
      .orderBy(desc(clicks.clickedAt));

    // Calculate statistics
    const totalClicks = linkClicks.length;

    // Geographic breakdown
    const countries = linkClicks.reduce((acc: any, click) => {
      const country = click.country || 'Unknown';
      const countryCode = click.countryCode || 'XX';
      if (!acc[country]) {
        acc[country] = { count: 0, countryCode, cities: {} };
      }
      acc[country].count++;
      
      // Track cities
      const city = click.city || 'Unknown';
      if (!acc[country].cities[city]) {
        acc[country].cities[city] = 0;
      }
      acc[country].cities[city]++;
      
      return acc;
    }, {});

    const countryBreakdown = Object.entries(countries)
      .map(([name, data]: [string, any]) => ({
        country: name,
        countryCode: data.countryCode,
        clicks: data.count,
        percentage: ((data.count / totalClicks) * 100).toFixed(1),
        cities: Object.entries(data.cities)
          .map(([city, count]) => ({ city, clicks: count }))
          .sort((a: any, b: any) => b.clicks - a.clicks)
          .slice(0, 5) // Top 5 cities
      }))
      .sort((a, b) => b.clicks - a.clicks);

    // Device breakdown
    const devices = linkClicks.reduce((acc: any, click) => {
      const device = click.device || 'Unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {});

    const deviceBreakdown = Object.entries(devices)
      .map(([device, count]) => ({
        device,
        clicks: count,
        percentage: (((count as number) / totalClicks) * 100).toFixed(1)
      }))
      .sort((a, b) => b.clicks - a.clicks);

    // Browser breakdown
    const browsers = linkClicks.reduce((acc: any, click) => {
      const browser = click.browser || 'Unknown';
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {});

    const browserBreakdown = Object.entries(browsers)
      .map(([browser, count]) => ({
        browser,
        clicks: count,
        percentage: (((count as number) / totalClicks) * 100).toFixed(1)
      }))
      .sort((a, b) => b.clicks - a.clicks);

    // OS breakdown
    const operatingSystems = linkClicks.reduce((acc: any, click) => {
      const os = click.os || 'Unknown';
      acc[os] = (acc[os] || 0) + 1;
      return acc;
    }, {});

    const osBreakdown = Object.entries(operatingSystems)
      .map(([os, count]) => ({
        os,
        clicks: count,
        percentage: (((count as number) / totalClicks) * 100).toFixed(1)
      }))
      .sort((a, b) => b.clicks - a.clicks);

    // Referrer breakdown
    const referrers = linkClicks.reduce((acc: any, click) => {
      const referrer = click.referrer || 'Direct';
      acc[referrer] = (acc[referrer] || 0) + 1;
      return acc;
    }, {});

    const referrerBreakdown = Object.entries(referrers)
      .map(([referrer, count]) => ({
        referrer,
        clicks: count,
        percentage: (((count as number) / totalClicks) * 100).toFixed(1)
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10); // Top 10 referrers

    // Time-based data (last 7 days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    
    const recentClicks = linkClicks.filter(
      click => new Date(click.clickedAt) >= last7Days
    );

    // Group by day
    const clicksByDay = recentClicks.reduce((acc: any, click) => {
      const date = new Date(click.clickedAt).toLocaleDateString('en-US');
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Group by hour (24-hour heatmap)
    const clicksByHour = linkClicks.reduce((acc: any, click) => {
      const hour = new Date(click.clickedAt).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      clicks: clicksByHour[i] || 0
    }));

    // Recent individual clicks (last 10)
    const recentClicksList = linkClicks.slice(0, 10).map(click => ({
      country: click.country,
      countryCode: click.countryCode,
      city: click.city,
      device: click.device,
      browser: click.browser,
      os: click.os,
      referrer: click.referrer,
      timestamp: click.clickedAt
    }));

    return NextResponse.json({
      link: {
        code: linkData.code,
        url: linkData.url,
        totalClicks: linkData.clicks,
        createdAt: linkData.createdAt,
        lastClickedAt: linkData.lastClickedAt,
        expiresAt: linkData.expiresAt,
        maxClicks: linkData.maxClicks,
        isActive: linkData.isActive,
        hasPassword: !!linkData.password
      },
      analytics: {
        totalTrackedClicks: totalClicks,
        geographic: {
          countries: countryBreakdown,
          topCountries: countryBreakdown.slice(0, 5)
        },
        devices: deviceBreakdown,
        browsers: browserBreakdown,
        operatingSystems: osBreakdown,
        referrers: referrerBreakdown,
        timeData: {
          last7Days: clicksByDay,
          hourly: hourlyData
        },
        recentClicks: recentClicksList
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}