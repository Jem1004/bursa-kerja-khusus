import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  BriefcaseIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  // Fetch statistics
  const [totalLoker, publishedLoker, totalHalaman] = await Promise.all([
    prisma.loker.count(),
    prisma.loker.count({ where: { isPublished: true } }),
    prisma.halaman.count(),
  ]);

  const stats = [
    {
      name: "Total Lowongan Kerja",
      value: totalLoker,
      icon: BriefcaseIcon,
      color: "bg-blue-500",
    },
    {
      name: "Lowongan Dipublikasi",
      value: publishedLoker,
      icon: CheckCircleIcon,
      color: "bg-primary-500",
    },
    {
      name: "Halaman Statis",
      value: totalHalaman,
      icon: DocumentTextIcon,
      color: "bg-purple-500",
    },
  ];

  const quickActions = [
    {
      name: "Buat Lowongan Kerja",
      description: "Tambahkan lowongan kerja baru",
      href: "/admin/dashboard/loker/create",
      icon: BriefcaseIcon,
      color: "bg-primary-600 hover:bg-primary-700",
    },
    {
      name: "Edit Halaman Statis",
      description: "Kelola konten halaman statis",
      href: "/admin/dashboard/halaman",
      icon: DocumentTextIcon,
      color: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-poppins font-bold text-neutral-900 mb-2">
          Selamat Datang, {session.user.name}!
        </h2>
        <p className="text-neutral-600">
          Kelola konten Portal BKK SMK dari dashboard ini.
        </p>
      </div>

      {/* Statistics Cards */}
      <div>
        <h3 className="text-lg font-poppins font-semibold text-neutral-900 mb-4">
          Statistik
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-poppins font-bold text-neutral-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-poppins font-semibold text-neutral-900 mb-4">
          Aksi Cepat
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`${action.color} p-3 rounded-lg transition-colors`}
                >
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-poppins font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                    {action.name}
                  </h4>
                  <p className="text-sm text-neutral-600 mt-1">
                    {action.description}
                  </p>
                </div>
                <PlusIcon className="h-5 w-5 text-neutral-400 group-hover:text-primary-600 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity or Additional Info */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-poppins font-semibold text-neutral-900 mb-4">
          Informasi
        </h3>
        <div className="space-y-3 text-sm text-neutral-600">
          <p>
            • Gunakan menu navigasi di sebelah kiri untuk mengakses fitur-fitur
            admin.
          </p>
          <p>
            • Lowongan kerja yang dipublikasi akan tampil di halaman publik
            portal.
          </p>
          <p>
            • Pastikan untuk mengisi semua informasi dengan lengkap dan akurat.
          </p>
        </div>
      </div>
    </div>
  );
}
