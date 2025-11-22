# TinyLink - URL Shortener

> ✅ **Status**: All core features implemented and production-ready!

A modern, fast, and simple URL shortening service built with Next.js 16, TypeScript, Tailwind CSS,
and PostgreSQL.

## ✨ Features

- 🔗 Create short, memorable links (6-8 alphanumeric codes)
- 📊 Track click analytics with timestamps
- 🎨 Beautiful, modern UI with Tailwind CSS v4
- ⚡ Lightning-fast performance with Next.js App Router
- 🔒 Secure with URL validation and unique code enforcement
- 📱 Fully responsive design
- 🎯 Custom short codes (optional)
- ❌ Delete links with immediate 404 response
- 🔍 Search and filter functionality
- 💚 Health check endpoint with database monitoring

## 🏗️ Project Structure

```
tinylink/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── links/        # Link CRUD operations
│   │   │   └── redirect/     # Redirect handler
│   │   ├── code/[code]/      # Link statistics page
│   │   ├── [code]/           # Dynamic redirect page
│   │   ├── healthz/          # Health check endpoint
│   │   ├── dashboard/        # Dashboard page
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/            # React components (14 total)
│   │   ├── Layout/           # Header, Footer, Container
│   │   ├── Dashboard/        # LinkTable, AddLinkForm, etc.
│   │   ├── UI/               # Button, Input, Modal, etc.
│   │   └── Stats/            # StatsOverview, ClickChart
│   ├── lib/                  # Utilities and config
│   │   ├── db.ts            # Database connection
│   │   ├── schema.ts        # Drizzle ORM schema
│   │   ├── utils.ts         # Helper functions
│   │   └── validation.ts    # Zod schemas
│   └── types/                # TypeScript types
├── scripts/                   # Utility scripts
│   └── init-db.ts           # Database initialization
└── public/                   # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm/yarn/pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tinylink.git
cd tinylink
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database URL:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/tinylink
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Initialize the database:
```bash
npm run db:init
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Icons**: Lucide React

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:init` - Initialize database

## 📝 API Endpoints

### Links Management

- `POST /api/links` - Create new link
    - Body: `{ url: string, customCode?: string }`
    - Returns: `201` with link data, `409` if code exists, `400` for validation errors

- `GET /api/links` - Get all links
    - Returns: `200` with array of links

- `GET /api/links/:code` - Get link stats by code
    - Returns: `200` with link data, `404` if not found

- `DELETE /api/links/:code` - Delete a link
    - Returns: `200` on success, `404` if not found

### Redirection

- `GET /api/redirect/:code` - Redirect and track click
    - Returns: `302` redirect, `404` if not found
    - Increments click count and updates last clicked timestamp

- `GET /:code` - Short URL redirect page
    - Returns: `302` redirect or `404` page

### Monitoring

- `GET /healthz` - Health check
    - Returns: `200` if healthy, `503` if database unavailable
    - Response: `{ ok: boolean, version: string, timestamp: string, database: {...} }`

## 🎨 Pages

### Homepage (`/`)

- URL shortening form
- Custom code input (optional)
- Success message with copy button
- Feature highlights
- Link to dashboard

### Dashboard (`/dashboard`)

- Statistics overview (Total Links, Total Clicks, Average)
- Add new link form
- Links table with:
    - Short code with copy button
    - Target URL with external link indicator
    - Total clicks
    - Last clicked timestamp
    - View stats button
    - Delete button
- Search/filter by code or URL

### Stats Page (`/code/:code`)

- Short URL display with copy button
- Original URL (clickable)
- Total clicks (large display)
- Created date/time
- Last clicked date/time
- Back navigation

## 🗄️ Database Schema

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

## ✅ Core Features Implementation

### 1. URL Shortening

- ✅ Generate 6-8 alphanumeric codes `[A-Za-z0-9]{6,8}`
- ✅ Support custom codes
- ✅ Validate URLs before saving (http/https only)
- ✅ Unique code enforcement (returns 409 if exists)

### 2. Redirection System

- ✅ HTTP 302 redirects
- ✅ Click counting (atomic increments)
- ✅ Last clicked timestamp

### 3. Dashboard

- ✅ List all shortened links
- ✅ View click statistics
- ✅ Add/delete links
- ✅ Search and filter

### 4. Statistics

- ✅ Individual link stats page
- ✅ Total clicks tracking
- ✅ Last accessed time

### 5. Health Monitoring

- ✅ System status endpoint
- ✅ Database connectivity check

## 📊 Usage Examples

### Create a short link (cURL)

```bash
# With auto-generated code
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/very/long/url"}'

# With custom code
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/page", "customCode": "mycode"}'
```

### Get all links

```bash
curl http://localhost:3000/api/links
```

### Delete a link

```bash
curl -X DELETE http://localhost:3000/api/links/abc123
```

### Check health

```bash
curl http://localhost:3000/healthz
```

## 🧪 Testing

According to the specification, the following should be verified:

1. ✅ `/healthz` returns 200
2. ✅ Creating a link works; duplicate codes return 409
3. ✅ Redirect works and increments click count
4. ✅ Deletion stops redirect (404)
5. ✅ UI meets expectations (layout, states, form validation, responsiveness)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Icons by [Lucide](https://lucide.dev)
- Database with [Drizzle ORM](https://orm.drizzle.team)
- Validation with [Zod](https://zod.dev)

## Screenshots

### Homepage

![Homepage](https://example.com/homepage.png)

### Dashboard

![Dashboard](https://example.com/dashboard.png)

### Stats Page

![Stats Page](https://example.com/stats-page.png)

## Deployment Guides

### Deploy to Vercel

1. Sign up at [vercel.com](https://vercel.com)
2. Create a new project
3. Import your repository
4. Configure environment variables
5. Deploy!

### Deploy to Railway

1. Sign up at [railway.app](https://railway.app)
2. Create a new project
3. Import your repository
4. Configure environment variables
5. Deploy!

### Deploy to Render

1. Sign up at [render.com](https://render.com)
2. Create a new project
3. Import your repository
4. Configure environment variables
5. Deploy!

## Troubleshooting

### Common Issues

- **Database connection failed**: Check your database credentials and connection string.
- **Port already in use**: Use a different port or stop the process using the port.
- **Build errors**: Clear the cache and reinstall dependencies.

### Solutions

1. **Database connection failed**: Verify your database credentials and connection string.
2. **Port already in use**: Use a different port or stop the process using the port.
3. **Build errors**: Clear the cache and reinstall dependencies.

