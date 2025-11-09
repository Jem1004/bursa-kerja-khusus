# Requirements Document - Portal BKK SMK

## Introduction

Portal BKK (Bursa Kerja Khusus) SMK adalah sebuah website informasional yang berfungsi sebagai "Papan Informasi Digital Terverifikasi" untuk menampilkan lowongan kerja dan informasi tracer study. Sistem ini mengadopsi filosofi MVP "Admin-Only" dimana tidak ada sistem login untuk publik (siswa, alumni, DUDI). Seluruh konten dikelola dan diverifikasi oleh satu Admin BKK terpusat sebelum dipublikasikan. Frontend bersifat publik dan fokus pada penyajian informasi dengan desain modern dan profesional.

## Glossary

- **Portal BKK**: Sistem website Bursa Kerja Khusus untuk SMK
- **Admin BKK**: Pengguna tunggal yang memiliki akses ke dashboard admin untuk mengelola konten
- **Loker**: Lowongan kerja yang dipublikasikan di portal
- **DUDI**: Dunia Usaha dan Dunia Industri (perusahaan/instansi pemberi kerja)
- **Tracer Study**: Informasi pelacakan alumni dan statistik ketenagakerjaan
- **Halaman Statis**: Konten halaman seperti Profil BKK, Visi Misi, Info Tracer Study yang dapat diedit oleh admin
- **MVP**: Minimum Viable Product - versi produk dengan fitur minimal yang fungsional
- **Landing Page**: Halaman utama portal yang diakses publik
- **Dashboard Admin**: Area terproteksi untuk Admin BKK mengelola konten

## Requirements

### Requirement 1: Autentikasi Admin

**User Story:** Sebagai Admin BKK, saya ingin dapat login ke dashboard admin dengan aman, sehingga saya dapat mengelola konten portal tanpa akses dari pihak yang tidak berwenang.

#### Acceptance Criteria

1. THE Portal BKK SHALL menyediakan halaman login khusus untuk Admin BKK di route `/admin/login`
2. WHEN Admin BKK memasukkan kredensial yang valid dan menekan tombol login, THE Portal BKK SHALL memverifikasi kredensial terhadap database dan membuat session yang terautentikasi
3. THE Portal BKK SHALL menyimpan password Admin BKK dalam bentuk hash menggunakan algoritma bcrypt atau argon2
4. WHEN Admin BKK yang sudah terautentikasi mengakses halaman login, THE Portal BKK SHALL mengarahkan Admin BKK ke dashboard admin
5. THE Portal BKK SHALL menyediakan fungsi logout yang menghapus session autentikasi Admin BKK

### Requirement 2: Manajemen Lowongan Kerja (CRUD Loker)

**User Story:** Sebagai Admin BKK, saya ingin dapat membuat, melihat, mengedit, dan menghapus postingan lowongan kerja, sehingga saya dapat mengelola informasi loker yang ditampilkan kepada publik.

#### Acceptance Criteria

1. WHEN Admin BKK terautentikasi mengakses dashboard, THE Portal BKK SHALL menampilkan daftar semua lowongan kerja dengan status publikasi masing-masing
2. THE Portal BKK SHALL menyediakan form untuk Admin BKK membuat lowongan kerja baru dengan field: judul, nama perusahaan, URL logo perusahaan, lokasi, deskripsi, kualifikasi, cara melamar, batas waktu, dan status publikasi
3. WHEN Admin BKK menyimpan lowongan kerja baru, THE Portal BKK SHALL memvalidasi semua field wajib dan menyimpan data ke database dengan timestamp pembuatan
4. THE Portal BKK SHALL menyediakan fungsi edit untuk Admin BKK mengubah data lowongan kerja yang sudah ada
5. THE Portal BKK SHALL menyediakan fungsi hapus untuk Admin BKK menghapus lowongan kerja dari database
6. WHEN Admin BKK mengubah status publikasi lowongan kerja menjadi published, THE Portal BKK SHALL menampilkan lowongan tersebut di halaman publik

### Requirement 3: Manajemen Halaman Statis

**User Story:** Sebagai Admin BKK, saya ingin dapat mengedit konten halaman statis seperti Profil BKK, Visi Misi, dan Info Tracer Study, sehingga informasi yang ditampilkan kepada publik selalu up-to-date.

#### Acceptance Criteria

1. THE Portal BKK SHALL menyimpan konten halaman statis dalam database dengan identifier slug yang unik
2. WHEN Admin BKK terautentikasi mengakses dashboard, THE Portal BKK SHALL menampilkan daftar halaman statis yang dapat diedit
3. THE Portal BKK SHALL menyediakan editor konten untuk Admin BKK mengubah isi halaman statis
4. WHEN Admin BKK menyimpan perubahan halaman statis, THE Portal BKK SHALL memvalidasi konten dan menyimpan perubahan ke database dengan timestamp update
5. THE Portal BKK SHALL menampilkan konten halaman statis yang telah diupdate di route publik sesuai slug halaman

