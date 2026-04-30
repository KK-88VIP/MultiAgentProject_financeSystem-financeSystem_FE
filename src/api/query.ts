/**
 * ============================================
 * 文件名称: query.ts
 * 文件版本: V1.0
 * 文件用途: 智能问数 API 接口封装（SSE 流式 + 快捷问题）
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 包含快捷问题建议和 SSE 流式问数接口
 * ============================================
 */



import { request } from './client';

export interface Suggestion {
  id: string;
  content: string;
}

/**
 * 获取快捷问题建议
 */
export const getQuickSuggestions = (): Promise<Suggestion[]> => {
  return request<Suggestion[]>({
    url: '/api/query/suggestions',
    method: 'GET',
  });
};

/**
 * 问数请求参数定义 (供 fetchSSE 使用)
 */
export interface AskParams {
  question: string;
  conversation_id?: string;
  // 如果是消歧回复，携带此字段
  clarification?: Record<string, any>;
  // 权限信息通常由后端从 Token/Header 获取，但此处可按需定义
}

// 注意：POST /api/query/ask 的具体 SSE 实现将放在 utils/sseClient.ts 中
// 因为原生 fetch 的 ReadableStream 处理不适合放在 Axios 通用拦截器里