import * as cloudfront from "aws-cdk-lib/aws-cloudfront"
import * as origins from "aws-cdk-lib/aws-cloudfront-origins"
import * as cdk from "aws-cdk-lib"
import * as s3 from "aws-cdk-lib/aws-s3"
import { Construct } from "constructs"

export interface CloudFrontCdnProps {
  originBucket: s3.Bucket
}

export class CloudFrontCdnConstruct extends Construct {
  public readonly distributionDomainName: string

  constructor(scope: Construct, id: string, props: CloudFrontCdnProps) {
    super(scope, id)

    // 1. Origin Access Control — AWS's current recommended way to
    //    securely connect CloudFront to a private S3 bucket
    const oac = new cloudfront.S3OriginAccessControl(this, "OAC", {
      signing: cloudfront.Signing.SIGV4_NO_OVERRIDE,
    })

    // 2. CloudFront distribution
    const distribution = new cloudfront.Distribution(this, "AvatarsCDN", {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(
          props.originBucket,
          { originAccessControl: oac }
        ),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
      },
    })

    this.distributionDomainName = distribution.distributionDomainName

    // 3. Output the CDN URL
    new cdk.CfnOutput(this, "CloudFrontDomainName", {
      value: distribution.distributionDomainName,
    })

    new cdk.CfnOutput(this, "CloudFrontUrl", {
      value: `https://${distribution.distributionDomainName}`,
    })
  }
}
