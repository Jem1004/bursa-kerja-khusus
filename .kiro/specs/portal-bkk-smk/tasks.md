# Implementation Plan - Portal BKK SMK

## Task List

- [x] 1. Setup project structure dan konfigurasi dasar
  - Initialize Next.js 14+ project dengan TypeScript dan App Router
  - Install dependencies: Prisma, NextAuth.js, Tailwind CSS, Zod, React Hook Form
  - Configure Tailwind dengan custom color palette (hijau-putih) dan font (Inter, Poppins)
  - Setup Prettier, ESLint, dan Husky pre-commit hooks
  - Create docker-compose.yml untuk PostgreSQL development database
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 2. Setup database schema dan Prisma
  - [x] 2.1 Create Prisma schema dengan models Admin, Loker, dan Halaman
    - Define Admin model dengan fields: id, username, email, password, timestamps
    - Define Loker model dengan fields: id, judul, namaPerusahaan, logoPerusahaan, lokasi, deskripsi, kualifikasi, caraMelamar, batasWaktu, isPublished, timestamps
    - Define Halaman model dengan fields: id, slug, judul, konten, timestamps
    - Add indexes untuk query optimization (isPublished, createdAt pada Loker)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  - [x] 2.2 Create initial migration dan seed script
    - Generate Prisma migration untuk create tables
    - Create seed script untuk insert admin user default dan halaman statis awal (Profil BKK, Visi Misi, Info Tracer Study)
    - _Requirements: 8.5, 3.1_

- [x] 3. Implement authentication system
  - [x] 3.1 Setup NextAuth.js dengan Credentials Provider
    - Configure NextAuth.js di app/api/auth/[...nextauth]/route.ts
    - Implement Credentials Provider dengan username/password authentication
    - Create session strategy (JWT atau database session)
    - _Requirements: 1.1, 1.2, 1.3, 9.1_
  - [x] 3.2 Create login API endpoint dan page
    - Implement POST /api/auth/login untuk verify credentials dengan bcrypt
    - Create app/(admin)/admin/login/page.tsx dengan form login
    - Add form validation dengan Zod dan React Hook Form
    - Implement redirect logic setelah login berhasil
    - _Requirements: 1.2, 1.4, 9.1_
  - [x] 3.3 Create logout functionality
    - Implement POST /api/auth/logout untuk destroy session
    - Add logout button di admin dashboard
    - _Requirements: 1.5, 9.2_
  - [x] 3.4 Implement middleware untuk route protection
    - Create middleware.ts untuk check authentication pada /admin/\* routes
    - Redirect unauthenticated users ke /admin/login
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 4. Build admin dashboard layout dan navigation
  - [x] 4.1 Create admin layout component
    - Create app/(admin)/layout.tsx dengan auth check
    - Build AdminSidebar component dengan navigation menu
    - Add responsive design untuk mobile dan desktop
    - _Requirements: 7.1_
  - [x] 4.2 Create dashboard home page
    - Create app/(admin)/admin/dashboard/page.tsx
    - Display summary statistics (total loker, published loker, halaman count)
    - Add quick action buttons untuk create loker dan edit halaman
    - _Requirements: 2.1_

- [x] 5. Implement Loker CRUD functionality
  - [x] 5.1 Create Loker API endpoints
    - Implement GET /api/admin/loker untuk fetch all loker dengan pagination
    - Implement POST /api/admin/loker untuk create new loker
    - Implement GET /api/admin/loker/[id] untuk fetch single loker
    - Implement PUT /api/admin/loker/[id] untuk update loker
    - Implement DELETE /api/admin/loker/[id] untuk delete loker
    - Add Zod validation untuk request body
    - Add error handling untuk semua endpoints
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 9.3, 9.4, 9.5, 9.6, 9.7_
  - [x] 5.2 Create Loker list page di admin dashboard
    - Create app/(admin)/admin/dashboard/loker/page.tsx
    - Display table atau card list semua loker dengan status publikasi
    - Add filter by published status
    - Add action buttons (edit, delete, toggle publish)
    - Implement pagination controls
    - _Requirements: 2.1_
  - [x] 5.3 Create Loker form untuk create dan edit
    - Create app/(admin)/admin/dashboard/loker/create/page.tsx untuk create form
    - Create app/(admin)/admin/dashboard/loker/[id]/edit/page.tsx untuk edit form
    - Build reusable LokerForm component dengan React Hook Form dan Zod validation
    - Add all required fields: judul, namaPerusahaan, logoPerusahaan, lokasi, deskripsi, kualifikasi, caraMelamar, batasWaktu, isPublished
    - Implement form submission dengan error handling dan success feedback
    - _Requirements: 2.2, 2.3, 2.4_

