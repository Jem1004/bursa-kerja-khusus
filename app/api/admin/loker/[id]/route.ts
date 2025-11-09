import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateLokerSchema } from "@/lib/validations/loker";
import {
  handleApiError,
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
} from "@/lib/api-error";

// GET /api/admin/loker/[id] - Fetch single loker
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return unauthorizedResponse();
    }

    // Fetch loker by id
    const loker = await prisma.loker.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!loker) {
      return notFoundResponse("Lowongan kerja tidak ditemukan");
    }

    return successResponse(loker);
  } catch (error) {
    return handleApiError(error, "GET /api/admin/loker/[id]");
  }
}

// PUT /api/admin/loker/[id] - Update loker
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return unauthorizedResponse();
    }

    // Check if loker exists
    const existingLoker = await prisma.loker.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existingLoker) {
      return notFoundResponse("Lowongan kerja tidak ditemukan");
    }

    // Parse and validate request body
    const body = await request.json();
    const validated = updateLokerSchema.parse(body);

    // Prepare update data
    const data: any = { ...validated };

    // Convert batasWaktu to Date if provided
    if (validated.batasWaktu) {
      data.batasWaktu = new Date(validated.batasWaktu);
    }

    // Handle empty logoPerusahaan
    if (validated.logoPerusahaan === "") {
      data.logoPerusahaan = null;
    }

    // Update loker
    const loker = await prisma.loker.update({
      where: {
        id: params.id,
      },
      data,
    });

    return successResponse(loker, "Lowongan kerja berhasil diupdate");
  } catch (error) {
    return handleApiError(error, "PUT /api/admin/loker/[id]");
  }
}

// DELETE /api/admin/loker/[id] - Delete loker
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return unauthorizedResponse();
    }

    // Check if loker exists
    const existingLoker = await prisma.loker.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existingLoker) {
      return notFoundResponse("Lowongan kerja tidak ditemukan");
    }

    // Delete loker
    await prisma.loker.delete({
      where: {
        id: params.id,
      },
    });

    return successResponse(undefined, "Lowongan kerja berhasil dihapus");
  } catch (error) {
    return handleApiError(error, "DELETE /api/admin/loker/[id]");
  }
}
