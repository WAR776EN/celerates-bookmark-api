import { Hono } from "hono";
import * as controller from "../controllers/category";
import { z } from "zod";
import { isLoggedIn } from "../controllers";

const categoryRouter = new Hono();

// Validate user's token within this route
categoryRouter.use("*", isLoggedIn);

// Create Category
categoryRouter.post("/", controller.create);

// Get Many Categories
categoryRouter.get("/", controller.getMany);

// Get One Categories
categoryRouter.get("/:id", controller.getOne);

// Update Category
categoryRouter.put("/:id", controller.updateOne);

// Delete Category
categoryRouter.delete("/:id", controller.deleteOne);

export default categoryRouter;
