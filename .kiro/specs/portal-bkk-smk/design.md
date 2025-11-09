# Design Document - Portal BKK SMK

## Overview

Portal BKK SMK adalah aplikasi fullstack berbasis Next.js 14+ dengan App Router yang mengimplementasikan filosofi "Admin-Only MVP". Sistem ini terdiri dari dua bagian utama:

1. **Public Frontend**: Landing page dan halaman detail yang dapat diakses tanpa autentikasi
2. **Admin Dashboard**: Area terproteksi untuk Admin BKK mengelola konten

Aplikasi menggunakan PostgreSQL sebagai database, Prisma sebagai ORM, dan mengadopsi server-side rendering (SSR) untuk performa optimal dan SEO.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
└───────────────┬─────────────────────────────────┬───────────┘
                │                                 │
                │ Public Routes                   │ Admin Routes
                │ (/, /loker/[id], /[slug])      │ (/admin/*)
                │                                 │
┌───────────────▼─────────────────────────────────▼───────────┐
│                     Next.js App Router                       │
│  ┌──────────────────────┐      ┌─────────────────────────┐ │
│  │   Public Pages       │      │   Admin Pages           │ │
│  │   - app/page.tsx     │      │   - app/(admin)/admin/* │ │
│  │   - app/loker/[id]   │      │   (Route Group)         │ │
│  │   - app/[slug]       │      └─────────────────────────┘ │
│  └──────────────────────┘                                   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Routes (app/api/*)                   │  │
│  │  - /api/auth/login, /api/auth/logout                 │  │
│  │  - /api/admin/loker (GET, POST)                      │  │
│  │  - /api/admin/loker/[id] (GET, PUT, DELETE)          │  │
│  │  - /api/admin/halaman (GET)                          │  │
│  │  - /api/admin/halaman/[slug] (GET, PUT)              │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            │ Prisma Client
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                    PostgreSQL Database                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │  Admin   │  │  Loker   │  │ Halaman  │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
└───────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Docker)
- **ORM**: Prisma
- **Authentication**: NextAuth.js (Credentials Provider)
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Zod validation
- **Code Quality**: Prettier, ESLint, Husky

## Components and Interfaces

### 1. Database Schema (Prisma)

#### Admin Model

```prisma
model Admin {
  id        String   @id @default(cuid())
  username  String   @unique
  email     String   @unique
  password  String   // bcrypt hashed
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Rationale**: Model Admin sederhana dengan username dan email sebagai unique identifier. Password disimpan dalam bentuk hash untuk keamanan.

#### Loker Model

```prisma
model Loker {
  id              String   @id @default(cuid())
  judul           String
  namaPerusahaan  String
  logoPerusahaan  String?  // URL to logo image
  lokasi          String
  deskripsi       String   @db.Text
  kualifikasi     String   @db.Text
  caraMelamar     String   @db.Text
  batasWaktu      DateTime
  isPublished     Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([isPublished, createdAt])
}
```

**Rationale**:

- Field `deskripsi`, `kualifikasi`, dan `caraMelamar` menggunakan `@db.Text` untuk konten panjang
- `logoPerusahaan` optional (nullable) karena tidak semua perusahaan memiliki logo
- Index pada `isPublished` dan `createdAt` untuk query performa saat fetch loker published
- `batasWaktu` sebagai DateTime untuk filtering loker yang masih aktif

#### Halaman Model

```prisma
model Halaman {
  id        String   @id @default(cuid())
  slug      String   @unique
  judul     String
  konten    String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Rationale**: Model generik untuk halaman statis. Slug sebagai unique identifier untuk routing. Konten menggunakan `@db.Text` untuk mendukung konten panjang (bisa HTML atau Markdown).

### 2. API Endpoints Specification

#### Authentication Endpoints

**POST /api/auth/login**

```typescript
// Request Body
{
  username: string;
  password: string;
}

// Response (Success - 200)
{
  success: true;
  message: "Login berhasil";
}

// Response (Error - 401)
{
  success: false;
  message: "Username atau password salah";
}
```

**POST /api/auth/logout**

```typescript
// Response (Success - 200)
{
  success: true;
  message: "Logout berhasil";
}
```

**Implementation Notes**: Menggunakan NextAuth.js dengan Credentials Provider. Session disimpan menggunakan JWT atau database session.

#### Loker CRUD Endpoints

**GET /api/admin/loker**

```typescript
// Query Parameters (optional)
?published=true|false&limit=10&offset=0

// Response (Success - 200)
{
  success: true;
  data: Loker[];
  total: number;
}
```

**POST /api/admin/loker**

```typescript
// Request Body
{
  judul: string;
  namaPerusahaan: string;
  logoPerusahaan?: string;
  lokasi: string;
  deskripsi: string;
  kualifikasi: string;
  caraMelamar: string;
  batasWaktu: string; // ISO date string
  isPublished: boolean;
}

// Response (Success - 201)
{
  success: true;
  data: Loker;
  message: "Lowongan kerja berhasil dibuat";
}

// Response (Error - 400)
{
  success: false;
  errors: { field: string; message: string }[];
}
```

**GET /api/admin/loker/[id]**

```typescript
// Response (Success - 200)
{
  success: true;
  data: Loker;
}

// Response (Error - 404)
{
  success: false;
  message: "Lowongan kerja tidak ditemukan";
}
```

**PUT /api/admin/loker/[id]**

```typescript
// Request Body (same as POST)
// Response (Success - 200)
{
  success: true;
  data: Loker;
  message: "Lowongan kerja berhasil diupdate";
}
```

**DELETE /api/admin/loker/[id]**

```typescript
// Response (Success - 200)
{
  success: true;
  message: "Lowongan kerja berhasil dihapus";
}
```

#### Halaman CRUD Endpoints

**GET /api/admin/halaman**

```typescript
// Response (Success - 200)
{
  success: true;
  data: Halaman[];
}
```

**GET /api/admin/halaman/[slug]**

```typescript
// Response (Success - 200)
{
  success: true;
  data: Halaman;
}
```

**PUT /api/admin/halaman/[slug]**

```typescript
// Request Body
{
  judul: string;
  konten: string;
}

// Response (Success - 200)
{
  success: true;
  data: Halaman;
  message: "Halaman berhasil diupdate";
}
```

### 3. Frontend Structure (App Router)

```
app/
├── layout.tsx                    # Root layout dengan font, metadata
├── page.tsx                      # Landing page (public)
├── globals.css                   # Global styles + Tailwind
│
├── loker/
│   └── [id]/
│       └── page.tsx              # Detail loker (public, SSR)
│
├── [slug]/
│   └── page.tsx                  # Dynamic static pages (public, SSR)
│
├── (admin)/                      # Route group (tidak affect URL)
│   ├── layout.tsx                # Admin layout dengan auth check
│   └── admin/
│       ├── login/
│       │   └── page.tsx          # Login page
│       └── dashboard/
│           ├── page.tsx          # Dashboard home
│           ├── loker/
│           │   ├── page.tsx      # List loker
│           │   ├── create/
│           │   │   └── page.tsx  # Create loker form
│           │   └── [id]/
│           │       └── edit/
│           │           └── page.tsx  # Edit loker form
│           └── halaman/
│               ├── page.tsx      # List halaman
│               └── [slug]/
│                   └── edit/
│                       └── page.tsx  # Edit halaman form
│
├── api/
│   ├── auth/
│   │   ├── login/
│   │   │   └── route.ts
│   │   └── logout/
│   │       └── route.ts
│   └── admin/
│       ├── loker/
│       │   ├── route.ts          # GET, POST
│       │   └── [id]/
│       │       └── route.ts      # GET, PUT, DELETE
│       └── halaman/
│           ├── route.ts          # GET
│           └── [slug]/
│               └── route.ts      # GET, PUT
│
└── components/
    ├── ui/                       # Reusable UI components
    │   ├── Button.tsx
    │   ├── Card.tsx
    │   ├── Input.tsx
    │   └── ...
    ├── layout/
    │   ├── Header.tsx            # Public header dengan nav
    │   ├── Footer.tsx
    │   └── AdminSidebar.tsx
    └── loker/
        ├── LokerCard.tsx         # Card untuk list loker
        └── LokerDetail.tsx       # Detail view component
```

**Design Decisions**:

- **Route Group `(admin)`**: Menggunakan route group untuk admin agar tidak menambah segment `/admin` di URL structure, tapi tetap bisa share layout
- **Server Components by Default**: Semua page components adalah Server Components untuk SSR, kecuali yang memerlukan interactivity (forms, buttons)
- **Colocation**: Components diorganisir berdasarkan feature (loker, halaman) untuk maintainability

### 4. Authentication Flow

```
┌─────────────┐
│ User visits │
│ /admin/*    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐      No      ┌──────────────────┐
│ Check session   ├──────────────►│ Redirect to      │
│ in middleware   │                │ /admin/login     │
└────────┬────────┘                └──────────────────┘
         │ Yes
         ▼
┌─────────────────┐
│ Allow access to │
│ admin dashboard │
└─────────────────┘
```

**Implementation**:

- Menggunakan Next.js Middleware (`middleware.ts`) untuk check authentication
- Session management dengan NextAuth.js
- Protected routes: semua route di `/admin/*` kecuali `/admin/login`

### 5. UI/UX Design System

#### Color Palette

```typescript
// tailwind.config.ts
const colors = {
  primary: {
    50: "#f0fdf4", // Very light green
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e", // Main green (similar to #228B22)
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },
  neutral: {
    50: "#fafafa", // Off-white background
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717", // Near black for text
  },
};
```

#### Typography

```typescript
// Font configuration
import { Inter, Poppins } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

// Usage:
// - Poppins: Headings (H1-H6)
// - Inter: Body text, paragraphs, UI elements
```

**Rationale**:

- Inter sangat readable untuk body text dan UI
- Poppins memberikan personality untuk headings tanpa terlalu formal
- Keduanya modern dan memiliki excellent web rendering

#### Component Design Patterns

**LokerCard Component**

```tsx
<Card className="bg-white hover:shadow-lg transition-shadow">
  <CardHeader>
    <div className="flex items-start gap-4">
      {logoPerusahaan && (
        <img src={logoPerusahaan} className="w-16 h-16 object-contain" />
      )}
      <div>
        <h3 className="font-poppins font-semibold text-lg text-neutral-900">
          {judul}
        </h3>
        <p className="text-neutral-600">{namaPerusahaan}</p>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <p className="text-neutral-700 line-clamp-2">{deskripsi}</p>
    <div className="flex items-center gap-4 mt-4 text-sm text-neutral-600">
      <span>📍 {lokasi}</span>
      <span>⏰ {formatDate(batasWaktu)}</span>
    </div>
  </CardContent>
  <CardFooter>
    <Button className="bg-primary-600 hover:bg-primary-700 text-white">
      Lihat Detail
    </Button>
  </CardFooter>
</Card>
```

**Landing Page Layout**

```
┌─────────────────────────────────────────────────────────┐
│                        Header                            │
│  Logo BKK    [Beranda] [Profil] [Tracer Study]         │
└─────────────────────────────────────────────────────────┘
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │              Hero Section                       │    │
│  │  "Portal BKK SMK - Temukan Peluang Karirmu"   │    │
│  │  [Search bar untuk filter loker]               │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │         Lowongan Kerja Terbaru                  │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐     │   │
│  │  │ Loker 1  │  │ Loker 2  │  │ Loker 3  │     │   │
│  │  │  Card    │  │  Card    │  │  Card    │     │   │
│  │  └──────────┘  └──────────┘  └──────────┘     │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐     │   │
│  │  │ Loker 4  │  │ Loker 5  │  │ Loker 6  │     │   │
│  │  └──────────┘  └──────────┘  └──────────┘     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
│                        Footer                            │
│  © 2024 BKK SMK | Kontak | Social Media                │
└─────────────────────────────────────────────────────────┘
```

## Data Models

### Data Flow Diagrams

#### Public User Flow (View Loker)

```
User → Landing Page (SSR) → Fetch published loker from DB
                          → Render LokerCard components
                          → User clicks card
                          → Navigate to /loker/[id]
                          → Fetch loker detail (SSR)
                          → Render detail page
```

#### Admin Flow (Create Loker)

```
Admin → Login → POST /api/auth/login → Verify credentials
                                     → Create session
                                     → Redirect to dashboard
      → Navigate to Create Loker page
      → Fill form
      → Submit → POST /api/admin/loker → Validate data (Zod)
                                       → Hash sensitive data if any
                                       → Prisma.loker.create()
                                       → Return success
                                       → Redirect to loker list
```

### Data Validation

**Zod Schemas**:

```typescript
// lib/validations/loker.ts
import { z } from "zod";

export const createLokerSchema = z.object({
  judul: z.string().min(5, "Judul minimal 5 karakter").max(200),
  namaPerusahaan: z.string().min(2, "Nama perusahaan minimal 2 karakter"),
  logoPerusahaan: z
    .string()
    .url("URL logo tidak valid")
    .optional()
    .or(z.literal("")),
  lokasi: z.string().min(3, "Lokasi minimal 3 karakter"),
  deskripsi: z.string().min(20, "Deskripsi minimal 20 karakter"),
  kualifikasi: z.string().min(10, "Kualifikasi minimal 10 karakter"),
  caraMelamar: z.string().min(10, "Cara melamar minimal 10 karakter"),
  batasWaktu: z.string().datetime("Format tanggal tidak valid"),
  isPublished: z.boolean(),
});

export const updateLokerSchema = createLokerSchema.partial();
```

```typescript
// lib/validations/halaman.ts
export const updateHalamanSchema = z.object({
  judul: z.string().min(3, "Judul minimal 3 karakter").max(200),
  konten: z.string().min(10, "Konten minimal 10 karakter"),
});
```

## Error Handling

### API Error Response Format

```typescript
// Standardized error response
interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  code?: string; // e.g., 'VALIDATION_ERROR', 'NOT_FOUND', 'UNAUTHORIZED'
}
```

### Error Handling Strategy

1. **Validation Errors (400)**: Return field-specific errors from Zod validation
2. **Authentication Errors (401)**: Return generic message, redirect to login
3. **Authorization Errors (403)**: Return "Access denied" message
4. **Not Found Errors (404)**: Return resource-specific message
5. **Server Errors (500)**: Log error, return generic message to client

### Frontend Error Handling

```typescript
// Example in API route handler
try {
  const body = await request.json();
  const validated = createLokerSchema.parse(body);

  const loker = await prisma.loker.create({
    data: validated,
  });

  return NextResponse.json(
    {
      success: true,
      data: loker,
      message: "Lowongan kerja berhasil dibuat",
    },
    { status: 201 }
  );
} catch (error) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        success: false,
        message: "Validasi gagal",
        errors: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
        code: "VALIDATION_ERROR",
      },
      { status: 400 }
    );
  }

  console.error("Error creating loker:", error);
  return NextResponse.json(
    {
      success: false,
      message: "Terjadi kesalahan server",
      code: "INTERNAL_ERROR",
    },
    { status: 500 }
  );
}
```

## Testing Strategy

### Testing Approach

Mengingat ini adalah MVP dengan fokus pada delivery cepat, testing strategy akan pragmatis:

1. **Manual Testing**: Primary testing method untuk UI/UX flows
2. **API Testing**: Menggunakan tools seperti Postman atau Thunder Client untuk test API endpoints
3. **Type Safety**: TypeScript sebagai "compile-time testing" untuk catch errors early

### Optional Automated Testing (Future Enhancement)

Jika diperlukan di masa depan:

1. **Unit Tests**:
   - Validation schemas (Zod)
   - Utility functions
   - Tool: Vitest

2. **Integration Tests**:
   - API endpoints dengan mock database
   - Tool: Vitest + MSW (Mock Service Worker)

3. **E2E Tests**:
   - Critical user flows (login, create loker, view loker)
   - Tool: Playwright

**Rationale**: Untuk MVP, fokus pada shipping features. Automated tests dapat ditambahkan incrementally setelah core functionality stable.

## Security Considerations

### Authentication Security

1. **Password Hashing**: Menggunakan bcrypt dengan salt rounds 10-12
2. **Session Management**: JWT dengan expiry time atau database session
3. **CSRF Protection**: NextAuth.js built-in CSRF protection
4. **Rate Limiting**: Implement rate limiting pada login endpoint (future enhancement)

### API Security

1. **Middleware Protection**: Semua `/api/admin/*` endpoints protected dengan auth middleware
2. **Input Validation**: Zod validation pada semua input
3. **SQL Injection Prevention**: Prisma ORM parameterized queries
4. **XSS Prevention**: React automatic escaping + sanitize HTML content jika menggunakan rich text editor

### Environment Variables

```env
# .env.example
DATABASE_URL="postgresql://user:password@localhost:5432/portal_bkk"
NEXTAUTH_SECRET="generate-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Security Notes**:

- Never commit `.env` file
- Use strong random secret for NEXTAUTH_SECRET
- Different credentials for production

## Performance Optimization

### Server-Side Rendering (SSR)

- Landing page dan detail loker menggunakan SSR untuk SEO dan initial load performance
- Data fetching di server component untuk menghindari client-side loading states

### Database Optimization

1. **Indexing**: Index pada `Loker.isPublished` dan `Loker.createdAt` untuk query performa
2. **Pagination**: Implement pagination pada list loker (limit/offset)
3. **Connection Pooling**: Prisma built-in connection pooling

### Image Optimization

- Menggunakan Next.js `<Image>` component untuk automatic optimization
- Logo perusahaan disimpan sebagai URL (bisa menggunakan CDN atau cloud storage seperti Cloudinary)

### Caching Strategy (Future Enhancement)

- Static page caching untuk halaman statis
- Revalidation strategy untuk loker list (ISR - Incremental Static Regeneration)

## Deployment Considerations

### Environment Setup

1. **Development**: Docker Compose untuk PostgreSQL lokal
2. **Production**:
   - Database: Managed PostgreSQL (Supabase, Neon, atau Railway)
   - Hosting: Vercel (recommended untuk Next.js) atau Railway
   - Environment variables configured di platform

### Database Migration

```bash
# Development
npx prisma migrate dev --name init

# Production
npx prisma migrate deploy
```

### Build Process

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Build Next.js
npm run build

# Start production server
npm start
```

## Development Workflow

### Initial Setup

1. Clone repository
2. Copy `.env.example` to `.env` dan configure
3. Run `docker-compose up -d` untuk start PostgreSQL
4. Run `npx prisma migrate dev` untuk setup database
5. Run `npx prisma db seed` untuk seed initial data (admin user, sample pages)
6. Run `npm run dev` untuk start development server

### Git Workflow

1. Husky pre-commit hook runs Prettier dan ESLint
2. Commit messages mengikuti conventional commits (optional tapi recommended)
3. Branch strategy: `main` untuk production, `develop` untuk development

### Code Review Checklist

- [ ] TypeScript types properly defined
- [ ] Zod validation implemented untuk forms
- [ ] Error handling implemented
- [ ] UI follows design system (colors, typography)
- [ ] Responsive design tested
- [ ] No console.log statements in production code
- [ ] Environment variables properly used

## Future Enhancements (Post-MVP)

1. **Rich Text Editor**: Implement editor seperti TipTap atau Lexical untuk konten halaman
2. **Image Upload**: Direct upload untuk logo perusahaan (vs URL input)
3. **Search & Filter**: Advanced search dan filter untuk loker
4. **Email Notifications**: Notify admin saat ada loker baru yang perlu diverifikasi (jika ada submission form)
5. **Analytics**: Track views, clicks pada loker
6. **Multi-language**: Support Bahasa Indonesia dan English
7. **PWA**: Progressive Web App untuk mobile experience
8. **Automated Testing**: Implement E2E tests untuk critical flows
