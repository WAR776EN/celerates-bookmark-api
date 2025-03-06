import { Context } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";

export const success = (
  c: Context,
  payload: Record<string, any> | string | null,
  httpCode: ContentfulStatusCode = 200,
) => {
  return c.json(
    {
      message: "Success",
      data: payload,
    },
    httpCode,
  );
};
