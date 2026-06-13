# Infra

## 前提

- Pulumi がインストールされていること
  - されていない場合は `asdf install`
- AWS 認証が設定されていること

## インフラ構築

⚠️ `Pulumi.prod.yaml` が存在する場合は実施不要。[ローカルセットアップ](#ローカルセットアップ)へ進んでください

### 1. S3・KMS を作成（AWS CLI）

```sh
# S3 バケット
aws s3 mb s3://meetpie-pulumi-state --region ap-northeast-1
aws s3api put-bucket-versioning \
  --bucket meetpie-pulumi-state \
  --versioning-configuration Status=Enabled

# KMS キー
KEY_ID=$(aws kms create-key --description "Pulumi meetpie secrets" \
  --query KeyMetadata.KeyId --output text)
aws kms create-alias --alias-name alias/pulumi-meetpie --target-key-id $KEY_ID
```

### 2. stack を初期化してデプロイ

```sh
cd infra
pnpm install
pnpm login
pnpm stack:init
pulumi config set --secret meetpie:authSecret <値>
pulumi config set --secret meetpie:authGoogleId <値>
pulumi config set --secret meetpie:authGoogleSecret <値>
pnpm deploy
# Pulumi.prod.yaml をコミット
```

## ローカルセットアップ

```sh
cd infra
pnpm install
pnpm login
```
