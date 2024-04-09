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
    const MONGODB_PASSWORD = new sst.Secret("XMongoDBPassword");
    const MONGODB_USERNAME = new sst.Secret("XMongoDBUsername");
    const MONGODB_DATABASE = new sst.Secret("XMongoDBDatabase");
    const MONGODB_HOST = new sst.Secret("XMongoDBHost");
    
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
      link: [MONGODB_PASSWORD, MONGODB_USERNAME, MONGODB_DATABASE, MONGODB_HOST],
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
