#!/bin/bash
set -euo pipefail

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
