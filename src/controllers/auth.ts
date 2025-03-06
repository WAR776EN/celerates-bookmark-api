import { Context, Next } from "hono";
import {
  registerUser,
  loginUser,
  verifyAccessToken,
  verifyRefreshToken,
  validateUser,
  saveRefreshToken,
  findUser,
  generateTokens,
} from "../services";
import { handleError } from "../utils/errHandler";

import { UnauthorizedError } from "../utils/errExtensions";
import { success } from "../utils/okHandler";

export const register = async (c: Context) => {
  try {
    const body = await c.req.json();
    const tokens = await registerUser(body.email, body.password);
    return c.json({ message: "User registered successfully", tokens });
  } catch (err) {
    return handleError(c, err);
  }
};

export const login = async (c: Context) => {
  try {
    const { email, password } = await c.req.json();
    const user = await validateUser(email, password);
    if (!user) throw new UnauthorizedError("Invalid credentials");

    const tokens = await loginUser(email, password);
    await saveRefreshToken(user.id, tokens.refreshToken);

    return success(c, tokens);
  } catch (err) {
    return handleError(c, err);
  }
};

export const isLoggedIn = async (c: Context, next: Next) => {
  const token = c.req.header("Authorization")?.split(" ")[1];
  if (!token) return c.json({ error: "Unauthorized" }, 401);

  try {
    const user = verifyAccessToken(token);
    c.set("userId", user.userId);
    await next();
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
};

export const refreshToken = async (c: Context) => {
  const { refreshToken } = await c.req.json();
  if (!refreshToken) throw new Error("Missing token");

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await findUser(decoded.userId);

    if (!user || user.refresh_token !== refreshToken) throw new UnauthorizedError("Invalid token");

    const newTokens = generateTokens(user.id);
    await saveRefreshToken(user.id, newTokens.refreshToken);

    return success(c, newTokens);
  } catch {
    return c.json({ error: "Invalid token" }, 403);
  }
};