### Requirement 4: Tampilan Publik Landing Page

**User Story:** Sebagai pengunjung (siswa/alumni/DUDI), saya ingin melihat landing page yang modern dan profesional dengan daftar lowongan kerja terbaru, sehingga saya mendapat kesan positif dan dapat dengan mudah menemukan informasi yang saya butuhkan.

#### Acceptance Criteria

1. THE Portal BKK SHALL menampilkan landing page di route root (`/`) tanpa memerlukan autentikasi
2. THE Portal BKK SHALL menampilkan daftar lowongan kerja yang berstatus published di landing page dalam format card design
3. THE Portal BKK SHALL mengurutkan lowongan kerja berdasarkan tanggal publikasi terbaru di bagian atas
4. THE Portal BKK SHALL menggunakan palet warna putih sebagai background utama dan hijau sebagai warna aksen untuk CTA dan link
5. THE Portal BKK SHALL menggunakan tipografi modern yang mudah dibaca untuk semua teks di landing page

### Requirement 5: Halaman Detail Lowongan Kerja

**User Story:** Sebagai pengunjung, saya ingin dapat melihat detail lengkap dari sebuah lowongan kerja, sehingga saya dapat memahami persyaratan dan cara melamar pekerjaan tersebut.

#### Acceptance Criteria

1. WHEN pengunjung mengklik card lowongan kerja di landing page, THE Portal BKK SHALL mengarahkan pengunjung ke halaman detail lowongan di route `/loker/[id]`
2. THE Portal BKK SHALL menampilkan semua informasi lowongan kerja termasuk judul, nama perusahaan, logo, lokasi, deskripsi lengkap, kualifikasi, cara melamar, dan batas waktu
3. THE Portal BKK SHALL menampilkan instruksi cara melamar yang jelas (misal: kontak email/WA Admin BKK)
4. WHEN lowongan kerja tidak ditemukan atau tidak berstatus published, THE Portal BKK SHALL menampilkan halaman error 404
5. THE Portal BKK SHALL menyediakan tombol navigasi untuk kembali ke landing page

### Requirement 6: Halaman Statis Publik

**User Story:** Sebagai pengunjung, saya ingin dapat mengakses halaman informasi seperti Profil BKK, Visi Misi, dan Info Tracer Study, sehingga saya dapat memahami lebih lanjut tentang BKK dan data alumni.

#### Acceptance Criteria

1. THE Portal BKK SHALL menyediakan route dinamis `/[slug]` untuk menampilkan halaman statis berdasarkan slug
2. WHEN pengunjung mengakses route dengan slug yang valid, THE Portal BKK SHALL mengambil konten dari database dan menampilkannya
3. THE Portal BKK SHALL menampilkan konten halaman statis dengan format yang konsisten dan mudah dibaca
4. WHEN slug tidak ditemukan di database, THE Portal BKK SHALL menampilkan halaman error 404
5. THE Portal BKK SHALL menyediakan navigasi menu di header untuk mengakses halaman-halaman statis utama

### Requirement 7: Proteksi Route Admin

**User Story:** Sebagai sistem, saya perlu memastikan bahwa hanya Admin BKK yang terautentikasi yang dapat mengakses dashboard dan API admin, sehingga keamanan data terjaga.

#### Acceptance Criteria

1. WHEN pengguna yang tidak terautentikasi mencoba mengakses route `/admin/dashboard`, THE Portal BKK SHALL mengarahkan pengguna ke halaman login
2. THE Portal BKK SHALL memvalidasi session autentikasi pada setiap request ke API endpoint di `/api/admin/*`
3. WHEN request ke API admin tidak memiliki session valid, THE Portal BKK SHALL mengembalikan response HTTP 401 Unauthorized
4. THE Portal BKK SHALL menggunakan middleware untuk memeriksa autentikasi sebelum mengeksekusi handler API admin
5. WHEN session Admin BKK expired, THE Portal BKK SHALL mengarahkan Admin BKK ke halaman login

### Requirement 8: Database Schema dengan Prisma

**User Story:** Sebagai sistem, saya perlu memiliki skema database yang terstruktur dengan baik menggunakan Prisma ORM, sehingga operasi database aman, efisien, dan mudah dimaintain.

#### Acceptance Criteria

1. THE Portal BKK SHALL mendefinisikan model Admin dalam schema Prisma dengan field: id, username, password hash, email, created at, dan updated at
2. THE Portal BKK SHALL mendefinisikan model Loker dalam schema Prisma dengan field: id, judul, nama perusahaan, logo perusahaan URL, lokasi, deskripsi, kualifikasi, cara melamar, batas waktu, is published, created at, dan updated at
3. THE Portal BKK SHALL mendefinisikan model Halaman dalam schema Prisma dengan field: id, slug, judul, konten, created at, dan updated at
4. THE Portal BKK SHALL menggunakan PostgreSQL sebagai database provider dalam konfigurasi Prisma
5. THE Portal BKK SHALL menyediakan migration script untuk membuat tabel database sesuai schema yang didefinisikan

