import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  code: text('code').notNull().unique(),
  url: text('url').notNull(),
  clicks: integer('clicks').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  lastClickedAt: timestamp('last_clicked_at'),
});

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