- [x] 6. Implement Halaman static pages CRUD
  - [x] 6.1 Create Halaman API endpoints
    - Implement GET /api/admin/halaman untuk fetch all halaman
    - Implement GET /api/admin/halaman/[slug] untuk fetch single halaman
    - Implement PUT /api/admin/halaman/[slug] untuk update halaman
    - Add Zod validation untuk request body
    - _Requirements: 3.1, 3.2, 3.4, 9.8, 9.9, 9.10_
  - [x] 6.2 Create Halaman list dan edit pages di admin dashboard
    - Create app/(admin)/admin/dashboard/halaman/page.tsx untuk list halaman
    - Create app/(admin)/admin/dashboard/halaman/[slug]/edit/page.tsx untuk edit form
    - Build HalamanForm component dengan textarea atau simple editor untuk konten
    - Implement form submission dengan error handling
    - _Requirements: 3.2, 3.3, 3.4_

- [x] 7. Build public frontend - Landing page
  - [x] 7.1 Create reusable UI components
    - Create components/ui/Button.tsx dengan variant styles (primary green, secondary)
    - Create components/ui/Card.tsx untuk loker cards
    - Create components/ui/Input.tsx untuk forms
    - Create components/layout/Header.tsx dengan navigation menu
    - Create components/layout/Footer.tsx
    - Apply design system: hijau-putih color palette, Inter/Poppins fonts
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_
  - [x] 7.2 Create landing page dengan loker list
    - Create app/page.tsx sebagai landing page
    - Fetch published loker dari database (Server Component)
    - Create components/loker/LokerCard.tsx untuk display loker dalam card format
    - Display loker cards dalam grid layout (responsive)
    - Sort loker by createdAt descending (newest first)
    - Add hero section dengan judul dan deskripsi portal
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 12.5_
  - [x] 7.3 Implement Header navigation
    - Add navigation links ke halaman statis (Profil, Visi Misi, Tracer Study)
    - Make header responsive dengan mobile menu
    - Apply hover effects dengan warna hijau
    - _Requirements: 6.5, 12.6_

- [x] 8. Build public frontend - Detail pages
  - [x] 8.1 Create Loker detail page
    - Create app/loker/[id]/page.tsx
    - Fetch loker data by ID (Server Component dengan SSR)
    - Create components/loker/LokerDetail.tsx untuk display full loker information
    - Display semua fields: judul, perusahaan, logo, lokasi, deskripsi, kualifikasi, cara melamar, batas waktu
    - Add back button untuk return ke landing page
    - Handle 404 error jika loker tidak ditemukan atau not published
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - [x] 8.2 Create dynamic static pages
    - Create app/[slug]/page.tsx untuk halaman statis dinamis
    - Fetch halaman data by slug (Server Component dengan SSR)
    - Display judul dan konten halaman
    - Handle 404 error jika slug tidak ditemukan
    - Apply consistent styling dengan design system
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 9. Implement root layout dan global styles
  - [x] 9.1 Configure root layout
    - Create app/layout.tsx dengan metadata (title, description)
    - Import Google Fonts (Inter dan Poppins)
    - Add font variables ke HTML element
    - Setup NextAuth SessionProvider jika diperlukan
    - _Requirements: 12.4_
  - [x] 9.2 Create global styles
    - Create app/globals.css dengan Tailwind directives
    - Add custom CSS untuk typography styles
    - Define CSS variables untuk colors jika diperlukan
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [-] 10. Add data validation dan error handling
  - [x] 10.1 Create Zod validation schemas
    - Create lib/validations/loker.ts dengan createLokerSchema dan updateLokerSchema
    - Create lib/validations/halaman.ts dengan updateHalamanSchema
    - Create lib/validations/auth.ts dengan loginSchema
    - _Requirements: 2.3, 3.4, 9.3, 9.4, 9.6, 9.10_
  - [-] 10.2 Implement consistent error handling di API routes
    - Create lib/api-error.ts dengan standardized error response format
    - Add try-catch blocks di semua API handlers
    - Return appropriate HTTP status codes (400, 401, 404, 500)
    - Log errors untuk debugging
    - _Requirements: 7.3_

