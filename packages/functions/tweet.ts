import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import type { LambdaEvent, LambdaContext } from "hono/aws-lambda";
import { Chunk, Tweet, connectToDatabase } from "./db";
import { prettyJSON } from "hono/pretty-json";
import { logger } from "hono/logger";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { GenericRepository } from "./generic-repository.js";
import mongoose from "mongoose";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { TogetherAIEmbeddings } from "@langchain/community/embeddings/togetherai";
import { Resource } from "sst";

function randomIdGenerator() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

function fixArrayPrecision(array: number[]) {
  return array.map((value) => {
    if (Number.isInteger(value)) {
      return value + 0.000000000000001;
    }
    return value;
  });
}

const embeddings = new TogetherAIEmbeddings({
  apiKey: Resource.TogetherAPIKey.value, // Default value
  model: "BAAI/bge-large-en-v1.5", // Default value
});

const tweetRepository = new GenericRepository(Tweet);
const chunkRepository = new GenericRepository(Chunk);

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
        error: "Tweets not found",
      });
    }

    return c.json({
      data: tweets,
      error: null,
    });
  })
  .get(
    "/tweet/v1/embeddings",
    zValidator(
      "query",
      z.object({
        search: z.string().min(1),
        // limit: z.number().optional().default(10),
        limit: z.number({
          coerce: true,
        }).default(10),
      })
    ),
    async (c) => {
      const { limit,search } = c.req.valid('query')
      console.log("Inside get");

      try {
        const removeEmbeddingsPipeline = [
          {
            $project: {
              embedding: 0,
            },
          },
        ];

        const query = await embeddings.embedQuery(search);

        const pipeline: mongoose.PipelineStage[] = [
          {
            $vectorSearch: {
              queryVector: fixArrayPrecision(query),
              index: "tweet_chunks_vector_index",
              path: "embedding",
              limit: Number(limit),
              numCandidates: 10 * Number(limit),
            },
          },
          {
            $set: {
              score: { $meta: "vectorSearchScore" },
            },
          },
          {
            $lookup: {
              from: "tweets",
              localField: "tweetId",
              foreignField: "_id",
              as: "tweet",
            },
          },
          {
            $unwind: "$tweet",
          },
          {
            $lookup: {
              from: "chunks",
              localField: "tweet._id",
              foreignField: "tweetId",
              as: "chunks",
            },
          },
          {
            $addFields: {
              "chunks.score": "$score",
            },
          },
          {
            $project: {
              "chunks.embedding": 0,
            },
          },
          ...removeEmbeddingsPipeline,
        ];

        // const results = (await Chunk.aggregate(pipeline)).map((result) => {
        //   const { score, ['content']: text, ...metadata } = result;
        //   return [result, score];
        // });
        const results = (await Chunk.aggregate(pipeline)) as unknown as Array<
          Chunk & {
            score: number;
            tweet: Tweet;
            chunks: Chunk[];
          }
        >;

        // const results = this.collection
        //   .aggregate(pipeline)
        //   .map<[Document, number]>((result) => {
        //     const { score, [this.textKey]: text, ...metadata } = result;
        //     return [new Document({ pageContent: text, metadata }), score];
        //   });

        // const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
        //   collection: Chunk.collection, // The name of the collection containing the documents
        //   indexName: "tweet_chunks_vector_index", // The name of the Atlas search index. Defaults to "default"
        //   textKey: "content", // The name of the collection field containing the raw content. Defaults to "text"
        //   embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
        // });

        // const resultOne = await vectorStore.similaritySearch(search, 10, {
        //   postFilterPipeline: [
        //     { $skip: Number(page) * Number(limit) },
        //     { $limit: Number(limit) },
        //   ],
        // });

        return c.json({
          data: results,
          error: null,
        });
      } catch (error) {
        return c.json({
          data: null,
          error: error,
        });
      }
    }
  )
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
      console.log("Inside post");
      const data = c.req.valid("json");

      try {
        const splitter = new CharacterTextSplitter({
          chunkSize: 500,
          chunkOverlap: 3,
        });
        const output = await splitter.createDocuments([data.content]);

        const res = await embeddings.embedDocuments(
          output.map((doc) => doc.pageContent)
        );

        const chunksToSave = res.map(
          (chunk, index) =>
            new Chunk({
              content: output[index].pageContent,
              embedding: chunk,
              metadata: {
                ...output[index].metadata,
              },
              tweetId: null, // Set tweetId to null initially
            })
        );

        const savedChunks = await Chunk.insertMany(chunksToSave);
        const chunkIds = savedChunks.map((chunk) => chunk._id);

        const tweet = await tweetRepository.createOne({
          author_username: data.author_username,
          isThread: data.isThread,
          threadId: data.threadId as unknown as mongoose.Types.ObjectId,
          replyToTweetId: data.replyToTweetId,
          createdAt: new Date(),
          tweetId: randomIdGenerator(),
          chunks: chunkIds,
        });

        // 3. Update chunks with tweetId reference
        await Chunk.updateMany(
          { _id: { $in: chunkIds } },
          { tweetId: tweet._id }
        );

        return c.json({
          data: tweet,
          error: null,
        });
      } catch (error) {
        return c.json({
          data: null,
          error: error,
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
