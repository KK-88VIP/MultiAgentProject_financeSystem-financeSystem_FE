/**
 * ============================================
 * 文件名称: sseClient.ts
 * 文件版本: V1.0
 * 文件用途: SSE（Server-Sent Events）客户端工具
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 封装基于 fetch 的 SSE 客户端，用于智能问数流式响应
 * 待确认: SSE 连接异常恢复策略（是否需要自动重连）
 * ============================================
 */

import type { SSEChunk, SSEEventType } from '@/types/api';

/** SSE 连接配置 */
export interface SSEConfig {
  url: string;
  method?: 'POST';
  body?: string;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  onEvent: (chunk: SSEChunk) => void;
  onDone?: () => void;
  onError?: (error: Error) => void;
}

/**
 * 建立 SSE 连接并处理流式响应
 * @param config - SSE 连接配置
 * @returns 返回可用于中止连接的 AbortController（如果外部未提供 signal）
 */
export function connectSSE(config: SSEConfig): AbortController {
  const controller = new AbortController();
  if (config.signal) {
    config.signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  const { url, method = 'POST', body, headers, onEvent, onDone, onError } = config;

  fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body,
    signal: controller.signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`SSE 连接失败: HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('响应体不可读');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          onDone?.();
          break;
        }

        buffer += decoder.decode(value, { stream: true });

        // 按行解析 SSE 事件
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // 保留未完成的行

        let currentEvent: SSEEventType | null = null;

        for (const line of lines) {
          if (line.startsWith('event:')) {
            currentEvent = line.slice(6).trim() as SSEEventType;
          } else if (line.startsWith('data:') && currentEvent) {
            const data = line.slice(5).trim();
            onEvent({ event: currentEvent, data });
            currentEvent = null;
          }
        }
      }
    })
    .catch((error: Error) => {
      if (error.name === 'AbortError') {
        return; // 主动中止，不报错
      }
      onError?.(error);
    });

  return controller;
}
