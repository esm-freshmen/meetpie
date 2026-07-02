#!/bin/bash
set -euo pipefail

# Server Actions の allowedOrigins を next.config.ts でビルド時に固定するため、
# AUTH_URL が無ければ pulumi config から取得して export する。
if [ -z "${AUTH_URL:-}" ]; then
    AUTH_URL=$(cd infra && pulumi config get authUrl 2>/dev/null || true)
    export AUTH_URL
fi

if [ -z "${AUTH_URL:-}" ]; then
    echo "Warning: AUTH_URL is not set. CloudFront 経由の Server Actions が CSRF チェックで弾かれる可能性があります。"
else
    echo "Using AUTH_URL=${AUTH_URL}"
fi

echo "Building Next.js..."
pnpm build

echo "Preparing Lambda package in .lambda/ ..."

rm -rf .lambda
cp -r .next/standalone .lambda

mkdir -p .lambda/.next
cp -r .next/static .lambda/.next/static
cp -r public .lambda/public
cp run.sh .lambda/run.sh
chmod +x .lambda/run.sh

echo "Done. Run 'pnpm --filter infra deploy' to deploy."
