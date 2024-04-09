
import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import type { LambdaEvent, LambdaContext } from "hono/aws-lambda";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "hono/logger";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

type Bindings = {
  event: LambdaEvent;
  context: LambdaContext;
};


const app = new Hono<{ Bindings: Bindings }>()
  .use(prettyJSON())
  .use(logger())
  .get("/book/v1", async (c) => {
    return c.json({ hello: "worlddd" });
  })
  .post(
    "/book/v1",
    zValidator(
      "json",
      z.object({
        name: z.string(),
        description: z.string(),
      })
    ),
    async (c) => {
      const data = c.req.valid("json");
      return c.json({ name: data.name, description: data.description });
    }
  )
  .get("/book/v1/:id", async (c) => {
    const id = c.req.param("id") as string;

    return c.json({ error: "Book not found" });
  });

export default app;

export const handler = handle(app);
