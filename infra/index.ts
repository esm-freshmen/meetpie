import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const awsRegion = new pulumi.Config("aws").require("region");
const config = new pulumi.Config();

const TAGS = { Name: "meetpie", ManagedBy: "pulumi" };

const authSecret = config.requireSecret("authSecret");
const authGoogleId = config.requireSecret("authGoogleId");
const authGoogleSecret = config.requireSecret("authGoogleSecret");

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
        forwardedValues: {
            queryString: true,
            cookies: { forward: "all" },
            headers: [
                "Origin",
                "Access-Control-Request-Headers",
                "Access-Control-Request-Method",
            ],
        },
        compress: true,
        minTtl: 0,
        defaultTtl: 0,
        maxTtl: 0,
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
