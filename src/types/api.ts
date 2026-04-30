/**
 * ============================================
 * 文件名称: api.ts
 * 文件版本: V1.0
 * 文件用途: API 请求/响应类型定义
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 统一定义所有 API 的请求参数和响应数据结构
 * 待确认: 需与后端确认各接口的详细字段
 * ============================================
 */
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg?: string;
  message?: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

// SSE 事件类型定义
export type SSEEventType = 'thinking' | 'text_chunk' | 'chart_config' | 'table_data' | 'clarification' | 'done' | 'error';

export interface SSEChunk {
  event: SSEEventType;
  data: string;
}