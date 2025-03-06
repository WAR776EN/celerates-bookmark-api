import { Context, Next } from "hono";
import { z } from "zod";
import { handleError } from "../../utils/errHandler";
import { ValidationError } from "../../utils/errExtensions";
import { ICreateBookmark } from "../../interfaces/common/createBookmark.interface";

const categorySchema = z.object({
  name: z.string().min(1),
  bookmarkIds: z.array(z.string()).optional(),
});

export const validatePayload = async (c: Context, next: Next) => {
  try {
    const body: ICreateBookmark = await c.req.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.issues;
      throw new ValidationError("Validation Error!", errors);
    }

    await next();
  } catch (err) {
    return handleError(c, err);
  }
};
