import { redirect, notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { links } from '@/lib/schema';
import { eq, sql } from 'drizzle-orm';

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function RedirectPage({ params }: PageProps) {
  // Await params in Next.js 16
  const { code } = await params;
  
  // Get the link directly from database
  const link = await db.select().from(links).where(eq(links.code, code));
  
  if (link.length === 0) {
    // Link not found
    notFound();
  }
  
  // Increment click count and update last clicked timestamp
  await db
    .update(links)
    .set({ 
      clicks: sql`${links.clicks} + 1`,
      lastClickedAt: new Date()
    })
    .where(eq(links.code, code));
  
  // Perform the redirect (this throws NEXT_REDIRECT which is expected)
  redirect(link[0].url);
}
