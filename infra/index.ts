import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const awsRegion = new pulumi.Config("aws").require("region");
const config = new pulumi.Config();
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
});

// Function URL (no auth for public access)
const functionUrl = new aws.lambda.FunctionUrl("meetpie-lambda-url", {
    functionName: lambdaFn.name,
    authorizationType: "NONE",
    cors: {
        allowCredentials: false,
        allowOrigins: ["*"],
        allowMethods: ["*"],
        allowHeaders: ["*"],
    },
});

export const lambdaFunctionUrl = functionUrl.functionUrl;
