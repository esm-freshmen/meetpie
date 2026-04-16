# Meetpie

## 技術スタック

- [Next.js](https://nextjs.org/) 16 (App Router)
- [Auth.js](https://authjs.dev/) v5 (next-auth@beta)
- [Tailwind CSS](https://tailwindcss.com/) v4 + [daisyUI](https://daisyui.com/)
- [Valibot](https://valibot.dev/) + [Conform](https://conform.guide/)
- pnpm

## セットアップ

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. 環境変数の設定

`.env.local` を作成して以下の値を設定する。

```bash
cp .env.test .env.local
```

| 変数名 | 説明 |
|---|---|
| `AUTH_SECRET` | セッション暗号化用シークレット（`npx auth secret` で生成） |
| `AUTH_GOOGLE_ID` | Google OAuth クライアント ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth クライアントシークレット |

### 3. Google OAuth クライアントの作成

1. [Google Cloud Console](https://console.cloud.google.com/) を開く
2. 「APIとサービス」→「認証情報」→「認証情報を作成」→「OAuth 2.0 クライアント ID」
3. アプリケーションの種類：**ウェブアプリケーション**
4. 承認済みリダイレクト URI に以下を追加:
   - 開発環境: `http://localhost:3000/api/auth/callback/google`
   - 本番環境: `https://<本番ドメイン>/api/auth/callback/google`
5. 発行されたクライアント ID・シークレットを `.env.local` に記入

### 4. 開発サーバーの起動

```bash
pnpm dev
```

## コマンド

```bash
pnpm dev      # 開発サーバー起動
pnpm build    # ビルド
pnpm start    # 本番サーバー起動
pnpm fmt      # フォーマットチェック
pnpm fmt:w    # フォーマット適用
pnpm lint     # lint チェック
pnpm lint:w   # lint 自動修正
pnpm check    # fmt + lint チェック
```

## 認証の使い方

### サーバーコンポーネント

```ts
import { auth } from "@/auth";

const session = await auth();
// session?.user?.name, session?.user?.email
```

### クライアントコンポーネント

```ts
import { useSession } from "next-auth/react";

const { data: session } = useSession();
```

### サインイン / サインアウト（Server Actions）

```tsx
import { signIn, signOut } from "@/auth";

// サインイン
<form action={async () => { "use server"; await signIn("google"); }}>
  <button>Google でログイン</button>
</form>

// サインアウト
<form action={async () => { "use server"; await signOut(); }}>
  <button>ログアウト</button>
</form>
```
