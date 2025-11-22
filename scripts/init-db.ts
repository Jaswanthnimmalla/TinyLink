import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL environment variable is not set');
  console.error('');
  console.error('Please create a .env file with:');
  console.error('DATABASE_URL=your-database-connection-string');
  process.exit(1);
}

const sql = postgres(connectionString, { max: 1 });
const db = drizzle(sql);

// Define schema
const links = pgTable('links', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  code: text('code').notNull().unique(),
  url: text('url').notNull(),
  clicks: integer('clicks').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  lastClickedAt: timestamp('last_clicked_at'),
});

async function main() {
  console.log('🚀 Initializing database...');

  try {
    // Create table with all fields
    await sql`
      CREATE TABLE IF NOT EXISTS links (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        code TEXT NOT NULL UNIQUE,
        url TEXT NOT NULL,
        clicks INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        last_clicked_at TIMESTAMP
      );
    `;

    console.log('✅ Database initialized successfully!');
    console.log('📊 Table "links" is ready');
    console.log('');
    console.log('Schema:');
    console.log('  - id: INTEGER (auto-increment primary key)');
    console.log('  - code: TEXT (unique, 6-8 alphanumeric)');
    console.log('  - url: TEXT (original URL)');
    console.log('  - clicks: INTEGER (default 0)');
    console.log('  - created_at: TIMESTAMP (default NOW)');
    console.log('  - last_clicked_at: TIMESTAMP (nullable)');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
