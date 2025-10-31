# Node.js 20の最新LTSイメージを使用
FROM node:20-alpine

# 作業ディレクトリを設定
WORKDIR /app

# pnpmをグローバルにインストール
RUN npm install -g pnpm

# パッケージファイルをコピー
COPY package.json pnpm-lock.yaml* ./

# 依存関係をインストール（開発用）
RUN pnpm install

# ポート8080を公開
EXPOSE 8080

# 開発用コマンドを実行
CMD ["pnpm", "run", "dev"]
