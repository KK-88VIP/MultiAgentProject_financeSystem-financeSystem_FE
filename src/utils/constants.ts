/**
 * ============================================
 * 文件名称: constants.ts
 * 文件版本: V1.0
 * 文件用途: 全局常量定义（枚举值、错误码、固定配置等）
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 集中管理项目中使用的常量，避免硬编码散落在各处
 * ============================================
 */

/** 可用年度列表 */
export const AVAILABLE_YEARS = ['2022', '2023', '2024', '2025'];

/** 筛选器变更防抖延迟（毫秒） */
export const FILTER_DEBOUNCE_MS = 200;

/** 看板 API 请求超时（毫秒） */
export const DASHBOARD_API_TIMEOUT = 10000;

/** SSE text_chunk 渲染节流间隔（毫秒） */
export const SSE_RENDER_THROTTLE_MS = 100;

/** 右侧面板折叠/展开动画时长（毫秒） */
export const PANEL_TRANSITION_MS = 300;

/** 错误码常量 */
export const ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
} as const;

/** 错误提示信息映射 */
export const ERROR_MESSAGES: Record<number, string> = {
  [ERROR_CODES.UNAUTHORIZED]: '您无访问权限',
  [ERROR_CODES.FORBIDDEN]: '您无权限查看该公司数据',
  [ERROR_CODES.BAD_REQUEST]: '无法理解您的问题，请尝试换一种表述',
  [ERROR_CODES.NOT_FOUND]: '未找到匹配数据',
  [ERROR_CODES.TOO_MANY_REQUESTS]: '请求过于频繁，请稍后再试',
  [ERROR_CODES.SERVER_ERROR]: '系统异常，请稍后重试',
};

/** 网络异常提示 */
export const NETWORK_ERROR_MESSAGE = '网络连接失败，请检查网络后重试';

/** 角色显示名称映射 */
export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  management: '管理层',
  sub_company_finance: '子公司财务',
};

/** LocalStorage Key 常量 */
export const STORAGE_KEYS = {
  PANEL_COLLAPSED: 'finance-dashboard-panel-collapsed',
  USER_ID: 'finance-dashboard-user-id',
} as const;
