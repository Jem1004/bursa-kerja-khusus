import { prisma } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LokerCard from "@/components/loker/LokerCard";

async function getPublishedLoker() {
  const loker = await prisma.loker.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return loker;
}

export default async function Home() {
  const lokerList = await getPublishedLoker();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 to-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl text-center">
            <h1 className="font-poppins font-bold text-4xl sm:text-5xl lg:text-6xl text-neutral-900 mb-4">
              Portal BKK SMK
            </h1>
            <p className="text-lg sm:text-xl text-neutral-700 max-w-2xl mx-auto mb-8">
              Temukan Peluang Karirmu - Platform informasi lowongan kerja
              terverifikasi untuk siswa dan alumni SMK
            </p>
            <div className="flex items-center justify-center gap-2 text-primary-600">
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">
                {lokerList.length} Lowongan Kerja Tersedia
              </span>
            </div>
          </div>
        </section>

        {/* Loker List Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <h2 className="font-poppins font-semibold text-2xl sm:text-3xl text-neutral-900 mb-8">
              Lowongan Kerja Terbaru
            </h2>

            {lokerList.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-neutral-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-poppins font-semibold text-xl text-neutral-900 mb-2">
                  Belum Ada Lowongan
                </h3>
                <p className="text-neutral-600">
                  Saat ini belum ada lowongan kerja yang tersedia. Silakan cek
                  kembali nanti.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lokerList.map((loker: any) => (
                  <LokerCard
                    key={loker.id}
                    id={loker.id}
                    judul={loker.judul}
                    namaPerusahaan={loker.namaPerusahaan}
                    logoPerusahaan={loker.logoPerusahaan}
                    lokasi={loker.lokasi}
                    deskripsi={loker.deskripsi}
                    batasWaktu={loker.batasWaktu}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
