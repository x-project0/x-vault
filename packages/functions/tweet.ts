import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import type { LambdaEvent, LambdaContext } from "hono/aws-lambda";
import { Tweet, connectToDatabase } from "./db";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "hono/logger";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { GenericRepository } from "./generic-repository.js";
import mongoose from "mongoose";

const tweetRepository = new GenericRepository(Tweet);


type Bindings = {
  event: LambdaEvent;
  context: LambdaContext;
};

const app = new Hono<{ Bindings: Bindings }>()
  .use(async (_, next) => {
    await connectToDatabase();
    await next();
  })
  .use(prettyJSON())
  .use(logger())
  .get("/tweet/v1", async (c) => {
    // sleep for 6 seconds
    // await sleep(6000);
    const {
      content,
      author_username,
      isThread,
      threadId,
      replyToTweetId,
      limit,
      page,
      sort,
    } = c.req.query();

    // We will use the query parameters to find the tweet in the database
    const tweets = await tweetRepository.getAll({
      isThread,
      threadId,
      replyToTweetId,
      content,
      author_username,
      limit,
      page,
      sort,
    });

    if (!tweets) {
      return c.json({ 
        data: null,
        error: "Tweets not found"
       });
    }

    return c.json({ 
      data: tweets,
      error: null
     });
  })
  .post(
    "/tweet/v1",
    zValidator(
      "json",
      z.object({
        content: z.string(),
        author_username: z.string(),
        isThread: z.boolean().optional().default(false),
        threadId: z
          .string()
          .optional()
          .refine((val) => {
            return val === undefined || mongoose.Types.ObjectId.isValid(val);
          }, "Invalid  threadId"),
        tweetId: z.string(),
        replyToTweetId: z.string().optional(),
      })
    ),
    async (c) => {
      const data = c.req.valid("json");
      try {
        const tweet = await tweetRepository.createOne({
          author_username: data.author_username,
          content: data.content,
          isThread: data.isThread,
          threadId: data.threadId as unknown as mongoose.Types.ObjectId,
          replyToTweetId: data.replyToTweetId,
          createdAt: new Date(),
          tweetId: data.content,
        });
        return c.json({ 
          data: tweet,
          error: null
         });
      } catch (error) {
        return c.json({ 
          data: null,
          error: error
         });
      }
    }
  )
  .get("/tweet/v1/:id", async (c) => {
    const id = c.req.param("id") as string;

    // We first try to find the tweet by _id, which is the mondo _id field that we set when we created the tweet
    let tweet = await tweetRepository.findOne({ _id: id });

    // If not found by _id, try to find it by the tweetId
    if (!tweet) {
      tweet = await tweetRepository.findOne({ tweetId: id });
    }

    if (!tweet) {
      return c.json({ error: "Tweet not found" });
    }

    return c.json(tweet);
  });

export const handler = handle(app);

export type AppType = typeof app;

export default app;
