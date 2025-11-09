# Portal BKK SMK

Portal Bursa Kerja Khusus untuk SMK - Website informasional untuk menampilkan lowongan kerja dan informasi tracer study.

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm atau yarn

## Getting Started

### 1. Clone dan Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy file `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Edit `.env` dan sesuaikan konfigurasi jika diperlukan.

### 3. Start PostgreSQL Database

```bash
docker-compose up -d
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev
```

### 5. Seed Database (Optional)

```bash
npx prisma db seed
```

### 6. Start Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code dengan Prettier
- `npm run format:check` - Check code formatting

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Form**: React Hook Form + Zod
- **Code Quality**: ESLint, Prettier, Husky

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (admin)/           # Admin dashboard (route group)
│   ├── api/               # API routes
│   ├── loker/             # Public loker pages
│   └── [slug]/            # Dynamic static pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   └── loker/            # Loker-specific components
├── lib/                  # Utility functions
├── prisma/               # Prisma schema and migrations
└── public/               # Static assets
```

## Development Workflow

1. Create feature branch dari `main`
2. Make changes
3. Commit (Husky akan run lint dan format otomatis)
4. Push dan create Pull Request

## Troubleshooting

### Database Connection Error

Pastikan PostgreSQL container berjalan:

```bash
docker-compose ps
```

Jika tidak berjalan, start dengan:

```bash
docker-compose up -d
```

### Port 5432 Already in Use

Jika port 5432 sudah digunakan, edit `docker-compose.yml` dan ubah port mapping:

```yaml
ports:
  - "5433:5432" # Gunakan port 5433 di host
```

Jangan lupa update `DATABASE_URL` di `.env`:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/portal_bkk"
```

## License

Private - SMK Internal Use Only
