import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import authRoutes from "./routes/auth";
import bookmarkRoutes from "./routes/bookmark";
import { handleError } from "./utils/errHandler";
import categoryRouter from "./routes/category";

// const app = new Hono();
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
const app = new OpenAPIHono();
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
});
app.get("/docs", swaggerUI({ url: "/doc" }));

app.use("*", logger());
app.use("*", cors());

app.route("/auth", authRoutes);
app.route("/bookmark", bookmarkRoutes);
app.route("/category", categoryRouter);

app.get("/", (c) => c.text("hello bobsam"));

export default app;
