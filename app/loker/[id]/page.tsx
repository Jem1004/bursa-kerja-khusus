import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LokerDetail from "@/components/loker/LokerDetail";

async function getLokerById(id: string) {
  try {
    const loker = await prisma.loker.findUnique({
      where: {
        id,
      },
    });

    // Return null if loker not found or not published
    if (!loker || !loker.isPublished) {
      return null;
    }

    return loker;
  } catch (error) {
    console.error("Error fetching loker:", error);
    return null;
  }
}

export default async function LokerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const loker = await getLokerById(params.id);

  if (!loker) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <LokerDetail loker={loker} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
