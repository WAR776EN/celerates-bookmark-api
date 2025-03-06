import { z } from "zod";

export const createCategory = z.object({
  name: z.string().min(1),
  bookmarkIds: z.array(z.string()).optional(),
});

export const updateCategory = z.object({
  name: z.string().min(1),
  bookmarkIds: z.array(z.string()).optional(),
});
