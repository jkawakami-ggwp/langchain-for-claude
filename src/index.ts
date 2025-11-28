import { config as loadEnv } from 'dotenv';
import express, { Request, Response } from 'express';
import { Agent } from './agent';
import { loadTools } from './tools';

loadEnv();

const app = express();
app.use(express.json());

// ヘルスチェック用エンドポイント
app.get('/ping', (_req: Request, res: Response) => {
  res.send('pong');
});

// AIエージェントを呼び出すエンドポイント
app.post('/invoke', async (req: Request, res: Response): Promise<void> => {
  const { prompt } = req.body;

  if (!prompt) {
    res.status(400).json({ error: 'プロンプトが必要です' });
    return;
  }

  try {
    // ツールを読み込み
    const tools = await loadTools();

    // Agentクラスのインスタンスを作成
    const agent = new Agent({
      model: process.env['CLAUDE_MODEL'] as string,
      tools,
    });

    // エージェントにメッセージを送信して応答を取得
    const response = await agent.invoke(prompt);

    // 応答を返す
    if (!response.content) {
      res.json({ completion: '(応答なし)' });
      return;
    }

    res.json({ completion: response.content });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    res.status(500).json({
      error: 'エージェントの実行中にエラーが発生しました',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// サーバーを起動
const PORT = process.env['PORT'] || 8080;
app.listen(PORT, () => {
  console.log(`サーバーがポート ${PORT} で起動しました`);
  console.log(`ヘルスチェック: http://localhost:${PORT}/ping`);
  console.log(`エージェント実行: POST http://localhost:${PORT}/invoke`);
});
