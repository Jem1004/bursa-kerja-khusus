"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateHalamanSchema,
  UpdateHalamanInput,
} from "@/lib/validations/halaman";

interface HalamanFormProps {
  initialData: UpdateHalamanInput & { slug: string };
}

export function HalamanForm({ initialData }: HalamanFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateHalamanInput>({
    resolver: zodResolver(updateHalamanSchema),
    defaultValues: {
      judul: initialData.judul,
      konten: initialData.konten,
    },
  });

  const onSubmit = async (data: UpdateHalamanInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/halaman/${initialData.slug}`, {
        method: "PUT",
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

      // Success - redirect to halaman list
      router.push("/admin/dashboard/halaman");
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

      {/* Slug (Read-only) */}
      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-neutral-700 mb-2"
        >
          Slug (URL)
        </label>
        <input
          type="text"
          id="slug"
          value={`/${initialData.slug}`}
          disabled
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-600 cursor-not-allowed"
        />
        <p className="text-neutral-600 text-sm mt-1">Slug tidak dapat diubah</p>
      </div>

      {/* Judul */}
      <div>
        <label
          htmlFor="judul"
          className="block text-sm font-medium text-neutral-700 mb-2"
        >
          Judul Halaman <span className="text-red-500">*</span>
        </label>
        <input
          {...register("judul")}
          type="text"
          id="judul"
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
          placeholder="Contoh: Profil BKK"
        />
        {errors.judul && (
          <p className="text-red-500 text-sm mt-1">{errors.judul.message}</p>
        )}
      </div>

      {/* Konten */}
      <div>
        <label
          htmlFor="konten"
          className="block text-sm font-medium text-neutral-700 mb-2"
        >
          Konten Halaman <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("konten")}
          id="konten"
          rows={15}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors resize-y font-mono text-sm"
          placeholder="Tulis konten halaman di sini. Anda dapat menggunakan HTML untuk formatting."
        />
        {errors.konten && (
          <p className="text-red-500 text-sm mt-1">{errors.konten.message}</p>
        )}
        <p className="text-neutral-600 text-sm mt-1">
          Tip: Anda dapat menggunakan HTML tags untuk formatting (contoh:
          &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;strong&gt;, dll)
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 pt-4 border-t border-neutral-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
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
