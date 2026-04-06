import * as cdk from "aws-cdk-lib";
import * as amplify from "@aws-cdk/aws-amplify-alpha";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import { Construct } from "constructs";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const amplifyApp = new amplify.App(this, "MeetpieApp", {
      appName: "meetpie",
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: "HarutoTakeuchi",
        repository: "meetpie",
        // GitHub Personal Access Token を Secrets Manager に保存しておく
        // aws secretsmanager create-secret --name github-token --secret-string "ghp_xxx"
        oauthToken: cdk.SecretValue.secretsManager("github-token"),
      }),
      buildSpec: codebuild.BuildSpec.fromObjectToYaml({
        version: "1.0",
        frontend: {
          phases: {
            preBuild: {
              commands: ["corepack enable pnpm", "pnpm install --frozen-lockfile"],
            },
            build: {
              commands: ["pnpm run build"],
            },
          },
          artifacts: {
            baseDirectory: ".next",
            files: ["**/*"],
          },
          cache: {
            paths: [".next/cache/**/*", "node_modules/**/*"],
          },
        },
      }),
      // Auth.js の環境変数は後で追加
      environmentVariables: {
        NEXT_PUBLIC_APP_URL: `https://main.REPLACE_WITH_AMPLIFY_DOMAIN`,
      },
    });

    amplifyApp.addBranch("main", {
      autoBuild: true,
      stage: "PRODUCTION",
    });

    new cdk.CfnOutput(this, "AmplifyAppId", {
      value: amplifyApp.appId,
    });

    new cdk.CfnOutput(this, "AmplifyDefaultDomain", {
      value: `https://main.${amplifyApp.defaultDomain}`,
    });
  }
}
