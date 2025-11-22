<div align="center">
  <h1 style="font-size: 3em; font-weight: 900; background: linear-gradient(to right, #3B82F6, #6366F1, #8B5CF6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">TinyLink</h1>

  <p style="font-size: 1.2em; color: #6B7280; margin: 20px 0;">A modern, fast, and beautiful URL shortener</p>

  <br/>

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

</div>

# TinyLink - URL Shortener

> A modern, beautiful URL shortening service with real-time analytics and attractive UI design

## Recent Enhancements

**Complete Visual Redesign** - Every container, card, and component now features:

- **Attractive Gradient Borders** with animated color effects
- **Vibrant Color Schemes** throughout the application
- **Enhanced Shadows & Glows** for depth and modern look
- **Smooth Animations** on all interactive elements
- **Improved Components** with gradient backgrounds and borders

See [STYLING_ENHANCEMENTS.md](./STYLING_ENHANCEMENTS.md) for detailed documentation of all visual
improvements.

## Features

- **URL Shortening**: Convert long URLs into short, shareable links
- **Custom Codes**: Create custom short codes or use auto-generated ones
- **Analytics Dashboard**: Track link clicks, view statistics, and monitor performance
- **Click Tracking**: Monitor individual link performance with detailed analytics
- **Statistics Overview**: Comprehensive analytics with charts and insights
- **Responsive Design**: Beautiful UI that works seamlessly on all devices
- **Real-time Updates**: Instant feedback and live statistics
- **Navigation System**: Complete navigation with Home, Dashboard, Statistics, Settings, and Help
  pages
- **Modern Logo**: Simple, text-based gradient logo design
- **Health Monitoring**: Built-in health check endpoint

## Pages

- **Home** (`/`) - URL shortening interface with form
- **Dashboard** (`/dashboard`) - Manage and view all your links
- **Statistics** (`/statistics`) - Comprehensive analytics overview
- **Get Started** (`/get-started`) - Quick start guide and tutorials
- **Settings** (`/settings`) - Customize your preferences
- **Help** (`/help`) - FAQs and support information
- **Analytics Detail** (`/code/[code]`) - Individual link analytics

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Validation**: [Zod](https://zod.dev/)
- **TypeScript**: Full type safety

## Prerequisites 📋

- Node.js 20 or higher
- PostgreSQL database
- npm or yarn package manager

## Getting Started 🚀

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd tinylink
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/tinylink
```

### 4. Initialize the database

```bash
npm run db:init
```

This will create the necessary tables in your PostgreSQL database.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts 📜

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks
- `npm run db:init` - Initialize the database with required tables

## Project Structure 📁

```
tinylink/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── [code]/          # Dynamic route for redirect
│   │   ├── api/             # API routes
│   │   ├── dashboard/       # Dashboard page
│   │   └── healthz/         # Health check endpoint
│   ├── components/          # React components
│   │   ├── Dashboard/       # Dashboard components
│   │   ├── Layout/          # Layout components
│   │   ├── Stats/           # Statistics components
│   │   └── UI/              # UI components
│   ├── lib/                 # Utility functions
│   │   ├── db.ts           # Database connection
│   │   ├── schema.ts       # Database schema
│   │   ├── utils.ts        # Helper functions
│   │   └── validation.ts   # Validation schemas
│   └── types/               # TypeScript type definitions
├── scripts/                 # Utility scripts
│   └── init-db.ts          # Database initialization
└── public/                  # Static assets
```

## API Endpoints 🌐

### Create Short Link

- **POST** `/api/shorten`
- Body: `{ "url": "https://example.com", "customCode": "optional" }`
- Response: `{ "code": "abc123", "shortUrl": "http://localhost:3000/abc123" }`

### Get Link Statistics

- **GET** `/api/stats`
- Response: Array of links with click counts and metadata

### Track Click

- **POST** `/api/click`
- Body: `{ "code": "abc123" }`
- Response: `{ "success": true }`

### Delete Link

- **DELETE** `/api/links/{code}`
- Response: `{ "success": true }`

### Health Check

- **GET** `/healthz`
- Response: `{ "status": "ok" }`

## Database Schema 💾

The application uses a single `links` table with the following structure:

- `id` - Unique identifier
- `code` - Short code (unique)
- `original_url` - Original long URL
- `clicks` - Number of clicks
- `created_at` - Creation timestamp

## Deployment 🚢

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your `DATABASE_URL` environment variable
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- Render
- AWS
- Google Cloud Platform

Make sure to:

1. Set the `DATABASE_URL` environment variable
2. Run database initialization after deployment
3. Configure the platform to run `npm run build` and `npm start`

## Environment Variables 🔐

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is open source and available under the [MIT License](LICENSE).

## Support 💬

If you have any questions or need help, please open an issue on GitHub.

---

Built with ❤️ using Next.js and React
