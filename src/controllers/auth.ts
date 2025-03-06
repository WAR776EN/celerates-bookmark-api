import { Context, Next } from "hono";
import { registerUser, loginUser, verifyUserToken } from "../services";
import { handleError } from "../utils/errHandler";
import { z } from "zod";
import { IRegisterReq, IRegisterRes } from "../interfaces/api/register.interface";

const authSchema = z.object({
  email: z.string().email("Email must be a correct format"),
  password: z.string().min(6, "Password must contain at least 6 characters"),
});

export const register = async (c: Context) => {
  try {
    const body = await c.req.json<IRegisterReq>();
    const parsed = authSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const token = await registerUser(parsed.data.email, parsed.data.password);
    return c.json<IRegisterRes>({ message: "User registered successfully", token });
  } catch (err) {
    return handleError(c, err)
  }
}

export const login = async (c: Context) => {
  try {
    const body = await c.req.json();
    const parsed = authSchema.safeParse(body);
    
    if (!parsed.success) {
      return c.json({ error: parsed.error.format() }, 400);
    }

    const token = await loginUser(parsed.data.email, parsed.data.password);
    return c.json({ message: "Login successful", token });
  } catch (err) {
    return handleError(c, err)
  }
}

export const isLoggedIn = async (c: Context, next: Next) => {
  const token = c.req.header("Authorization")?.split(" ")[1];
  if (!token) return c.json({ error: "Unauthorized" }, 401);

  try {
    const user = verifyUserToken(token);
    c.set("userId", user.userId);
    await next();
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
}