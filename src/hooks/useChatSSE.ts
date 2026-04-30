/**
 * ============================================
 * 文件名称: useChatSSE.ts
 * 文件版本: V1.2
 * 文件用途: SSE 流式对话自定义 Hook
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-21
 * 修改人: aQian (前端开发)
 * 说明: 封装智能问数的 SSE 连接、消息追加、状态管理
 * ============================================
 */

import { useRef, useEffect, useCallback } from 'react';
import { useChatStore, ChatMessage } from '../stores/chatStore';
import { resolveXUserRole } from '../utils/userRole';

type BackendSSEEvent =
  | 'start'
  | 'intent'
  | 'sql'
  | 'clarification'
  | 'data'
  | 'summary'
  | 'end'
  | 'error';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export const useChatSSE = () => {
  const abortControllerRef = useRef<AbortController | null>(null);
  const { appendMessage, updateLastMessage, finishGeneration, registerSSE } = useChatStore();

  // 保持最新 store 方法的引用，避免闭包过期
  const storeRef = useRef({ appendMessage, updateLastMessage, finishGeneration });
  useEffect(() => {
    storeRef.current = { appendMessage, updateLastMessage, finishGeneration };
  });

  const sendMessage = useCallback(async (question: string, options: any = {}) => {
    const store = storeRef.current;

    // 1. 中止旧连接（防止同时多轮对话）
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // 2. 添加用户消息
    store.appendMessage({
      id: Date.now().toString(),
      role: 'user',
      content: question,
      type: 'text',
    });
    // 3. 添加系统回复占位
    store.appendMessage({
      id: (Date.now() + 1).toString(),
      role: 'system',
      content: '',
      type: 'text',
    });

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/query/ask`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Id': import.meta.env.VITE_DEFAULT_USER_ID || 'user_001',
            'X-User-Role': resolveXUserRole(),
          },
          body: JSON.stringify({
            question,
            clarification:
              options && typeof options.clarification === 'object' && options.clarification !== null
                ? options.clarification
                : {},
          }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const handleSSEEvent = (rawEvent: string) => {
        const eventLine = rawEvent.split('\n').find((line) => line.startsWith('event:'));
        const eventName = (eventLine?.slice(6).trim() || '') as BackendSSEEvent;
        const dataLines = rawEvent
          .split('\n')
          .filter((line) => line.startsWith('data:'))
          .map((line) => line.slice(5).trimStart());

        if (dataLines.length === 0) {
          return;
        }

        let data: any;
        try {
          data = JSON.parse(dataLines.join('\n'));
        } catch {
          return;
        }

        const s = storeRef.current; // 每次事件处理获取最新 store
        switch (eventName) {
          case 'start':
          case 'intent':
            s.updateLastMessage((prev: ChatMessage) => ({
              ...prev,
              content: prev.content || '正在分析...',
            }));
            break;

          case 'summary':
            s.updateLastMessage((prev: ChatMessage) => ({
              ...prev,
              content: prev.content + (data.content || ''),
            }));
            break;

          case 'sql':
            // 调试事件，默认不在聊天区展示
            break;

          case 'data': {
            const rows = Array.isArray(data?.rows) ? data.rows : [];
            s.updateLastMessage((prev: ChatMessage) => ({
              ...prev,
              type: 'table',
              tableData: {
                columns:
                  rows.length > 0
                    ? Object.keys(rows[0]).map((key) => ({
                        title: key,
                        dataIndex: key,
                      }))
                    : [],
                dataSource: rows,
                title: rows.length === 0 ? '本次查询无数据' : undefined,
              },
            }));
            break;
          }

          case 'clarification':
            s.updateLastMessage((prev: ChatMessage) => ({
              ...prev,
              type: 'clarification',
              clarification: data,
            }));
            break;

          case 'end':
            s.finishGeneration();
            break;

          case 'error':
            s.updateLastMessage((prev: ChatMessage) => ({
              ...prev,
              content: prev.content
                ? prev.content + `\n\n**查询异常**：${data.message || '请稍后重试'}`
                : `**查询异常**：${data.message || '请稍后重试'}`,
            }));
            s.finishGeneration();
            break;

          default:
            // 未识别事件类型，忽略
            break;
        }
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // 统一换行符，兼容后端使用 CRLF 的 SSE 分隔格式
        buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n');

        let eventBoundary = buffer.indexOf('\n\n');
        while (eventBoundary !== -1) {
          const rawEvent = buffer.slice(0, eventBoundary).trim();
          buffer = buffer.slice(eventBoundary + 2);
          if (rawEvent) {
            handleSSEEvent(rawEvent);
          }
          eventBoundary = buffer.indexOf('\n\n');
        }
      }

      // 某些服务端实现可能不会在最后一条事件后补全空行，这里做一次兜底处理
      buffer += decoder.decode().replace(/\r\n/g, '\n');
      if (buffer.trim()) {
        handleSSEEvent(buffer.trim());
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // 用户主动停止，静默处理
      } else {
        console.error('SSE Error:', err);
        storeRef.current.updateLastMessage((prev: ChatMessage) => ({
          ...prev,
          content: prev.content
            ? prev.content + '\n\n**连接异常**：请稍后重试'
            : '**连接异常**：请稍后重试',
        }));
      }
    } finally {
      storeRef.current.finishGeneration();
    }
  }, []);

  const stop = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  // 注册到 chatStore，供 ChatInput 等组件调用
  useEffect(() => {
    registerSSE(sendMessage, stop);
    return () => {
      registerSSE(null as any, null as any);
    };
  }, [registerSSE, sendMessage, stop]);

  return { sendMessage, stop };
};
