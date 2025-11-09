import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HalamanForm } from "@/components/admin/HalamanForm";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default async function EditHalamanPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  // Fetch halaman data
  const halaman = await prisma.halaman.findUnique({
    where: {
      slug: params.slug,
    },
  });

  if (!halaman) {
    notFound();
  }

  // Prepare initial data for form
  const initialData = {
    slug: halaman.slug,
    judul: halaman.judul,
    konten: halaman.konten,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/dashboard/halaman"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Kembali ke Daftar Halaman
        </Link>
        <h2 className="text-2xl font-poppins font-bold text-neutral-900">
          Edit Halaman Statis
        </h2>
        <p className="text-neutral-600 mt-1">
          Perbarui konten halaman: {halaman.judul}
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <HalamanForm initialData={initialData} />
      </div>
    </div>
  );
}
