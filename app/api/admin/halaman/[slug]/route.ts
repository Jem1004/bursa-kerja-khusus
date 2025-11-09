import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateHalamanSchema } from "@/lib/validations/halaman";
import {
  handleApiError,
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
} from "@/lib/api-error";

// GET /api/admin/halaman/[slug] - Fetch single halaman
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return unauthorizedResponse();
    }

    // Fetch halaman by slug
    const halaman = await prisma.halaman.findUnique({
      where: {
        slug: params.slug,
      },
    });

    if (!halaman) {
      return notFoundResponse("Halaman tidak ditemukan");
    }

    return successResponse(halaman);
  } catch (error) {
    return handleApiError(error, "GET /api/admin/halaman/[slug]");
  }
}

// PUT /api/admin/halaman/[slug] - Update halaman
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return unauthorizedResponse();
    }

    // Check if halaman exists
    const existingHalaman = await prisma.halaman.findUnique({
      where: {
        slug: params.slug,
      },
    });

    if (!existingHalaman) {
      return notFoundResponse("Halaman tidak ditemukan");
    }

    // Parse and validate request body
    const body = await request.json();
    const validated = updateHalamanSchema.parse(body);

    // Update halaman
    const halaman = await prisma.halaman.update({
      where: {
        slug: params.slug,
      },
      data: validated,
    });

    return successResponse(halaman, "Halaman berhasil diupdate");
  } catch (error) {
    return handleApiError(error, "PUT /api/admin/halaman/[slug]");
  }
}
