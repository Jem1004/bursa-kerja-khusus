import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-neutral-200 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">BKK</span>
              </div>
              <span className="font-poppins font-semibold text-lg text-neutral-900">
                Portal BKK SMK
              </span>
            </div>
            <p className="text-neutral-600 text-sm">
              Portal Bursa Kerja Khusus SMK - Menghubungkan siswa dan alumni
              dengan peluang karir terbaik.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-poppins font-semibold text-neutral-900 mb-4">
              Tautan Cepat
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-neutral-600 hover:text-primary-600 transition-colors text-sm"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/profil-bkk"
                  className="text-neutral-600 hover:text-primary-600 transition-colors text-sm"
                >
                  Profil BKK
                </Link>
              </li>
              <li>
                <Link
                  href="/visi-misi"
                  className="text-neutral-600 hover:text-primary-600 transition-colors text-sm"
                >
                  Visi Misi
                </Link>
              </li>
              <li>
                <Link
                  href="/tracer-study"
                  className="text-neutral-600 hover:text-primary-600 transition-colors text-sm"
                >
                  Tracer Study
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-poppins font-semibold text-neutral-900 mb-4">
              Kontak
            </h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li className="flex items-center space-x-2">
                <span>📧</span>
                <span>bkk@smk.sch.id</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📱</span>
                <span>+62 812-3456-7890</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📍</span>
                <span>SMK Negeri, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-200 mt-8 pt-6 text-center">
          <p className="text-neutral-600 text-sm">
            © {currentYear} Portal BKK SMK. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
