import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { LokerListClient } from "@/components/admin/LokerListClient";

export default async function LokerListPage({
  searchParams,
}: {
  searchParams: { published?: string; page?: string };
}) {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  // Parse query parameters
  const publishedFilter = searchParams.published;
  const page = parseInt(searchParams.page || "1");
  const limit = 10;
  const offset = (page - 1) * limit;

  // Build where clause
  const where: any = {};
  if (publishedFilter === "true") {
    where.isPublished = true;
  } else if (publishedFilter === "false") {
    where.isPublished = false;
  }

  // Fetch loker with pagination
  const [lokers, total] = await Promise.all([
    prisma.loker.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
    }),
    prisma.loker.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-poppins font-bold text-neutral-900">
            Kelola Lowongan Kerja
          </h2>
          <p className="text-neutral-600 mt-1">
            Daftar semua lowongan kerja yang telah dibuat
          </p>
        </div>
        <Link
          href="/admin/dashboard/loker/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Buat Lowongan Baru
        </Link>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-neutral-700">Filter:</span>
          <div className="flex gap-2">
            <Link
              href="/admin/dashboard/loker"
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                !publishedFilter
                  ? "bg-primary-600 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              Semua
            </Link>
            <Link
              href="/admin/dashboard/loker?published=true"
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                publishedFilter === "true"
                  ? "bg-primary-600 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              Dipublikasi
            </Link>
            <Link
              href="/admin/dashboard/loker?published=false"
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                publishedFilter === "false"
                  ? "bg-primary-600 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              Draft
            </Link>
          </div>
          <span className="text-sm text-neutral-600 ml-auto">
            Total: {total} lowongan
          </span>
        </div>
      </div>

      {/* Loker List */}
      {lokers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
          <p className="text-neutral-600">
            Belum ada lowongan kerja.{" "}
            <Link
              href="/admin/dashboard/loker/create"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Buat lowongan pertama
            </Link>
          </p>
        </div>
      ) : (
        <LokerListClient lokers={lokers} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/admin/dashboard/loker?${new URLSearchParams({
                ...(publishedFilter && { published: publishedFilter }),
                page: (page - 1).toString(),
              })}`}
              className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Sebelumnya
            </Link>
          )}
          <span className="px-4 py-2 text-neutral-700">
            Halaman {page} dari {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/admin/dashboard/loker?${new URLSearchParams({
                ...(publishedFilter && { published: publishedFilter }),
                page: (page + 1).toString(),
              })}`}
              className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Selanjutnya
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
