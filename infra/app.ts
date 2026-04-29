import * as cdk from "aws-cdk-lib"
import { siteConfig } from "@/config/site"
import { CoreInfrastructureStack } from "@/infra/core-stack"

const app = new cdk.App()

// We use a dynamic suffix so your local dev stack doesn't clash with production later
const stage = process.env.NODE_ENV === "production" ? "prod" : "dev"

new CoreInfrastructureStack(
  app,
  `${siteConfig.brand.name.toLowerCase()}-infra-${stage}`,
  {
    /* If you don't specify 'env', this stack will be environment-agnostic.
     Account/Region-dependent features and context lookups will not work,
     but a single synthesized template can be deployed anywhere. */
    // env: { account: env.CDK_DEFAULT_ACCOUNT, region: env.CDK_DEFAULT_REGION },
  }
)
