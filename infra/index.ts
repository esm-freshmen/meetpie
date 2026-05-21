import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

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

// Lambda function
const lambdaFn = new aws.lambda.Function("meetpie-lambda", {
    runtime: aws.lambda.Runtime.NodeJS22dX,
    role: lambdaRole.arn,
    handler: "index.handler",
    code: new pulumi.asset.AssetArchive({
        "index.mjs": new pulumi.asset.StringAsset(`
export const handler = async (event) => {
    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Hello from meetpie Lambda!" }),
    };
};
        `.trim()),
    }),
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
