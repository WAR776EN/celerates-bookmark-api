import { Context } from "hono";
import { PrismaClient, Prisma } from "@prisma/client";
import { handleError } from "../utils/errHandler";
import { success } from "../utils/okHandler";

const prisma = new PrismaClient();

// attempt to leverage PG's fulltext search
export const searchBookmarks = async (c: Context) => {
  const query = c.req.query("q"); // Get search query

  if (!query) {
    return c.json({ error: "Search query is required" }, 400);
  }

  try {
    const searchQuery = Prisma.sql`
      SELECT * FROM bookmark
      WHERE
          to_tsvector('english', title || ' ' || url || ' ' || array_to_string(tags, ' ')) 
          @@ to_tsquery('english', ${query});
    `;
    // [query.replace(/\s+/g, " & ")], // Convert spaces to '&' for full-text search

    const result = await prisma.$queryRaw<any[]>(searchQuery);

    return success(c, "oks");
  } catch (err) {
    return handleError(c, err);
  }
};
