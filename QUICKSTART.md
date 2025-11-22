# 🚀 TinyLink - Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites

- Node.js 18+
- PostgreSQL database (local or hosted)

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env and add your database URL
# DATABASE_URL=postgresql://user:password@localhost:5432/tinylink
# NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Initialize Database

```bash
npm run db:init
```

This will create the `links` table with the following schema:

```sql
CREATE TABLE links (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  code TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  clicks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_clicked_at TIMESTAMP
);
```

### 4. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## Usage

### Create a Short Link

**Via UI:**

1. Go to homepage (http://localhost:3000)
2. Enter a long URL
3. (Optional) Enter a custom code (6-8 alphanumeric)
4. Click "Shorten URL"
5. Copy your short link!

**Via API:**

```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/very/long/url"}'
```

### View Dashboard

Go to http://localhost:3000/dashboard to:

- View all links
- See click statistics
- Search/filter links
- Delete links

### View Individual Stats

Go to http://localhost:3000/code/YOUR_CODE to see:

- Total clicks
- Created date
- Last clicked time

### Use Short Links

Simply visit http://localhost:3000/YOUR_CODE and you'll be redirected!

## Testing

### Health Check

```bash
curl http://localhost:3000/healthz
```

Expected response:

```json
{
  "ok": true,
  "version": "1.0",
  "timestamp": "2025-11-22T12:00:00.000Z",
  "database": {
    "connected": true
  }
}
```

### Create Link

```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"url": "https://google.com", "customCode": "test123"}'
```

### Get All Links

```bash
curl http://localhost:3000/api/links
```

### Delete Link

```bash
curl -X DELETE http://localhost:3000/api/links/test123
```

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
    - `DATABASE_URL` - Your PostgreSQL URL (e.g., from Neon, Supabase, or Railway)
    - `NEXT_PUBLIC_BASE_URL` - Your production domain
4. Deploy!

### Build Locally

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Troubleshooting

### Database Connection Issues

1. Verify your `DATABASE_URL` in `.env`
2. Ensure PostgreSQL is running
3. Check firewall/network settings
4. Test connection: `npm run db:init`

### Port Already in Use

```bash
# Use a different port
PORT=3001 npm run dev
```

### TypeScript Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install
```

## Next Steps

- [ ] Customize the UI (edit `src/app/page.tsx` and `src/app/dashboard/page.tsx`)
- [ ] Add authentication (integrate NextAuth.js)
- [ ] Set up analytics (integrate Google Analytics or Plausible)
- [ ] Deploy to production
- [ ] Set up monitoring (integrate Sentry)
- [ ] Add rate limiting (implement middleware)

## Documentation

- [README.md](README.md) - Full documentation
- [FEATURES_IMPLEMENTED.md](FEATURES_IMPLEMENTED.md) - Feature list
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Code structure
- [IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md) - Completion status

## Support

If you encounter issues:

1. Check the [README.md](README.md)
2. Review error messages in the console
3. Verify environment variables
4. Check database connectivity

---

**Happy shortening! 🔗**
