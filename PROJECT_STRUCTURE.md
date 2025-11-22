# TinyLink Project Structure

## Directory Tree

```
tinylink/
├── 📁 src/
│   ├── 📁 app/
│   │   ├── layout.tsx                    # Root layout with metadata
│   │   ├── page.tsx                      # Homepage with URL shortener form
│   │   ├── globals.css                   # Global styles
│   │   ├── favicon.ico                   # Favicon
│   │   │
│   │   ├── 📁 healthz/
│   │   │   └── route.ts                  # Health check endpoint
│   │   │
│   │   ├── 📁 api/
│   │   │   ├── 📁 links/
│   │   │   │   ├── route.ts              # GET all links, POST create link
│   │   │   │   └── 📁 [code]/
│   │   │   │       └── route.ts          # GET link by code, DELETE link
│   │   │   │
│   │   │   └── 📁 redirect/
│   │   │       └── 📁 [code]/
│   │   │           └── route.ts          # Redirect & increment clicks
│   │   │
│   │   ├── 📁 code/
│   │   │   └── 📁 [code]/
│   │   │       └── page.tsx              # Link statistics page
│   │   │
│   │   └── 📁 [code]/
│   │       └── page.tsx                  # Dynamic redirect page
│   │
│   ├── 📁 lib/
│   │   ├── db.ts                         # Database connection (Drizzle + Postgres)
│   │   ├── schema.ts                     # Database schema definition
│   │   ├── utils.ts                      # Helper functions (nanoid, clipboard, etc.)
│   │   └── validation.ts                 # Zod validation schemas
│   │
│   ├── 📁 components/
│   │   ├── 📁 Layout/
│   │   │   ├── Header.tsx                # Navigation header
│   │   │   ├── Footer.tsx                # Site footer
│   │   │   └── Container.tsx             # Content wrapper
│   │   │
│   │   ├── 📁 Dashboard/
│   │   │   ├── LinkTable.tsx             # Display links in table
│   │   │   ├── AddLinkForm.tsx           # Form to create new links
│   │   │   ├── SearchBar.tsx             # Filter/search links
│   │   │   └── StatsCard.tsx             # Statistics display card
│   │   │
│   │   ├── 📁 UI/
│   │   │   ├── Button.tsx                # Reusable button component
│   │   │   ├── Input.tsx                 # Styled input field
│   │   │   ├── Modal.tsx                 # Dialog/modal component
│   │   │   ├── LoadingSpinner.tsx        # Loading indicator
│   │   │   └── CopyButton.tsx            # Copy to clipboard button
│   │   │
│   │   └── 📁 Stats/
│   │       ├── StatsOverview.tsx         # Overview statistics
│   │       └── ClickChart.tsx            # Click analytics chart
│   │
│   └── 📁 types/
│       └── index.ts                      # TypeScript type definitions
│
├── 📁 scripts/
│   └── init-db.ts                        # Database initialization script
│
├── 📁 public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── 📄 .env.example                        # Environment variables template
├── 📄 .gitignore                          # Git ignore rules
├── 📄 package.json                        # Dependencies and scripts
├── 📄 next.config.ts                      # Next.js configuration
├── 📄 tailwind.config.ts                  # Tailwind CSS configuration
├── 📄 postcss.config.mjs                  # PostCSS configuration
├── 📄 tsconfig.json                       # TypeScript configuration
├── 📄 drizzle.config.ts                   # Drizzle ORM configuration
├── 📄 eslint.config.mjs                   # ESLint configuration
├── 📄 README.md                           # Project documentation
└── 📄 PROJECT_STRUCTURE.md                # This file
```

## File Descriptions

### App Router (`src/app/`)

#### Pages

- **`page.tsx`** - Landing page with URL shortening interface
- **`layout.tsx`** - Root layout wrapper with metadata and global styles
- **`[code]/page.tsx`** - Dynamic route for redirecting short URLs
- **`code/[code]/page.tsx`** - Statistics page for viewing link analytics

#### API Routes

- **`api/links/route.ts`**
    - `GET` - Fetch all links
    - `POST` - Create new short link

- **`api/links/[code]/route.ts`**
    - `GET` - Get specific link by code
    - `DELETE` - Remove a link

- **`api/redirect/[code]/route.ts`**
    - `GET` - Redirect to original URL and increment click count

- **`healthz/route.ts`**
    - Health check endpoint for monitoring

### Library (`src/lib/`)

- **`db.ts`** - PostgreSQL database connection using Drizzle ORM
- **`schema.ts`** - Database table definitions (links table)
- **`utils.ts`** - Utility functions (nanoid generator, URL validation, clipboard)
- **`validation.ts`** - Zod schemas for request validation

### Components (`src/components/`)

#### Layout Components

- **`Header.tsx`** - Site navigation bar
- **`Footer.tsx`** - Site footer with links
- **`Container.tsx`** - Responsive container wrapper

#### Dashboard Components

- **`LinkTable.tsx`** - Table displaying all links with actions
- **`AddLinkForm.tsx`** - Form for creating new short links
- **`SearchBar.tsx`** - Search/filter input
- **`StatsCard.tsx`** - Card displaying a single statistic

#### UI Components

- **`Button.tsx`** - Styled button with variants (primary, secondary, danger)
- **`Input.tsx`** - Form input field with labels and error states
- **`Modal.tsx`** - Modal dialog with backdrop
- **`LoadingSpinner.tsx`** - Animated loading spinner
- **`CopyButton.tsx`** - Button to copy text to clipboard

#### Stats Components

- **`StatsOverview.tsx`** - Overview of all statistics
- **`ClickChart.tsx`** - Placeholder for click analytics chart

### Types (`src/types/`)

- **`index.ts`** - TypeScript interfaces and types for the entire application

### Scripts

- **`init-db.ts`** - Script to initialize the PostgreSQL database and create tables

## Database Schema

### Links Table

```sql
CREATE TABLE links (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  code TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  clicks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## API Endpoints

### Links Management

- `GET /api/links` - Get all links
- `POST /api/links` - Create new link
  ```json
  {
    "url": "https://example.com",
    "customCode": "optional"
  }
  ```
- `GET /api/links/[code]` - Get link details
- `DELETE /api/links/[code]` - Delete a link

### Redirection

- `GET /api/redirect/[code]` - Redirect and track click
- `GET /[code]` - Short URL redirect page

### Monitoring

- `GET /healthz` - Health check

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Icons**: Lucide React
- **Runtime**: tsx (for scripts)

## Key Features

✅ Server-side rendering with Next.js App Router
✅ Type-safe database queries with Drizzle ORM
✅ Request validation with Zod
✅ Modern UI with Tailwind CSS v4
✅ Click tracking and analytics
✅ Custom short codes support
✅ Copy to clipboard functionality
✅ Responsive design
✅ Health check endpoint

## Getting Started

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and configure
3. Initialize database: `npm run db:init`
4. Start dev server: `npm run dev`
5. Open http://localhost:3000

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:init` - Initialize database
