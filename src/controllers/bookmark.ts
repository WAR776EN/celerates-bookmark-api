import { Context, Next } from "hono";
import * as bookmarkServices from "../services";
import { z } from "zod";
import { success } from "../utils/okHandler";
import { handleError } from "../utils/errHandler";
import { NotFoundError, ValidationError } from "../utils/errExtensions";

const bookmarkSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const create = async (c: Context, next: Next) => {
  try {
    const userId = c.get("userId");
    const body = await c.req.json();
    const parsed = bookmarkSchema.safeParse(body);

    if (!parsed.success) return c.json({ error: parsed.error.format() }, 400);

    const bookmark = await bookmarkServices.createBookmark({
      userId: userId,
      title: parsed.data.title,
      url: parsed.data.url,
      categoryId: parsed.data.categoryId,
      tags: parsed.data.tags,
    });

    return success(c, bookmark);
  } catch (err) {
    return handleError(c, err);
  }
};

export const getMany = async (c: Context) => {
  const userId: string = c.get("userId");
  const bookmarks = await bookmarkServices.getBookmarks(userId);
  return success(c, bookmarks);
};

export const getOne = async (c: Context) => {
  try {
    const userId: string = c.get("userId");
    const { id } = c.req.param();

    const bookmark = await bookmarkServices.getBookmarkById(userId, id);
    if (!bookmark) throw new NotFoundError("Bookmark not found");

    return success(c, bookmark);
  } catch (err) {
    return handleError(c, err);
  }
};

export const updateOne = async (c: Context) => {
  try {
    const userId = c.get("userId");
    const { id } = c.req.param();
    const body = await c.req.json();
    const parsed = bookmarkSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.issues;
      throw new ValidationError("Validation Error", errors);
    }

    const bookmark = await bookmarkServices.updateBookmark(userId, id, body);

    return success(c, bookmark);
  } catch (err) {
    return handleError(c, err);
  }
};

export const deleteOne = async (c: Context) => {
  try {
    const userId = c.get("userId");
    const { id } = c.req.param();

    const deleted = await bookmarkServices.deleteBookmark(userId, id);
    if (!deleted.id) throw new NotFoundError("Bookmark not found");

    return success(c, "Bookmark deleted", 201);
  } catch (err) {
    return handleError(c, err);
  }
};
