import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  const timestamp = new Date().toISOString();
  
  try {
    // Test database connectivity
    await db.execute(sql`SELECT 1`);
    
    return NextResponse.json({ 
      ok: true,
      version: '1.0',
      timestamp,
      database: {
        connected: true
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({ 
      ok: false,
      version: '1.0',
      timestamp,
      database: {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 503 });
  }
}
