import { NextResponse } from "next/server";
import { z } from "zod";

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  code?: string;
}

export interface ApiSuccessResponse<T = any> {
  success: true;
  data?: T;
  message?: string;
  total?: number;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Handle Zod validation errors and return formatted response
 */
export function handleValidationError(error: z.ZodError) {
  return NextResponse.json<ApiErrorResponse>(
    {
      success: false,
      message: "Validasi gagal",
      errors: error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
      code: "VALIDATION_ERROR",
    },
    { status: 400 }
  );
}

/**
 * Handle generic errors and return formatted response
 */
export function handleApiError(error: unknown, context?: string) {
  // Log error for debugging
  if (context) {
    console.error(`[API Error - ${context}]:`, error);
  } else {
    console.error("[API Error]:", error);
  }

  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    return handleValidationError(error);
  }

  // Handle known error types
  if (error instanceof Error) {
    // Check for specific error messages
    if (error.message.includes("not found")) {
      return NextResponse.json<ApiErrorResponse>(
        {
          success: false,
          message: "Resource tidak ditemukan",
          code: "NOT_FOUND",
        },
        { status: 404 }
      );
    }

    if (error.message.includes("unauthorized")) {
      return NextResponse.json<ApiErrorResponse>(
        {
          success: false,
          message: "Tidak memiliki akses",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }
  }

  // Default server error
  return NextResponse.json<ApiErrorResponse>(
    {
      success: false,
      message: "Terjadi kesalahan server",
      code: "INTERNAL_ERROR",
    },
    { status: 500 }
  );
}

/**
 * Return success response
 */
export function successResponse<T>(
  data?: T,
  message?: string,
  status: number = 200
) {
  return NextResponse.json<ApiSuccessResponse<T>>(
    {
      success: true,
      ...(data !== undefined && { data }),
      ...(message && { message }),
    },
    { status }
  );
}

/**
 * Return error response
 */
export function errorResponse(
  message: string,
  code?: string,
  status: number = 400
) {
  return NextResponse.json<ApiErrorResponse>(
    {
      success: false,
      message,
      ...(code && { code }),
    },
    { status }
  );
}

/**
 * Return not found response
 */
export function notFoundResponse(message: string = "Resource tidak ditemukan") {
  return errorResponse(message, "NOT_FOUND", 404);
}

/**
 * Return unauthorized response
 */
export function unauthorizedResponse(message: string = "Tidak memiliki akses") {
  return errorResponse(message, "UNAUTHORIZED", 401);
}
