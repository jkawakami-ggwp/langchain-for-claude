import { config as loadEnv } from 'dotenv';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { createAgent } from 'langchain';
import { tools } from './tools';

loadEnv();

// 非同期で実行されるメイン関数
const run = async (): Promise<void> => {
  // エージェントに送信するメッセージを定義
  const message = '東京の現在時刻と天気を教えてください。';

  try {
    // モデルを使用してエージェントを作成
    const agent = createAgent({
      model: process.env['CLAUDE_MODEL'] as string,
      tools,
    });

    // エージェントにメッセージを送信して応答を取得
    const response = await agent.invoke({
      messages: [
        // システムメッセージ: エージェントの役割や振る舞いを指示
        new SystemMessage(
          'あなたは親切なAIアシスタントです。適切なツールを使用して回答してください。'
        ),
        // 人間のメッセージ: ユーザーからの実際の質問やリクエスト
        new HumanMessage(message),
      ],
    });

    // 応答メッセージの配列から最後のAIメッセージを取得
    const lastAiMessage = [...response.messages]
      .reverse() // 配列を逆順にして最後のメッセージから検索
      .find((msg) => msg.constructor.name === 'AIMessage') as AIMessage | undefined;

    // 最終的なAI応答を表示（agent.invoke()がツール実行まで完了するため、常にstringのはず）
    if (!lastAiMessage?.content) {
      console.log('(応答なし)');
      return;
    }

    console.log(lastAiMessage.content);
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
};

// run関数を実行（voidで返り値を無視）
void run();
