import { createHash } from "node:crypto";

// CloudFront OAC が Lambda Function URL (AWS_IAM) に SigV4 で署名する際、
// POST/PUT/PATCH のリクエストボディのハッシュ値を x-amz-content-sha256 ヘッダに含める必要がある。
// ブラウザはこのヘッダを送らないため、Viewer Request 段階で Lambda@Edge が計算して付与する。
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-lambda.html
export const handler = async (event) => {
  const request = event.Records[0].cf.request;

  if (!["POST", "PUT", "PATCH"].includes(request.method)) {
    return request;
  }

  let body = Buffer.alloc(0);
  if (request.body?.data) {
    body =
      request.body.encoding === "base64"
        ? Buffer.from(request.body.data, "base64")
        : Buffer.from(request.body.data, "utf8");
  }

  const hash = createHash("sha256").update(body).digest("hex");

  request.headers["x-amz-content-sha256"] = [
    { key: "x-amz-content-sha256", value: hash },
  ];

  return request;
};