### Requirement 9: API Endpoints untuk Admin

**User Story:** Sebagai Admin BKK, saya memerlukan API endpoints yang aman dan terstruktur untuk melakukan operasi CRUD, sehingga dashboard admin dapat berkomunikasi dengan backend secara efisien.

#### Acceptance Criteria

1. THE Portal BKK SHALL menyediakan endpoint POST `/api/auth/login` untuk autentikasi Admin BKK
2. THE Portal BKK SHALL menyediakan endpoint POST `/api/auth/logout` untuk menghapus session Admin BKK
3. THE Portal BKK SHALL menyediakan endpoint GET `/api/admin/loker` untuk mengambil daftar semua lowongan kerja
4. THE Portal BKK SHALL menyediakan endpoint POST `/api/admin/loker` untuk membuat lowongan kerja baru
5. THE Portal BKK SHALL menyediakan endpoint GET `/api/admin/loker/[id]` untuk mengambil detail satu lowongan kerja
6. THE Portal BKK SHALL menyediakan endpoint PUT `/api/admin/loker/[id]` untuk mengupdate lowongan kerja
7. THE Portal BKK SHALL menyediakan endpoint DELETE `/api/admin/loker/[id]` untuk menghapus lowongan kerja
8. THE Portal BKK SHALL menyediakan endpoint GET `/api/admin/halaman` untuk mengambil daftar halaman statis
9. THE Portal BKK SHALL menyediakan endpoint GET `/api/admin/halaman/[slug]` untuk mengambil detail satu halaman statis
10. THE Portal BKK SHALL menyediakan endpoint PUT `/api/admin/halaman/[slug]` untuk mengupdate halaman statis

### Requirement 10: Development Environment dengan Docker

**User Story:** Sebagai developer, saya ingin dapat menjalankan database PostgreSQL secara lokal menggunakan Docker, sehingga setup development environment menjadi konsisten dan mudah.

#### Acceptance Criteria

1. THE Portal BKK SHALL menyediakan file `docker-compose.yml` untuk menjalankan service PostgreSQL
2. WHEN developer menjalankan `docker-compose up`, THE Portal BKK SHALL memulai container PostgreSQL dengan konfigurasi yang sesuai untuk development
3. THE Portal BKK SHALL mengkonfigurasi PostgreSQL container dengan environment variables untuk database name, user, dan password
4. THE Portal BKK SHALL memetakan port PostgreSQL container ke host machine untuk akses lokal
5. THE Portal BKK SHALL menyediakan volume persistence untuk data PostgreSQL agar data tidak hilang saat container restart

### Requirement 11: Code Quality dengan Tooling

**User Story:** Sebagai developer, saya ingin memastikan kualitas dan konsistensi kode dengan menggunakan Prettier, ESLint, dan Husky, sehingga codebase tetap maintainable dan mengikuti best practices.

#### Acceptance Criteria

1. THE Portal BKK SHALL mengkonfigurasi Prettier untuk formatting kode secara otomatis dengan aturan yang konsisten
2. THE Portal BKK SHALL mengkonfigurasi ESLint untuk linting kode Next.js dan TypeScript dengan aturan yang sesuai
3. THE Portal BKK SHALL mengkonfigurasi Husky pre-commit hook untuk menjalankan Prettier dan ESLint sebelum commit
4. WHEN developer melakukan commit, THE Portal BKK SHALL menjalankan format dan lint check secara otomatis
5. WHEN terdapat error linting atau formatting, THE Portal BKK SHALL mencegah commit dan menampilkan pesan error yang jelas

### Requirement 12: Desain UI/UX Modern dengan Tema Hijau-Putih

**User Story:** Sebagai pengunjung, saya ingin melihat interface yang modern, bersih, dan profesional dengan tema warna hijau-putih, sehingga pengalaman browsing saya menyenangkan dan portal terlihat kredibel.

#### Acceptance Criteria

1. THE Portal BKK SHALL menggunakan warna putih (#FFFFFF atau #FAFAFA) sebagai background utama untuk memberikan kesan spacious
2. THE Portal BKK SHALL menggunakan warna hijau modern (#228B22 atau #2E8B57) sebagai warna aksen untuk tombol CTA, link, dan ikon
3. THE Portal BKK SHALL menggunakan warna abu-abu gelap (#333333) untuk teks utama dan abu-abu muda (#E0E0E0) untuk border
4. THE Portal BKK SHALL menggunakan tipografi modern dari Google Fonts (seperti Inter, Poppins, atau Montserrat) untuk heading dan body text
5. THE Portal BKK SHALL menampilkan lowongan kerja dalam format card design dengan spacing yang konsisten
6. WHEN pengunjung menghover tombol atau link, THE Portal BKK SHALL menampilkan efek visual dengan warna hijau yang lebih gelap atau terang
