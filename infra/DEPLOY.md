# デプロイ手順

## 前提

- AWS CLI が設定済みであること
- pnpm がインストール済みであること

## 手順

### 1. GitHub Personal Access Token を発行

- GitHub → Settings → Developer settings → Personal access tokens (classic)
- スコープ: `repo` にチェック

### 2. Secrets Manager に保存

```bash
aws secretsmanager create-secret \
  --name github-token \
  --secret-string "ghp_xxxxxxxxxxxx"
```

### 3. CDK deploy

```bash
# 初回のみ
pnpm --filter infra exec cdk bootstrap

pnpm --filter infra exec cdk deploy
```

### 4. 動作確認

- デプロイ後に出力される `AmplifyDefaultDomain` にアクセスして表示確認
- `main` にpushして自動デプロイが走るか確認
