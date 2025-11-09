// chatActions.test.ts
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { askSituation, sendMessage, resetConversation, MessageHistory } from '../action/conversation'; // ← 実際のファイル名に合わせる
import ViewMessage from '../model/ViewMessage';
import MessagesState from '../action/state/messageState';
import phaseState from '../action/state/phaseState';
import LoadState from '../action/state/loadState';

// axios をモック（model/helper はモックしない）
vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('chatActions', () => {
  beforeEach(() => {
    // シングルトン・ストアを毎回クリア
    MessageHistory.getInstance().clearAll();
    MessagesState.getState().messages = [];
    phaseState.getState().phase = 'ASK_SITUATION';
    LoadState.getState().isLoading = false;

    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('askSituation', () => {
    it('初期メッセージを追加し、ローディングを正しく制御する', async () => {
      const promise = askSituation();

      // sleep(700) 前
      expect(LoadState.getState().isLoading).toBe(true);

      vi.advanceTimersByTime(700);
      await promise;

      expect(LoadState.getState().isLoading).toBe(false);
      expect(MessagesState.getState().messages).toHaveLength(1);
      expect(MessagesState.getState().messages[0]).toMatchObject({
        type: 'assistant',
        message: 'こんにちは。わたしは英会話AIのGiggloです！\nどんな状況の会話をしますか？\n入力してね！（日本語でOK）',
        subMessage: null,
      });
    });
  });

  describe('sendMessage', () => {
    it('ASK_SITUATION フェーズ：状況設定→初回AI応答→CONVERSATIONへ遷移', async () => {
      phaseState.getState().phase = 'ASK_SITUATION';

      mockedAxios.post = vi.fn().mockResolvedValue({
        data: { message: 'Nice to meet you! Let\'s start.' },
      }) as any;

      const userMsg = 'レストランで注文したい';
      const promise = sendMessage({ message: userMsg });

      vi.advanceTimersByTime(300);
      await promise;

      // API 呼び出し確認
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/getFirstTalk', {
        situation: userMsg,
        conversation: '',
      });

      // 履歴確認
      expect(MessageHistory.getInstance().getSituation()).toBe(userMsg);
      expect(MessageHistory.getInstance().getHistoryAsString()).toBe(
        'assistant: Nice to meet you! Let\'s start.'
      );

      // メッセージ数：ユーザー + "その状況で..." + AI応答
      expect(MessagesState.getState().messages).toHaveLength(3);
      expect(MessagesState.getState().messages[0]).toMatchObject({ type: 'user', message: userMsg });
      expect(MessagesState.getState().messages[1]).toMatchObject({
        type: 'assistant',
        message: 'その状況での会話を始めるね！',
      });
      expect(MessagesState.getState().messages[2]).toMatchObject({
        type: 'assistant',
        message: 'Nice to meet you! Let\'s start.',
      });

      expect(phaseState.getState().phase).toBe('CONVERSATION');
      expect(LoadState.getState().isLoading).toBe(false);
    });

    it('CONVERSATION フェーズ：添削付き応答＋履歴蓄積', async () => {
      phaseState.getState().phase = 'CONVERSATION';
      MessageHistory.getInstance().setSituation('レストランで注文したい');
      // 既存履歴を入れておく
      MessageHistory.getInstance().addAssistantMessage('Hello, what would you like?');
      MessageHistory.getInstance().addUserMessage('I want pasta.');

      mockedAxios.post = vi.fn().mockResolvedValue({
        data: {
          message: 'Sure, coming right up!',
          correction: 'I\'d like pasta, please.（丁寧に言えます）',
        },
      }) as any;

      const userMsg = 'パスタ食べたい';
      const promise = sendMessage({ message: userMsg });
      await promise; // sleep なしなので即時

      // API 呼び出し確認（履歴は現在のユーザー発言前まで）
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/getResponse', {
        situation: 'レストランで注文したい',
        messageHistory: 'assistant: Hello, what would you like?\nuser: I want pasta.',
        userMessage: userMsg,
      });

      // 履歴確認（オリジナルメッセージで保存）
      expect(MessageHistory.getInstance().getHistoryAsString()).toBe(
        'assistant: Hello, what would you like?\nuser: I want pasta.\nuser: パスタ食べたい\nassistant: Sure, coming right up!'
      );

      // 画面表示：ユーザー（添削付き） + AI
      expect(MessagesState.getState().messages).toHaveLength(2); 
      const userViewMsg = MessagesState.getState().messages.find(m => m.type === 'user' && m.message === userMsg);
      expect(userViewMsg?.subMessage).toBe('I\'d like pasta, please.（丁寧に言えます）');

      const assistantMsg = MessagesState.getState().messages.find(m => m.type === 'assistant' && m.message === 'Sure, coming right up!');
      expect(assistantMsg).toBeDefined();

      expect(LoadState.getState().isLoading).toBe(false);
    });
  });

  describe('resetConversation', () => {
    it('全てクリアして初期状態に戻る', async () => {
      // 事前に汚す
      MessageHistory.getInstance().setSituation('テスト状況');
      MessageHistory.getInstance().addUserMessage('テストメッセージ');
      phaseState.getState().phase = 'CONVERSATION';
      MessagesState.getState().messages.push(
        new ViewMessage({ type: 'user', message: 'ダミー', subMessage: null })
      );

      const promise = resetConversation();

      vi.advanceTimersByTime(700); // askSituation 内の sleep
      await promise;

      expect(MessageHistory.getInstance().getSituation()).toBe('');
      expect(MessageHistory.getInstance().getHistoryAsString()).toBe('');
      expect(phaseState.getState().phase).toBe('ASK_SITUATION');
      expect(MessagesState.getState().messages).toHaveLength(1);
      expect(MessagesState.getState().messages[0].message).toContain('こんにちは。わたしは英会話AIのGiggloです');
      expect(LoadState.getState().isLoading).toBe(false);
    });
  });
});