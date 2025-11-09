import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LokerForm } from "@/components/admin/LokerForm";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default async function CreateLokerPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/dashboard/loker"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Kembali ke Daftar Lowongan
        </Link>
        <h2 className="text-2xl font-poppins font-bold text-neutral-900">
          Buat Lowongan Kerja Baru
        </h2>
        <p className="text-neutral-600 mt-1">
          Isi formulir di bawah untuk membuat lowongan kerja baru
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <LokerForm mode="create" />
      </div>
    </div>
  );
}
