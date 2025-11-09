import { successResponse } from "@/lib/api-error";

export async function POST() {
  return successResponse(undefined, "Logout berhasil");
}
