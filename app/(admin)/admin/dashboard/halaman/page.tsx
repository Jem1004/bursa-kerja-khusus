import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { PencilIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

export default async function HalamanListPage() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  // Fetch all halaman
  const halaman = await prisma.halaman.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-poppins font-bold text-neutral-900">
            Kelola Halaman Statis
          </h2>
          <p className="text-neutral-600 mt-1">
            Edit konten halaman statis seperti Profil BKK, Visi Misi, dan Info
            Tracer Study
          </p>
        </div>
      </div>

      {/* Halaman List */}
      {halaman.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
          <p className="text-neutral-600">
            Belum ada halaman statis. Jalankan seed script untuk membuat halaman
            default.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {halaman.map((page: any) => (
            <div
              key={page.id}
              className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-primary-50 rounded-lg">
                    <DocumentTextIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-poppins font-semibold text-neutral-900">
                      {page.judul}
                    </h3>
                    <p className="text-sm text-neutral-600 mt-1">
                      Slug: /{page.slug}
                    </p>
                    <p className="text-sm text-neutral-500 mt-2 line-clamp-2">
                      {page.konten.substring(0, 150)}
                      {page.konten.length > 150 ? "..." : ""}
                    </p>
                    <p className="text-xs text-neutral-400 mt-3">
                      Terakhir diupdate:{" "}
                      {new Date(page.updatedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/admin/dashboard/halaman/${page.slug}/edit`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
