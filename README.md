# TinyLink 🔗

A modern, fast, and beautiful URL shortener built with Next.js 16, React 19, and PostgreSQL.

## Features ✨

- **URL Shortening**: Convert long URLs into short, shareable links
- **Custom Codes**: Create custom short codes or use auto-generated ones
- **Analytics Dashboard**: Track link clicks, view statistics, and monitor performance
- **Click Tracking**: Monitor individual link performance with detailed analytics
- **Responsive Design**: Beautiful UI that works seamlessly on all devices
- **Real-time Updates**: Instant feedback and live statistics
- **Health Monitoring**: Built-in health check endpoint

## Tech Stack 🛠️

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
