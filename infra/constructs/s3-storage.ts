import * as cdk from "aws-cdk-lib"
import * as s3 from "aws-cdk-lib/aws-s3"
import * as iam from "aws-cdk-lib/aws-iam"
import { Construct } from "constructs"
import { siteConfig } from "@/config/site"

export class S3StorageConstruct extends Construct {
  // Expose the bucket so other modules can use it
  public readonly bucket: s3.Bucket

  constructor(scope: Construct, id: string) {
    super(scope, id)

    const stage =
      cdk.Stack.of(this).stackName.split("-").pop()?.toLowerCase() ?? "dev"

    // 1. The Bucket
    this.bucket = new s3.Bucket(this, "UserUploadsBucket", {
      bucketName: `${siteConfig.brand.name.toLowerCase()}-${cdk.Stack.of(this).account}-${stage}-uploads`,
      publicReadAccess: true,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      }),
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    })

    // 2. The Restricted IAM User
    const appUser = new iam.User(this, "AppS3WorkerUser")
    this.bucket.grantReadWrite(appUser)

    // 3. Create Access Keys
    const accessKey = new iam.AccessKey(this, "AppWorkerAccessKey", {
      user: appUser,
    })

    // 4. Outputs tied to this specific construct
    new cdk.CfnOutput(this, "S3BucketName", {
      value: this.bucket.bucketName,
    })
    new cdk.CfnOutput(this, "AppAccessKeyId", {
      value: accessKey.accessKeyId,
    })
    new cdk.CfnOutput(this, "AppSecretAccessKey", {
      value: accessKey.secretAccessKey.unsafeUnwrap(),
    })
  }
}
