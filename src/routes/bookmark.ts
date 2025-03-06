import { Hono } from "hono";
import * as BookmarkController from "../controllers/bookmark";
import { isLoggedIn } from "../controllers";
const bookmarkRouter = new Hono();

// Validate user's token within this route
bookmarkRouter.use("*", isLoggedIn);

// Create a Bookmark
bookmarkRouter.post("/", BookmarkController.create);

// // Get All Bookmarks
bookmarkRouter.get("/", BookmarkController.getMany);

// // Get Single Bookmark
bookmarkRouter.get("/:id", BookmarkController.getOne);

// // Update Bookmark
bookmarkRouter.put("/:id", BookmarkController.updateOne);

// // Delete Bookmark
bookmarkRouter.delete("/:id", BookmarkController.deleteOne);

export default bookmarkRouter;
