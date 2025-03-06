import { Context, Next } from "hono";
import { z } from "zod";
import { IRegisterReq } from "../../interfaces/api/register.interface";
import { handleError } from "../../utils/errHandler";
import { ValidationError } from "../../utils/errExtensions";

const authSchema = z.object({
  email: z.string().email("Email must be a correct format"),
  password: z.string().min(6, "Password must contain at least 6 characters"),
});

export const validatePayload = async (c: Context, next: Next) => {
  try {
    const body = await c.req.json<IRegisterReq>();
    const parsed = authSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.issues;
      throw new ValidationError("Validation Error", errors);
    }

    await next();
  } catch (err) {
    return handleError(c, err);
  }
};
