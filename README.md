# LangChain Claude プロジェクト

Anthropic Claude API を直接叩く LangChain × TypeScript サンプルです。エージェントは LangChain のツール機能に対応しており、Claude 3.5 Sonnet をデフォルトモデルとして利用します。

## 主な特徴
- **Claudeネイティブ**: Bedrock を経由せずに Anthropic API を直接利用
- **LangChain Agent**: ツール呼び出しに対応したシンプルなエージェント構成
- **TypeScript**: 型安全にサンプルを拡張可能
- **CLI / ランタイム共通**: `pnpm dev` で即動作を確認可能

## 前提条件
- Node.js 18 以上
- Anthropic アカウントと API キー
- `pnpm` もしくは `npm`

## セットアップ

```bash
git clone <repository-url>
cd langchain-claude-project

# 依存関係のインストール
pnpm install      # または npm install

# 環境変数のセットアップ
cp env.example .env
```

`.env` に以下を設定してください。

```dotenv
ANTHROPIC_API_KEY=your_api_key
CLAUDE_MODEL=claude-3-5-sonnet-20240620 # 任意。未設定時はこの値が使用されます
NODE_ENV=development
```

## 実行方法

```bash
# TypeScriptのまま即実行
pnpm dev

# ビルド & 実行
pnpm build
pnpm start
```

コンソールには Claude からの応答が表示されます。`src/index.ts` の `message` やシステムプロンプト、利用するツールを編集することで挙動をカスタマイズできます。

## ツールの追加

`src/tools` 配下にツールを定義し、`src/tools/index.ts` の配列に追加するとエージェントが利用できるようになります。`getWeatherTool.ts` は最小構成の例です。

## Docker環境での開発

### node_modulesについて

このプロジェクトでは、エディタの型チェックとインテリセンスのためにホスト上にも `node_modules` が必要です。

```bash
# ホスト上でインストール（エディタ用）
pnpm install

# コンテナを起動
docker-compose up -d

# コンテナ内でコマンドを実行する場合
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

**推奨**: ホスト側で `package.json` を編集してからコンテナを再ビルドすることで、両方の環境を同期できます。

## テスト & 品質チェック

```bash
pnpm test          # Jest
pnpm lint          # ESLint
pnpm format:check  # Prettier
```

## 環境変数リファレンス

| 変数名 | 必須 | 説明 |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | ✅ | Anthropic ダッシュボードで発行した API キー |
| `CLAUDE_MODEL` | ⬜️ | 使用するモデル ID。未指定なら `claude-3-5-sonnet-20240620` |
| `NODE_ENV` | ⬜️ | Node.js の実行モード (`development` / `production` など) |

## ライセンス

MIT License
