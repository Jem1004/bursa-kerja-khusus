import { z } from "zod";

export const createLokerSchema = z.object({
  judul: z
    .string()
    .min(5, "Judul minimal 5 karakter")
    .max(200, "Judul maksimal 200 karakter"),
  namaPerusahaan: z
    .string()
    .min(2, "Nama perusahaan minimal 2 karakter")
    .max(200, "Nama perusahaan maksimal 200 karakter"),
  logoPerusahaan: z
    .string()
    .url("URL logo tidak valid")
    .optional()
    .or(z.literal("")),
  lokasi: z
    .string()
    .min(3, "Lokasi minimal 3 karakter")
    .max(200, "Lokasi maksimal 200 karakter"),
  deskripsi: z.string().min(20, "Deskripsi minimal 20 karakter"),
  kualifikasi: z.string().min(10, "Kualifikasi minimal 10 karakter"),
  caraMelamar: z.string().min(10, "Cara melamar minimal 10 karakter"),
  batasWaktu: z.string().datetime("Format tanggal tidak valid"),
  isPublished: z.boolean(),
});

export const updateLokerSchema = createLokerSchema.partial();

export type CreateLokerInput = z.infer<typeof createLokerSchema>;
export type UpdateLokerInput = z.infer<typeof updateLokerSchema>;
