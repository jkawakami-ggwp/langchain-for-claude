# LangChain Claude プロジェクト

LangChain の `createAgent` 関数を使用して Claude と連携する TypeScript サンプルです。エージェントは LangChain のツール機能に対応しており、Claude 3.7 Sonnet をデフォルトモデルとして利用します。

## 主な特徴
- **LangChain Agent**: `createAgent` を使用したシンプルなエージェント構成
- **ツール対応**: Zod スキーマを使用した型安全なツール定義
- **TypeScript**: 完全な型安全性でサンプルを拡張可能
- **Docker対応**: Docker Compose による開発環境を提供

## 前提条件
- Node.js 18 以上
- pnpm（パッケージマネージャー）
- Docker & Docker Compose（Docker環境を使用する場合）

## セットアップ

```bash
git clone <repository-url>
cd langchain-claude-project

# 環境変数のセットアップ
cp env.example .env
```

`.env` に以下を設定してください。

```dotenv
# Anthropic設定
ANTHROPIC_API_KEY=your_api_key
CLAUDE_MODEL=claude-3-7-sonnet-20250219

# アプリケーション設定
NODE_ENV=development
```

**注意**: `ANTHROPIC_API_KEY` は必須です。Anthropic ダッシュボードで API キーを発行してください。

## 実行方法

### ローカル環境での実行

```bash
# 依存関係のインストール（初回のみ）
pnpm install

# TypeScriptのまま即実行
pnpm dev

# ビルド & 実行
pnpm build
pnpm start
```

### Docker環境での実行

```bash
# コンテナを起動
docker-compose up -d

# コンテナ内でコマンドを実行
docker-compose exec app pnpm run dev
```

コンソールには Claude からの応答が表示されます。`src/index.ts` の `message` やシステムプロンプト、利用するツールを編集することで挙動をカスタマイズできます。

## ツールの追加

`src/tools` 配下にツールを定義し、`src/tools/index.ts` の配列に追加するとエージェントが利用できるようになります。

### ツールの定義例

```typescript
import { tool } from 'langchain';
import { z } from 'zod';

// Zodスキーマでツールの入力を定義
const weatherSchema = z.object({
  city: z.string(),
});

type WeatherInput = z.infer<typeof weatherSchema>;

// ツールを作成
export const getWeatherTool = tool<typeof weatherSchema>(
  (input: WeatherInput) => {
    const city = input.city;
    return { content: `It's always sunny in ${city}!` };
  },
  {
    name: 'get_weather',
    description: 'Get the weather for a given city',
    schema: weatherSchema,
  }
);
```

## Docker環境での開発

このプロジェクトでは Docker Compose を使用した開発環境を提供しています。

### 基本的な使い方

```bash
# コンテナを起動
docker-compose up -d

# コンテナ内でコマンドを実行
docker-compose exec app pnpm run dev

# コンテナを停止
docker-compose down
```

### node_modulesについて

エディタの型チェックとインテリセンスのために、ホスト上にも `node_modules` をインストールすることを推奨します。

```bash
# ホスト上でインストール（エディタ用）
pnpm install

# コンテナを起動
docker-compose up -d

# コンテナ内で実行（実際の開発作業）
docker-compose exec app pnpm run dev
```

### パッケージの追加

新しいパッケージを追加する場合は、以下の手順で行います：

```bash
# 1. ホスト上で追加（エディタの型チェック用）
pnpm add <package-name>

# 2. コンテナを再ビルド（実行環境に反映）
docker-compose down
docker-compose build
docker-compose up -d
```

## テスト & 品質チェック

### ローカル環境

```bash
pnpm test          # Jest テスト実行
pnpm test:watch    # Jest ウォッチモード
pnpm test:coverage # カバレッジレポート生成
pnpm lint          # ESLint
pnpm lint:fix      # ESLint 自動修正
pnpm format        # Prettier フォーマット
pnpm format:check  # Prettier チェックのみ
```

### Docker環境

```bash
docker-compose exec app pnpm test
docker-compose exec app pnpm lint
docker-compose exec app pnpm format:check
```

## 環境変数リファレンス

| 変数名 | 必須 | 説明 | デフォルト値 |
| --- | --- | --- | --- |
| `ANTHROPIC_API_KEY` | ✅ | Anthropic ダッシュボードで発行した API キー | - |
| `CLAUDE_MODEL` | ✅ | 使用するモデル ID | `claude-3-7-sonnet-20250219` |
| `NODE_ENV` | ⬜️ | Node.js の実行モード | `development` |

## ライセンス

MIT License
