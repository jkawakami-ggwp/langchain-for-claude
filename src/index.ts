import { config as loadEnv } from 'dotenv';
import { Agent } from './agent';
import { loadTools } from './tools';

loadEnv();

// 非同期で実行されるメイン関数
const run = async (): Promise<void> => {
  // エージェントに送信するメッセージを定義
  const message =
    '東京の現在時刻と天気を教えてください。あと、Amazon S3とは何ですか？また、主な機能について教えてください。';

  try {
    // ツールを読み込み
    const tools = await loadTools();

    // Agentクラスのインスタンスを作成
    const agent = new Agent({
      model: process.env['CLAUDE_MODEL'] as string,
      tools,
    });

    // エージェントにメッセージを送信して応答を取得
    const response = await agent.invoke(message);

    // 応答を表示
    if (!response.content) {
      console.log('(応答なし)');
      return;
    }

    console.log(response.content);
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
};

// run関数を実行（voidで返り値を無視）
void run();
