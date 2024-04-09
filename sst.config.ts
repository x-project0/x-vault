/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "x-vault",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "us-east-1",
        },
      },
    };
  },
  async run() {
    const bucket = new sst.aws.Bucket("XVaultBucketWeb", {
      public: true,
    });

    new sst.aws.Nextjs("XVaultWeb", {
      path: "./packages/web",
      link: [bucket],
    });


    const tweetHonoHandler = new sst.aws.Function("TweetHandler", {
      handler: "./packages/functions/tweet.handler",
      url: true,
      environment: {
        MONGODB_URI: process.env.MONGODB_URI,
        MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
        MONGODB_USERNAME: process.env.MONGODB_USERNAME,
      },
    });

    const bookHonoHandler = new sst.aws.Function("BookHandler", {
      handler: "./packages/functions/book.handler",
      url: true,
    });

    const router = new sst.aws.Router("HonoRouter", {
      routes: {
        "/tweet/v1/*": tweetHonoHandler.url,
        "/book/v1/*": bookHonoHandler.url,
      },
    });

    return {
      routerUrl: router.url,
      tweetHandlerUrl: tweetHonoHandler.url,
      bookHandlerUrl: bookHonoHandler.url,
    };
  },
});
