import * as cdk from "aws-cdk-lib"
import { Construct } from "constructs"
import { S3StorageConstruct } from "@/infra/constructs/s3-storage"
import { CloudFrontCdnConstruct } from "@/infra/constructs/cloudfront-cdn"

export class CoreInfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // 1. Private S3 bucket
    const storage = new S3StorageConstruct(this, "StorageModule")

    // 2. CloudFront CDN in front of the bucket
    new CloudFrontCdnConstruct(this, "CdnModule", {
      originBucket: storage.bucket,
    })
  }
}
