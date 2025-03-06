import { Hono } from "hono";
import * as AuthController from "../controllers/auth"

const authRouter = new Hono();

authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);

export default authRouter;
