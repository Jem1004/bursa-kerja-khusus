import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createLokerSchema } from "@/lib/validations/loker";
import {
  handleApiError,
  successResponse,
  unauthorizedResponse,
} from "@/lib/api-error";

// GET /api/admin/loker - Fetch all loker dengan pagination
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return unauthorizedResponse();
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const publishedParam = searchParams.get("published");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const where: any = {};
    if (publishedParam !== null) {
      where.isPublished = publishedParam === "true";
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

    return NextResponse.json(
      {
        success: true,
        data: lokers,
        total,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error, "GET /api/admin/loker");
  }
}

// POST /api/admin/loker - Create new loker
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return unauthorizedResponse();
    }

    // Parse and validate request body
    const body = await request.json();
    const validated = createLokerSchema.parse(body);

    // Handle empty logoPerusahaan
    const data: any = {
      ...validated,
      batasWaktu: new Date(validated.batasWaktu),
    };

    if (validated.logoPerusahaan === "") {
      data.logoPerusahaan = null;
    }

    // Create loker
    const loker = await prisma.loker.create({
      data,
    });

    return successResponse(loker, "Lowongan kerja berhasil dibuat", 201);
  } catch (error) {
    return handleApiError(error, "POST /api/admin/loker");
  }
}