- [ ] 11. Polish UI/UX dan responsive design
  - [ ] 11.1 Implement responsive design untuk semua pages
    - Test dan adjust layout untuk mobile (320px+), tablet (768px+), desktop (1024px+)
    - Ensure cards stack properly di mobile
    - Make admin dashboard sidebar collapsible di mobile
    - _Requirements: 4.5, 12.5_
  - [ ] 11.2 Add loading states dan feedback
    - Add loading spinners untuk form submissions
    - Add success toast notifications setelah create/update/delete
    - Add error messages display di forms
    - _Requirements: 2.3, 2.4, 3.4_
  - [ ] 11.3 Implement hover effects dan transitions
    - Add hover effects pada buttons dengan warna hijau darker
    - Add hover shadow pada loker cards
    - Add smooth transitions untuk interactive elements
    - _Requirements: 12.6_

- [ ] 12. Setup development environment dan documentation
  - [ ] 12.1 Create environment configuration files
    - Create .env.example dengan semua required environment variables
    - Document each environment variable purpose
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  - [ ] 12.2 Create README.md dengan setup instructions
    - Document prerequisites (Node.js, Docker)
    - Add step-by-step setup instructions
    - Document available npm scripts
    - Add troubleshooting section
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  - [ ] 12.3 Add code comments dan JSDoc
    - Add JSDoc comments untuk complex functions
    - Add inline comments untuk business logic
    - Document component props dengan TypeScript interfaces
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

## Implementation Notes

### Execution Order

Tasks should be executed in sequential order as each task builds upon the previous ones. The dependency chain is:

1. Project setup → 2. Database → 3. Auth → 4. Admin UI → 5-6. CRUD → 7-8. Public UI → 9. Layout → 10. Validation → 11. Polish → 12. Documentation

### Key Technical Decisions

- **Server Components First**: Use Server Components by default untuk SSR dan SEO benefits
- **Progressive Enhancement**: Build core functionality first, add enhancements later
- **Type Safety**: Leverage TypeScript dan Zod untuk catch errors early
- **Minimal Dependencies**: Only add libraries yang benar-benar diperlukan untuk MVP

### Testing Approach

- Manual testing untuk UI flows
- API testing dengan Postman/Thunder Client
- TypeScript type checking sebagai compile-time validation
- Optional automated tests dapat ditambahkan di future iterations

### Design System Consistency

Semua UI components harus mengikuti design system:

- Colors: White (#FAFAFA) background, Green (#22c55e) accents
- Typography: Poppins untuk headings, Inter untuk body
- Spacing: Consistent padding dan margins (Tailwind spacing scale)
- Components: Reusable dan composable

### Security Checklist

- [ ] Passwords hashed dengan bcrypt
- [ ] All admin routes protected dengan middleware
- [ ] Input validation dengan Zod di semua API endpoints
- [ ] Environment variables tidak di-commit ke git
- [ ] CSRF protection enabled (NextAuth.js default)

### Performance Checklist

- [ ] Server-side rendering untuk public pages
- [ ] Database indexes pada frequently queried fields
- [ ] Image optimization dengan Next.js Image component
- [ ] Pagination implemented untuk large lists
- [ ] Minimal client-side JavaScript

## Post-MVP Enhancements (Not in Current Scope)

- Rich text editor untuk konten halaman
- Image upload functionality untuk logo perusahaan
- Advanced search dan filter untuk loker
- Email notifications
- Analytics tracking
- Multi-language support
- PWA capabilities
- Automated E2E testing
