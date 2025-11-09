"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { Loker } from "@prisma/client";

interface LokerListClientProps {
  lokers: Loker[];
}

export function LokerListClient({
  lokers: initialLokers,
}: LokerListClientProps) {
  const router = useRouter();
  const [lokers, setLokers] = useState(initialLokers);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleDelete = async (id: string, judul: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus lowongan "${judul}"?`)) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/admin/loker/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus lowongan");
      }

      // Remove from local state
      setLokers(lokers.filter((loker) => loker.id !== id));
      router.refresh();
    } catch (error) {
      console.error("Error deleting loker:", error);
      alert("Gagal menghapus lowongan. Silakan coba lagi.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    setTogglingId(id);

    try {
      const response = await fetch(`/api/admin/loker/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublished: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengubah status publikasi");
      }

      const result = await response.json();

      // Update local state
      setLokers(
        lokers.map((loker) =>
          loker.id === id ? { ...loker, isPublished: !currentStatus } : loker
        )
      );
      router.refresh();
    } catch (error) {
      console.error("Error toggling publish status:", error);
      alert("Gagal mengubah status publikasi. Silakan coba lagi.");
    } finally {
      setTogglingId(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {lokers.map((loker) => (
        <div
          key={loker.id}
          className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-4">
            {/* Logo */}
            {loker.logoPerusahaan && (
              <div className="flex-shrink-0 w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden">
                <img
                  src={loker.logoPerusahaan}
                  alt={loker.namaPerusahaan}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-poppins font-semibold text-neutral-900">
                    {loker.judul}
                  </h3>
                  <p className="text-neutral-600 mt-1">
                    {loker.namaPerusahaan}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-neutral-600">
                    <span>📍 {loker.lokasi}</span>
                    <span>⏰ Batas: {formatDate(loker.batasWaktu)}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {loker.isPublished ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                      <EyeIcon className="h-4 w-4" />
                      Dipublikasi
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 text-neutral-700 text-sm font-medium rounded-full">
                      <EyeSlashIcon className="h-4 w-4" />
                      Draft
                    </span>
                  )}
                </div>
              </div>

              {/* Description Preview */}
              <p className="text-neutral-700 mt-3 line-clamp-2">
                {loker.deskripsi}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-4">
                <Link
                  href={`/admin/dashboard/loker/${loker.id}/edit`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit
                </Link>

                <button
                  onClick={() =>
                    handleTogglePublish(loker.id, loker.isPublished)
                  }
                  disabled={togglingId === loker.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {togglingId === loker.id ? (
                    "..."
                  ) : loker.isPublished ? (
                    <>
                      <EyeSlashIcon className="h-4 w-4" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <EyeIcon className="h-4 w-4" />
                      Publish
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(loker.id, loker.judul)}
                  disabled={deletingId === loker.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <TrashIcon className="h-4 w-4" />
                  {deletingId === loker.id ? "Menghapus..." : "Hapus"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
