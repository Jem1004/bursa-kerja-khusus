import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create default admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@bkk-smk.sch.id",
      password: hashedPassword,
    },
  });

  console.log("✅ Admin user created:", {
    username: admin.username,
    email: admin.email,
  });

  // Create initial static pages
  const halamanData = [
    {
      slug: "profil-bkk",
      judul: "Profil BKK",
      konten: `<h2>Tentang BKK SMK</h2>
<p>Bursa Kerja Khusus (BKK) adalah sebuah lembaga yang dibentuk di Sekolah Menengah Kejuruan Negeri dan Swasta, sebagai unit pelaksana yang memberikan pelayanan dan informasi lowongan kerja, pelaksana pemasaran, penyaluran dan penempatan tenaga kerja, merupakan mitra Dinas Pendidikan dan Pelatihan Kerja.</p>

<h3>Fungsi BKK</h3>
<ul>
  <li>Sebagai wadah dalam mempertemukan tamatan dengan pencari kerja</li>
  <li>Memberikan layanan kepada tamatan sesuai dengan tugas dan fungsi masing-masing seksi</li>
  <li>Sebagai wadah dalam pelatihan tamatan yang belum terserap di dunia kerja</li>
</ul>`,
    },
    {
      slug: "visi-misi",
      judul: "Visi dan Misi",
      konten: `<h2>Visi BKK</h2>
<p>Menjadi lembaga penyalur tenaga kerja yang profesional dan terpercaya dalam memfasilitasi lulusan SMK untuk mendapatkan pekerjaan yang layak.</p>

<h2>Misi BKK</h2>
<ol>
  <li>Menjalin kerjasama dengan dunia usaha dan dunia industri (DUDI)</li>
  <li>Memberikan informasi lowongan kerja yang akurat dan terpercaya</li>
  <li>Memfasilitasi proses rekrutmen antara lulusan dan perusahaan</li>
  <li>Melakukan pendampingan dan bimbingan karir bagi siswa dan alumni</li>
  <li>Meningkatkan kompetensi lulusan melalui pelatihan dan sertifikasi</li>
</ol>`,
    },
    {
      slug: "tracer-study",
      judul: "Info Tracer Study",
      konten: `<h2>Tracer Study Alumni</h2>
<p>Tracer Study adalah studi pelacakan terhadap alumni untuk mengetahui outcome pendidikan dalam bentuk transisi dari dunia pendidikan tinggi ke dunia kerja, situasi kerja terakhir, dan aplikasi kompetensi di dunia kerja.</p>

<h3>Tujuan Tracer Study</h3>
<ul>
  <li>Mengetahui outcome pendidikan berupa informasi tentang profil kompetensi dan karir lulusan</li>
  <li>Mendapatkan masukan untuk penyempurnaan dan penjaminan kualitas pendidikan</li>
  <li>Membangun jejaring dengan alumni dan stakeholder</li>
</ul>

<h3>Data Alumni Terkini</h3>
<p>Untuk informasi lebih lanjut mengenai data tracer study dan statistik ketenagakerjaan alumni, silakan hubungi admin BKK.</p>`,
    },
  ];

  for (const halaman of halamanData) {
    const created = await prisma.halaman.upsert({
      where: { slug: halaman.slug },
      update: {
        judul: halaman.judul,
        konten: halaman.konten,
      },
      create: halaman,
    });
    console.log("✅ Halaman created:", created.slug);
  }

  console.log("🎉 Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
