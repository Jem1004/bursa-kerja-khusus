import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LokerForm } from "@/components/admin/LokerForm";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default async function EditLokerPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  // Fetch loker data
  const loker = await prisma.loker.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!loker) {
    notFound();
  }

  // Prepare initial data for form
  const initialData = {
    id: loker.id,
    judul: loker.judul,
    namaPerusahaan: loker.namaPerusahaan,
    logoPerusahaan: loker.logoPerusahaan || "",
    lokasi: loker.lokasi,
    deskripsi: loker.deskripsi,
    kualifikasi: loker.kualifikasi,
    caraMelamar: loker.caraMelamar,
    batasWaktu: loker.batasWaktu.toISOString(),
    isPublished: loker.isPublished,
  };

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
          Edit Lowongan Kerja
        </h2>
        <p className="text-neutral-600 mt-1">
          Perbarui informasi lowongan kerja: {loker.judul}
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <LokerForm mode="edit" initialData={initialData} />
      </div>
    </div>
  );
}
