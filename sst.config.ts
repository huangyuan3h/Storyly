import { NextjsSite } from "sst/constructs";

export default {
  config(_input: any) {
    return {
      name: "storyly",
      region: "us-east-1",
    };
  },
  stacks(app: any) {
    app.stack(function Site({ stack }: any) {
      const site = new NextjsSite(stack, "site");

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
};