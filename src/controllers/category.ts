import { Context } from "hono";
import * as categoryServices from "../services/category.service";
import * as bookmarkServices from "../services/bookmark.service";
import { handleError } from "../utils/errHandler";
import { success } from "../utils/okHandler";
import { NotFoundError } from "../utils/errExtensions";
import * as reqValidation from "../interfaces/validations/category";

// Create Category
export const create = async (c: Context) => {
  try {
    const userId = c.get("userId");
    const body = await c.req.json();
    const parsed = reqValidation.createCategory.safeParse(body);

    if (!parsed.success) return c.json({ error: parsed.error.format() }, 400);

    const category = await categoryServices.create(userId, parsed.data.name);

    // update bookmark, set its categoryId to category.id
    if (parsed.data.bookmarkIds) {
      await bookmarkServices.updateMany(userId, parsed.data.bookmarkIds, {
        categoryId: category.id,
      });
    }

    return success(c, category);
  } catch (err) {
    return handleError(c, err);
  }
};

// Get All Categories
export const getMany = async (c: Context) => {
  try {
    const userId = c.get("userId");
    const categories = await categoryServices.getMany(userId);
    return success(c, categories);
  } catch (err) {
    return handleError(c, err);
  }
};

// Get One Categories
export const getOne = async (c: Context) => {
  try {
    const userId = c.get("userId");
    const { id } = c.req.param();
    const category = await categoryServices.getOne(userId, id);
    if (!category) throw new NotFoundError("Category not found!");

    return success(c, category);
  } catch (err) {
    return handleError(c, err);
  }
};

// Update Category
export const updateOne = async (c: Context) => {
  try {
    const userId = c.get("userId");
    const { id } = c.req.param();
    const body = await c.req.json();

    const { data, success: isValidated, error } = reqValidation.updateCategory.safeParse(body);
    if (!isValidated) return c.json({ error: error.format() }, 400);

    const _ = await categoryServices.updateOne(userId, id, data.name);
    if (!_.id) throw new NotFoundError("Category not found");

    // update bookmark, set its categoryId to category.id
    if (data.bookmarkIds?.length) {
      await bookmarkServices.updateMany(userId, data.bookmarkIds, {
        categoryId: id,
      });
    }

    return success(c, "Category updated");
  } catch (err) {
    return handleError(c, err);
  }
};

// Delete Category
export const deleteOne = async (c: Context) => {
  try {
    const userId = c.get("userId");
    const { id } = c.req.param();

    const deleted = await categoryServices.deleteOne(userId, id);
    if (!deleted.id) return c.json({ error: "Category not found" }, 404);

    return success(c, "Category deleted");
  } catch (err) {
    return handleError(c, err);
  }
};

export const insertBookmark = async (c: Context) => {
  try {
  } catch (err) {
    handleError(c, err);
  }
};
