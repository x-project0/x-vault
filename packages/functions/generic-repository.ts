import mongoose, { FilterQuery, UpdateQuery } from "mongoose";
import { z } from "zod";

const querySchema = z.record(z.string(), z.union([z.string(), z.number()]));

type QueryParams = Record<string, string | number>;

function createAggregatePagination(
  queryParams: QueryParams
): mongoose.PipelineStage[] {
  const pipeline: mongoose.PipelineStage[] = [];

  // Filter
  const queryObj = { ...queryParams };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);
  // Delete empty strings and undefined
  Object.keys(queryObj).forEach((key) => {
    if (queryObj[key] === "" || queryObj[key] === undefined) {
      delete queryObj[key];
    }
  });
  console.log({ queryObj });
  const parsedQueryObj = querySchema.safeParse(queryObj);
  if (!parsedQueryObj.success) {
    // @ts-ignore
    console.log(parsedQueryObj.error);
  }
  if (parsedQueryObj.success) {
    console.log("Success");
    const queryObjParsed: Record<string, any> = {};

    for (const key in parsedQueryObj.data) {
      if (
        parsedQueryObj.data[key] !== undefined &&
        parsedQueryObj.data[key] !== null
      ) {
        const value = parsedQueryObj.data[key];
        if (typeof value === "string") {
          if (
            value.startsWith("$gte:") ||
            value.startsWith("$gt:") ||
            value.startsWith("$eq:") ||
            value.startsWith("$lte:") ||
            value.startsWith("$in:") ||
            value.startsWith("$lt:") ||
            value.startsWith("$like:")
          ) {
            const [operator, actualValue] = value.split(":");
            const cleanupOperator = operator.replace("$", "");
            if (cleanupOperator === "like") {
              queryObjParsed[key] = { $regex: new RegExp(actualValue, "i") };
            } else {
              queryObjParsed[key] = { [`$${cleanupOperator}`]: actualValue };
            }
          } else {
            // queryObjParsed[key] = {
            //   $regex: new RegExp(value, "i"),
            // };
            queryObjParsed[key] = value;
          }
        } else if (typeof value === "number") {
          queryObjParsed[key] = value;
        }
      }
    }

    for (const key in queryObjParsed) {
      if (queryObjParsed.hasOwnProperty(key)) {
        const value = queryObjParsed[key];
        if (
          typeof value === "object" &&
          value.hasOwnProperty("$in") &&
          typeof value.$in === "string"
        ) {
          queryObjParsed[key].$in = value.$in.split(",");
        }
      }
    }

    pipeline.push({ $match: queryObjParsed });
  }

  // Sort
  if (queryParams.sort) {
    const sortBy = String(queryParams.sort).split(",");
    pipeline.push({
      $sort: sortBy.reduce((acc, cur) => ({ ...acc, [cur]: 1 }), {}),
    });
  } else {
    pipeline.push({ $sort: { createdAt: -1 } });
  }

  // Limit fields
  if (queryParams.fields) {
    const fields: Record<string, number> = {};
    String(queryParams.fields)
      .split(",")
      .forEach((el) => (fields[el] = 1));
    pipeline.push({ $project: fields });
  }

  // Paginate
  const page =
    typeof queryParams.page === "string" ? Number(queryParams.page) : 1;
  const limit =
    typeof queryParams.limit === "string" ? Number(queryParams.limit) : 100;
  const skip = (page - 1) * limit;

  pipeline.push({
    $facet: {
      total: [{ $count: "count" }],
      docs: [{ $skip: skip }, { $limit: limit }],
    },
  });

  return pipeline;
}

export class GenericRepository<T> {
  constructor(private model: mongoose.Model<T>) {}

  async findOne(queryParams: Record<string, any>): Promise<T | null> {
    const query: FilterQuery<T> = {};
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        query[key as keyof T] = value;
      }
    }

    return await this.model.findOne(query);
  }

  async findOneById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async findOneBy(queryParams: Record<string, any>): Promise<T | null> {
    const query: FilterQuery<T> = {};
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        query[key as keyof T] = value;
      }
    }
    return await this.model.findOne(query);
  }

  async createOne(data: T){
    return await this.model.create(data);
  }

  async create(data: T) {
    return await this.model.create(data);
  }

  async updateOne(id: string, data: UpdateQuery<T>) {
    return await this.model.findByIdAndUpdate(id, data);
  }

  async getAll(
    queryParams: Record<string, any>
  ): Promise<{ total: number; docs: T[] }> {
    const aggregations = createAggregatePagination(queryParams);

    const result = (await this.model.aggregate<T>(
      aggregations
    )) as unknown as Array<{
      total: Array<{
        count: number;
      }>;
      docs: T[];
    }>;
    const total = result[0]?.total?.[0]?.count || 0;
    const docs = result[0].docs;
    return { total, docs };
  }
}

const test = {
  data: {
    docs: [
      {
        total: [
          {
            count: 8,
          },
        ],
        docs: [
          {
            _id: "6611a45d8addc40d2b6adf7e",
            tweetId: "byebye",
            content: "byebye",
            author_username: "@log1500",
            isThread: false,
            threadId: null,
            replyToTweetId: null,
            createdAt: "2024-04-06T19:37:01.589Z",
            __v: 0,
          },
          {
            _id: "6610feff8501542aa7e747ec",
            tweetId: "byebye",
            content: "byebye",
            author_username: "@log1500",
            isThread: false,
            threadId: null,
            replyToTweetId: null,
            createdAt: "2024-04-06T07:51:27.563Z",
            __v: 0,
          },
          {
            _id: "6610fef68501542aa7e747ea",
            tweetId: "byebye",
            content: "byebye",
            author_username: "@1500",
            isThread: false,
            threadId: null,
            replyToTweetId: null,
            createdAt: "2024-04-06T07:51:18.280Z",
            __v: 0,
          },
          {
            _id: "6610feeb8501542aa7e747e8",
            tweetId: "hola mundo2",
            content: "hola mundo2",
            author_username: "@log1400",
            isThread: false,
            threadId: null,
            replyToTweetId: null,
            createdAt: "2024-04-06T07:51:07.894Z",
            __v: 0,
          },
          {
            _id: "6610f14364717a363d458822",
            tweetId: "hola mundo",
            content: "hola mundo",
            author_username: "@log1400",
            isThread: false,
            threadId: null,
            replyToTweetId: null,
            createdAt: "2024-04-06T06:52:51.996Z",
            __v: 0,
          },
          {
            _id: "6610f12a5da2154dea643ddd",
            tweetId: "hola mundo",
            content: "hola mundo",
            author_username: "@log1400",
            isThread: false,
            threadId: null,
            replyToTweetId: null,
            createdAt: "2024-04-06T06:52:26.902Z",
            __v: 0,
          },
          {
            _id: "6610f1175da2154dea643ddb",
            tweetId: "hola mundo",
            content: "hola mundo",
            author_username: "@log1400",
            isThread: false,
            threadId: null,
            replyToTweetId: null,
            createdAt: "2024-04-06T06:52:07.674Z",
            __v: 0,
          },
          {
            _id: "6610deb1d3f934f50c1596c8",
            tweetId: "hola mundo",
            content: "hola mundo",
            author: "@log1400",
            authorUserId: "2",
            isThread: false,
            threadId: null,
            replyToTweetId: null,
            createdAt: "2024-04-06T05:33:37.235Z",
            __v: 0,
          },
        ],
      },
    ],
    total: 1,
  },
  error: null,
};
