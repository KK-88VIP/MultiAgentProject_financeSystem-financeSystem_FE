/**
 * ============================================
 * 文件名称: chatStore.ts
 * 文件版本: V1.2
 * 文件用途: 对话状态全局 Store（消息历史、conversation_id、加载状态）
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-21
 * 修改人: aQian (前端开发)
 * 说明: 管理智能问数的对话上下文和多轮对话状态
 * ============================================
 */
import { create } from 'zustand';
import type { ChatMessage } from '../types/chat';

export type { ChatMessage };

interface ChatState {
  history: ChatMessage[];
  isGenerating: boolean;
  conversationId: string;
  appendMessage: (msg: ChatMessage) => void;
  updateLastMessage: (updater: (prev: ChatMessage) => ChatMessage) => void;
  finishGeneration: () => void;
  clearHistory: () => void;
  setConversationId: (id: string) => void;
  // SSE 桥接函数（由 useChatSSE hook 注册）
  _sendSSE: ((question: string, options?: any) => void) | null;
  _stopSSE: (() => void) | null;
  registerSSE: (sendFn: (q: string, o?: any) => void, stopFn: () => void) => void;
  sendMessage: (question: string, options?: any) => void;
  stopGeneration: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  history: [],
  isGenerating: false,
  conversationId: '',
  appendMessage: (msg) => set((state) => ({
    history: [...state.history, msg],
    isGenerating: msg.role === 'system'
  })),
  updateLastMessage: (updater) => set((state) => {
    const newHistory = [...state.history];
    const lastIndex = newHistory.length - 1;
    if (lastIndex >= 0) {
      newHistory[lastIndex] = updater(newHistory[lastIndex]);
    }
    return { history: newHistory };
  }),
  finishGeneration: () => set({ isGenerating: false }),
  clearHistory: () => set({ history: [], isGenerating: false, conversationId: '' }),
  setConversationId: (conversationId) => set({ conversationId }),
  _sendSSE: null,
  _stopSSE: null,
  registerSSE: (sendFn, stopFn) => set({ _sendSSE: sendFn, _stopSSE: stopFn }),
  sendMessage: (question, options) => {
    const { _sendSSE } = get();
    if (_sendSSE) {
      _sendSSE(question, options);
    }
  },
  stopGeneration: () => {
    const { _stopSSE } = get();
    if (_stopSSE) {
      _stopSSE();
    }
  },
}));
