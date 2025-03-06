import { Hono } from "hono";
import * as controller from "../controllers/category";
import { isLoggedIn } from "../controllers/auth";
import { validatePayload } from "../middlewares/validations/category";
const categoryRouter = new Hono();

// Validate user's token within this route
categoryRouter.use("*", isLoggedIn);

// Create Category
categoryRouter.post("/", validatePayload, controller.create);

// Get Many Categories
categoryRouter.get("/", controller.getMany);

// Get One Categories
categoryRouter.get("/:id", controller.getOne);

// Update Category
categoryRouter.put("/:id", validatePayload, controller.updateOne);

// Delete Category
categoryRouter.delete("/:id", controller.deleteOne);

export default categoryRouter;
