import { config as loadEnv } from 'dotenv';
import { Agent } from '../src/agent';
import { loadTools } from '../src/tools';
import { HumanMessage, AIMessage, BaseMessage } from '@langchain/core/messages';

loadEnv();

/**
 * 会話履歴を保持するチャットボットの例
 */
const chatbotExample = async (): Promise<void> => {
  const tools = await loadTools();
  const agent = new Agent({
    model: process.env['CLAUDE_MODEL'] as string,
    tools,
  });

  // 会話履歴を保存する配列
  const conversationHistory: BaseMessage[] = [];

  console.log('=== チャットボット開始 ===\n');

  // ユーザーの質問を配列で定義（実際のアプリでは、ユーザー入力をループで受け取る）
  const userQuestions = [
    '私の名前は山田太郎です',
    '東京の現在時刻を教えてください',
    '私の名前を覚えていますか？',
    '先ほど聞いた時刻から何分経ちましたか？',
  ];

  for (const question of userQuestions) {
    console.log(`👤 ユーザー: ${question}`);

    // ユーザーメッセージを会話履歴に追加
    conversationHistory.push(new HumanMessage(question));

    // 会話履歴全体を使ってエージェントを実行
    const response = await agent.invokeWithMessages(conversationHistory);

    console.log(`🤖 AI: ${response.content}\n`);

    // AIの応答を会話履歴に追加
    conversationHistory.push(new AIMessage(response.content));
  }

  console.log('=== 会話履歴 ===');
  conversationHistory.forEach((msg, index) => {
    const role = msg instanceof HumanMessage ? '👤' : '🤖';
    console.log(`${index + 1}. ${role} ${msg.content}`);
  });
};

/**
 * 単発の質問の例（会話履歴なし）
 */
const singleQuestionExample = async (): Promise<void> => {
  const tools = await loadTools();
  const agent = new Agent({
    model: process.env['CLAUDE_MODEL'] as string,
    tools,
  });

  console.log('\n=== 単発の質問（invoke） ===\n');

  const questions = ['東京の天気は？', '現在時刻は？', 'こんにちは'];

  for (const question of questions) {
    console.log(`👤 ユーザー: ${question}`);
    const response = await agent.invoke(question);
    console.log(`🤖 AI: ${response.content}\n`);
  }
};

// 実行
const main = async (): Promise<void> => {
  try {
    // チャットボットの例（会話履歴あり）
    await chatbotExample();

    // 単発の質問の例（会話履歴なし）
    await singleQuestionExample();
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
};

void main();

