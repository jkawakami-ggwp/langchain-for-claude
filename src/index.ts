import { config as loadEnv } from 'dotenv';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { createAgent } from 'langchain';
import { tools } from './tools';

loadEnv();

// 非同期で実行されるメイン関数
const run = async (): Promise<void> => {
  // エージェントに送信するメッセージを定義
  const message = '東京の天気情報を教えてください。';

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
        new SystemMessage('あなたは親切なAIアシスタントです。必ず日本語で回答してください。'),
        // 人間のメッセージ: ユーザーからの実際の質問やリクエスト
        new HumanMessage(message),
      ],
    });

    // 応答メッセージの配列から最後のAIメッセージを取得
    // _getTypeメソッドまたはコンストラクタ名でAIMessageを判定
    const lastAiMessage = [...response.messages]
      .reverse() // 配列を逆順にして最後のメッセージから検索
      .find((msg) => {
        // LangChainのメッセージオブジェクトの型を確認
        return (
          msg instanceof AIMessage ||
          msg.constructor.name === 'AIMessage' ||
          (msg as any)._getType?.() === 'ai'
        );
      }) as AIMessage | undefined;

    // contentが配列の場合は文字列に変換、文字列の場合はそのまま使用
    const content = lastAiMessage?.content
      ? typeof lastAiMessage.content === 'string'
        ? lastAiMessage.content
        : JSON.stringify(lastAiMessage.content, null, 2)
      : '(応答なし)';

    // 結果をコンソールに出力
    console.log(content);
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
};

// run関数を実行（voidで返り値を無視）
void run();
