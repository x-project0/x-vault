/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "x-vault",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {

    const bucket = new sst.aws.Bucket("XVaultBucketWeb", {
      public: true,
      
    });

    new sst.aws.Nextjs("XVaultWeb", {
      path: "./packages/web",
      link:[bucket]
    });


    
  },
});
