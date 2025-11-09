import { z } from "zod";

export const updateHalamanSchema = z.object({
  judul: z
    .string()
    .min(3, "Judul minimal 3 karakter")
    .max(200, "Judul maksimal 200 karakter"),
  konten: z.string().min(10, "Konten minimal 10 karakter"),
});

export type UpdateHalamanInput = z.infer<typeof updateHalamanSchema>;
