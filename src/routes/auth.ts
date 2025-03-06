import { Hono } from "hono";
import * as AuthController from "../controllers/auth";
import { validatePayload } from "../middlewares/validations/auth";
const authRouter = new Hono();

authRouter.post("/register", validatePayload, AuthController.register);
authRouter.post("/login", validatePayload, AuthController.login);

export default authRouter;
