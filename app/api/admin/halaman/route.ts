import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  handleApiError,
  successResponse,
  unauthorizedResponse,
} from "@/lib/api-error";

// GET /api/admin/halaman - Fetch all halaman
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return unauthorizedResponse();
    }

    // Fetch all halaman
    const halaman = await prisma.halaman.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    return successResponse(halaman);
  } catch (error) {
    return handleApiError(error, "GET /api/admin/halaman");
  }
}
