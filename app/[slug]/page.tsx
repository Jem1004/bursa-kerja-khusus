import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

async function getHalamanBySlug(slug: string) {
  try {
    const halaman = await prisma.halaman.findUnique({
      where: {
        slug,
      },
    });

    return halaman;
  } catch (error) {
    console.error("Error fetching halaman:", error);
    return null;
  }
}

export default async function HalamanPage({
  params,
}: {
  params: { slug: string };
}) {
  const halaman = await getHalamanBySlug(params.slug);

  if (!halaman) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <h1 className="font-poppins font-bold text-3xl sm:text-4xl text-neutral-900">
                {halaman.judul}
              </h1>
            </CardHeader>

            <CardContent>
              <div className="prose prose-neutral max-w-none">
                <div className="text-neutral-700 whitespace-pre-wrap leading-relaxed">
                  {halaman.konten}
                </div>
              </div>

              {/* Info Tambahan */}
              <div className="mt-8 pt-6 border-t border-neutral-200">
                <p className="text-sm text-neutral-500">
                  Terakhir diperbarui:{" "}
                  {new Intl.DateTimeFormat("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }).format(new Date(halaman.updatedAt))}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
