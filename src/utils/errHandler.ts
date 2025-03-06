import { Context } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";

const getHttpCode = (errName: string): ContentfulStatusCode => {
  const map: Record<string, ContentfulStatusCode> = {
    ValidationError: 400,
    UnauthorizedError: 403,
    NotFoundError: 404,
    InternalServerError: 500,
  };

  return map[errName];
};

export const handleError = (c: Context, error: any) => {
  const message = error instanceof Error ? error.message : "An unexpected error occurred";
  return c.json({ message: "Failed", error: message }, getHttpCode(error.name));
};
