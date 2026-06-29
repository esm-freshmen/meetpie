import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const awsRegion = new pulumi.Config("aws").require("region");
const config = new pulumi.Config();

const TAGS = { Name: "meetpie", ManagedBy: "pulumi" };

const authSecret = config.requireSecret("authSecret");
const authGoogleId = config.requireSecret("authGoogleId");
const authGoogleSecret = config.requireSecret("authGoogleSecret");
const authUrl = config.require("authUrl");

// Lambda@Edge は us-east-1 にデプロイする必要がある
const usEast1 = new aws.Provider("us-east-1", { region: "us-east-1" });

// IAM role for Lambda
const lambdaRole = new aws.iam.Role("meetpie-lambda-role", {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
        Service: "lambda.amazonaws.com",
    }),
});

new aws.iam.RolePolicyAttachment("meetpie-lambda-basic-execution", {
    role: lambdaRole.name,
    policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
});

// IAM role for Lambda@Edge — lambda と edgelambda 両方の service principal から AssumeRole 可能
const edgeLambdaRole = new aws.iam.Role("meetpie-edge-lambda-role", {
    assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Action: "sts:AssumeRole",
                Effect: "Allow",
                Principal: {
                    Service: ["lambda.amazonaws.com", "edgelambda.amazonaws.com"],
                },
            },
        ],
    }),
});

new aws.iam.RolePolicyAttachment("meetpie-edge-lambda-basic-execution", {
    role: edgeLambdaRole.name,
    policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
});

// Lambda@Edge — Viewer Request で POST/PUT/PATCH のボディ SHA256 を計算して
// x-amz-content-sha256 ヘッダに設定する。CloudFront OAC は SigV4 署名時に
// このヘッダの値を使うため、Lambda Function URL 側で署名が一致するようになる。
// これが無いと OAuth signin の POST が "signature mismatch" で失敗する。
const signPayloadFn = new aws.lambda.Function("meetpie-edge-sign-payload", {
    name: "meetpie-edge-sign-payload",
    runtime: aws.lambda.Runtime.NodeJS22dX,
    role: edgeLambdaRole.arn,
    handler: "index.handler",
    code: new pulumi.asset.FileArchive("./lambda-edge/sign-payload"),
    publish: true,
    timeout: 5,
    memorySize: 128,
    tags: TAGS,
}, { provider: usEast1 });

// Lambda Web Adapter layer (x86_64)
// https://github.com/aws/aws-lambda-web-adapter
const lambdaWebAdapterLayerArn = `arn:aws:lambda:${awsRegion}:753240598075:layer:LambdaAdapterLayerX86:28`;

// Lambda function — Next.js standalone served via Lambda Web Adapter
// Build the package first: pnpm build:lambda
const lambdaFn = new aws.lambda.Function("meetpie-lambda", {
    name: "meetpie-lambda",
    runtime: aws.lambda.Runtime.NodeJS22dX,
    role: lambdaRole.arn,
    handler: "run.sh",
    code: new pulumi.asset.FileArchive("../.lambda"),
    layers: [lambdaWebAdapterLayerArn],
    environment: {
        variables: {
            AWS_LAMBDA_EXEC_WRAPPER: "/opt/bootstrap",
            AWS_LWA_ENABLE_COMPRESSION: "true",
            PORT: "8000",
            AUTH_URL: authUrl,
            AUTH_TRUST_HOST: "true",
            AUTH_SECRET: authSecret,
            AUTH_GOOGLE_ID: authGoogleId,
            AUTH_GOOGLE_SECRET: authGoogleSecret,
        },
    },
    memorySize: 512,
    timeout: 30,
    tags: TAGS,
});

// Function URL — AWS_IAM auth so only CloudFront OAC can invoke it directly
const functionUrl = new aws.lambda.FunctionUrl("meetpie-lambda-url", {
    functionName: lambdaFn.name,
    authorizationType: "AWS_IAM",
});

// OAC for Lambda Function URL
const oac = new aws.cloudfront.OriginAccessControl("meetpie-oac", {
    name: "meetpie-lambda-oac",
    originAccessControlOriginType: "lambda",
    signingBehavior: "always",
    signingProtocol: "sigv4",
});

// Extract hostname from Function URL (strip https:// and trailing /)
const lambdaOriginDomain = functionUrl.functionUrl.apply(url =>
    url.replace("https://", "").replace(/\/$/, ""),
);

// CloudFront distribution — Lambda as origin via OAC
const distribution = new aws.cloudfront.Distribution("meetpie-cf", {
    enabled: true,
    origins: [{
        originId: "lambda",
        domainName: lambdaOriginDomain,
        originAccessControlId: oac.id,
        customOriginConfig: {
            httpPort: 80,
            httpsPort: 443,
            originProtocolPolicy: "https-only",
            originSslProtocols: ["TLSv1.2"],
        },
    }],
    defaultCacheBehavior: {
        targetOriginId: "lambda",
        viewerProtocolPolicy: "redirect-to-https",
        allowedMethods: ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"],
        cachedMethods: ["GET", "HEAD"],
        // CachingDisabled: TTL=0、キャッシュなし
        cachePolicyId: "4135ea2d-6df8-44a3-9df3-4b5a84be39ad",
        // AllViewerExceptHostHeader: cookie・クエリ・ヘッダーをすべて転送（Host除く）
        originRequestPolicyId: "b689b0a8-53d0-40ab-baf2-68738e2966ac",
        compress: true,
        // Viewer Request で POST/PUT/PATCH のボディ SHA256 を x-amz-content-sha256 に設定
        // （OAC が Lambda Function URL に SigV4 署名する際の整合性のため）
        lambdaFunctionAssociations: [
            {
                eventType: "viewer-request",
                lambdaArn: signPayloadFn.qualifiedArn,
                includeBody: true,
            },
        ],
    },
    restrictions: {
        geoRestriction: { restrictionType: "none" },
    },
    viewerCertificate: {
        cloudfrontDefaultCertificate: true,
    },
    tags: TAGS,
});

// Grant CloudFront permission to invoke the Lambda Function URL via OAC
new aws.lambda.Permission("meetpie-lambda-cf-permission", {
    action: "lambda:InvokeFunctionUrl",
    function: lambdaFn.name,
    principal: "cloudfront.amazonaws.com",
    sourceArn: distribution.arn,
    functionUrlAuthType: "AWS_IAM",
});

export const cloudFrontUrl = pulumi.interpolate`https://${distribution.domainName}`;
export const lambdaFunctionUrl = functionUrl.functionUrl;
