import { pgTable, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

// Links table with new fields for expiration and password
export const links = pgTable('links', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  code: text('code').notNull().unique(),
  url: text('url').notNull(),
  clicks: integer('clicks').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  lastClickedAt: timestamp('last_clicked_at'),
  
  // New fields for Feature 2: Expiration + Password
  expiresAt: timestamp('expires_at'),
  maxClicks: integer('max_clicks'),
  password: text('password'), // hashed password
  isActive: boolean('is_active').notNull().default(true),
});

// Clicks tracking table for Feature 1: Geographic + Device Analytics
export const clicks = pgTable('clicks', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  linkId: integer('link_id').notNull().references(() => links.id, { onDelete: 'cascade' }),
  
  // Geographic data
  country: text('country'),
  countryCode: text('country_code'), // US, UK, CA, etc.
  city: text('city'),
  region: text('region'),
  ipAddress: text('ip_address'),
  
  // Device data
  device: text('device'), // Mobile, Desktop, Tablet
  browser: text('browser'), // Chrome, Safari, Firefox, etc.
  os: text('os'), // iOS, Android, Windows, macOS, Linux
  
  // Additional data
  referrer: text('referrer'), // Where the click came from
  userAgent: text('user_agent'), // Full user agent string
  
  clickedAt: timestamp('clicked_at').notNull().defaultNow(),
});

// Tags table for Feature 3: Tags & Categories
export const tags = pgTable('tags', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull().unique(),
  color: text('color').notNull().default('#6366f1'), // Default indigo color
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Link-Tags junction table (many-to-many)
export const linkTags = pgTable('link_tags', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  linkId: integer('link_id').notNull().references(() => links.id, { onDelete: 'cascade' }),
  tagId: integer('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Type exports
export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;
export type Click = typeof clicks.$inferSelect;
export type NewClick = typeof clicks.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type LinkTag = typeof linkTags.$inferSelect;
