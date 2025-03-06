import { Hono } from "hono";
import * as BookmarkController from "../controllers/bookmark";
import { validatePayload } from "../middlewares/validations/bookmark";
import { isLoggedIn } from "../controllers/auth";
const bookmarkRouter = new Hono();

// Validate user's token within this route
bookmarkRouter.use("*", isLoggedIn);

// Create a Bookmark
bookmarkRouter.post("/", validatePayload, BookmarkController.create);

// // Get All Bookmarks
bookmarkRouter.get("/", BookmarkController.getMany);

// // Get Single Bookmark
bookmarkRouter.get("/:id", BookmarkController.getOne);

// // Update Bookmark
bookmarkRouter.put("/:id", validatePayload, BookmarkController.updateOne);

// // Delete Bookmark
bookmarkRouter.delete("/:id", BookmarkController.deleteOne);

export default bookmarkRouter;
