"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLokerSchema, CreateLokerInput } from "@/lib/validations/loker";

interface LokerFormProps {
  initialData?: Partial<CreateLokerInput> & { id?: string };
  mode: "create" | "edit";
}

export function LokerForm({ initialData, mode }: LokerFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLokerInput>({
    resolver: zodResolver(createLokerSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          batasWaktu: initialData.batasWaktu
            ? new Date(initialData.batasWaktu).toISOString().slice(0, 16)
            : "",
        }
      : {
          isPublished: false,
        },
  });

  const onSubmit = async (data: CreateLokerInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const url =
        mode === "create"
          ? "/api/admin/loker"
          : `/api/admin/loker/${initialData?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          // Display validation errors
          const errorMessages = result.errors
            .map((e: any) => `${e.field}: ${e.message}`)
            .join(", ");
          setError(errorMessages);
        } else {
          setError(result.message || "Terjadi kesalahan");
        }
        return;
      }

      // Success - redirect to loker list
      router.push("/admin/dashboard/loker");
      router.refresh();
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Terjadi kesalahan:</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Judul */}
      <div>
        <label
          htmlFor="judul"
          className="block text-sm font-medium text-neutral-700 mb-2"
        >
          Judul Lowongan <span className="text-red-500">*</span>
        </label>
        <input
          {...register("judul")}
          type="text"
          id="judul"
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
          placeholder="Contoh: Staff Marketing"
        />
        {errors.judul && (
          <p className="text-red-500 text-sm mt-1">{errors.judul.message}</p>
        )}
      </div>

      {/* Nama Perusahaan */}
      <div>
        <label
          htmlFor="namaPerusahaan"
          className="block text-sm font-medium text-neutral-700 mb-2"
        >
          Nama Perusahaan <span className="text-red-500">*</span>
        </label>
        <input
          {...register("namaPerusahaan")}
          type="text"
          id="namaPerusahaan"
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
          placeholder="Contoh: PT Maju Jaya"
        />
        {errors.namaPerusahaan && (
          <p className="text-red-500 text-sm mt-1">
            {errors.namaPerusahaan.message}
          </p>
        )}
      </div>

      {/* Logo Perusahaan */}
      <div>
        <label
          htmlFor="logoPerusahaan"
          className="block text-sm font-medium text-neutral-700 mb-2"
        >
          URL Logo Perusahaan (opsional)
        </label>
        <input
          {...register("logoPerusahaan")}
          type="text"
          id="logoPerusahaan"
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
          placeholder="https://example.com/logo.png"
        />
        {errors.logoPerusahaan && (
          <p className="text-red-500 text-sm mt-1">
            {errors.logoPerusahaan.message}
          </p>
        )}
        <p className="text-neutral-600 text-sm mt-1">
          Masukkan URL gambar logo perusahaan
        </p>
      </div>

      {/* Lokasi */}
      <div>
        <label
          htmlFor="lokasi"
          className="block text-sm font-medium text-neutral-700 mb-2"
        >
          Lokasi <span className="text-red-500">*</span>
        </label>
        <input
          {...register("lokasi")}
          type="text"
          id="lokasi"
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
          placeholder="Contoh: Jakarta Selatan"
        />
        {errors.lokasi && (
          <p className="text-red-500 text-sm mt-1">{errors.lokasi.message}</p>
        )}
      </div>

      {/* Deskripsi */}
      <div>
        <label
          htmlFor="deskripsi"
          className="block text-sm font-medium text-neutral-700 mb-2"
        >
          Deskripsi Pekerjaan <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("deskripsi")}
          id="deskripsi"
          rows={5}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-y"
          placeholder="Jelaskan deskripsi pekerjaan secara detail..."
        />
        {errors.deskripsi && (
          <p className="text-red-500 text-sm mt-1">
            {errors.deskripsi.message}
          </p>
        )}
      </div>

      {/* Kualifikasi */}
      <div>
        <label
          htmlFor="kualifikasi"
          className="block text-sm font-medium text-neutral-700 mb-2"
        >
          Kualifikasi <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("kualifikasi")}
          id="kualifikasi"
          rows={5}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-y"
          placeholder="Tuliskan kualifikasi yang dibutuhkan..."
        />
        {errors.kualifikasi && (
          <p className="text-red-500 text-sm mt-1">
            {errors.kualifikasi.message}
          </p>
        )}
      </div>

      {/* Cara Melamar */}
      <div>
        <label
          htmlFor="caraMelamar"
          className="block text-sm font-medium text-neutral-700 mb-2"
        >
          Cara Melamar <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("caraMelamar")}
          id="caraMelamar"
          rows={4}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-y"
          placeholder="Contoh: Kirim CV dan surat lamaran ke email@perusahaan.com atau hubungi Admin BKK..."
        />
        {errors.caraMelamar && (
          <p className="text-red-500 text-sm mt-1">
            {errors.caraMelamar.message}
          </p>
        )}
      </div>

      {/* Batas Waktu */}
      <div>
        <label
          htmlFor="batasWaktu"
          className="block text-sm font-medium text-neutral-700 mb-2"
        >
          Batas Waktu Pendaftaran <span className="text-red-500">*</span>
        </label>
        <input
          {...register("batasWaktu")}
          type="datetime-local"
          id="batasWaktu"
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
        />
        {errors.batasWaktu && (
          <p className="text-red-500 text-sm mt-1">
            {errors.batasWaktu.message}
          </p>
        )}
      </div>

      {/* Status Publikasi */}
      <div className="flex items-center gap-3">
        <input
          {...register("isPublished")}
          type="checkbox"
          id="isPublished"
          className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-2 focus:ring-primary-500"
        />
        <label
          htmlFor="isPublished"
          className="text-sm font-medium text-neutral-700"
        >
          Publikasikan lowongan ini (akan tampil di halaman publik)
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 pt-4 border-t border-neutral-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Menyimpan..."
            : mode === "create"
              ? "Buat Lowongan"
              : "Simpan Perubahan"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-lg transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
