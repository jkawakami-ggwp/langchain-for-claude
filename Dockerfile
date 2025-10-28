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

# ポート3000を公開
EXPOSE 3000

# 開発用コマンドを実行
CMD ["pnpm", "run", "dev"]
