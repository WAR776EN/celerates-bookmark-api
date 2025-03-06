import { Context, Next } from "hono";
import { z } from "zod";
import { handleError } from "../../utils/errHandler";
import { ValidationError } from "../../utils/errExtensions";
import { ICreateBookmark } from "../../interfaces/common/createBookmark.interface";

const bookmarkSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const validatePayload = async (c: Context, next: Next) => {
  try {
    const body: ICreateBookmark = await c.req.json();
    const parsed = bookmarkSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.issues;
      throw new ValidationError("Validation Error!", errors);
    }

    await next();
  } catch (err) {
    return handleError(c, err);
  }
};
