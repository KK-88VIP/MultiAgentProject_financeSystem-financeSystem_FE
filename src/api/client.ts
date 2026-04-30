// 初始化 Axios 实例，配置基础路径、超时间隔及统一的请求/响应拦截。

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { resolveXUserRole } from '../utils/userRole';

// 从环境变量读取 API 根路径
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function formatValidationDetails(details: unknown): string {
  if (!Array.isArray(details) || details.length === 0) {
    return '';
  }
  return details
    .map((d: any) => {
      const field = d?.field ?? '';
      const exp = d?.expected ?? '';
      const act = d?.actual ?? '';
      if (field && exp && act !== undefined && act !== '') {
        return `${field}：期望 ${exp}，实际 ${act}`;
      }
      if (field && exp) {
        return `${field}：期望 ${exp}`;
      }
      return String(d?.message || JSON.stringify(d));
    })
    .filter(Boolean)
    .join('；');
}

function appendTraceHint(payload: Record<string, unknown> | undefined): string {
  if (!payload) return '';
  const rid = payload.request_id;
  const tid = payload.trace_id;
  const parts: string[] = [];
  if (rid) parts.push(`request_id=${rid}`);
  if (tid) parts.push(`trace_id=${tid}`);
  return parts.length ? `（${parts.join('，')}）` : '';
}

const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 看板接口 15s 超时
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：注入 UserID、UserRole 等通用业务头
client.interceptors.request.use((config) => {
  const userId = import.meta.env.VITE_DEFAULT_USER_ID || 'user_001';
  config.headers['X-User-Id'] = userId;
  config.headers['X-User-Role'] = resolveXUserRole();
  return config;
});

// 响应拦截器：统一处理业务错误码
client.interceptors.response.use(
  (response) => {
    const res = response.data;
    const responseMsg = res?.msg || res?.message;
    // 兼容后端 { code, data, message } 与历史 { code, data, msg }
    if (res.code !== 200) {
      message.error(responseMsg || '业务请求失败');
      return Promise.reject(new Error(responseMsg || '业务请求失败'));
    }
    // 直接返回业务 data 字段，避免调用方需要 res.data.data
    return res.data;
  },
  (error: AxiosError<any>) => {
    if (axios.isCancel(error)) {
      // 请求被取消，静默处理
      return Promise.reject(error);
    }
    const httpStatus = error.response?.status;
    const body = error.response?.data as Record<string, any> | undefined;
    const serverMsg = body?.msg || body?.message;
    const traceHint = appendTraceHint(body);

    if (error.code === 'ECONNABORTED') {
      message.error(`请求超时，请检查网络连接后重试${traceHint}`);
      return Promise.reject(error);
    }

    // HTTP 状态码映射提示
    if (httpStatus === 401) {
      message.error(`您无访问权限${traceHint}`);
    } else if (httpStatus === 403) {
      if (body?.error_code === 'PERMISSION_DENIED') {
        message.error(`您无权限访问该资源${traceHint}`);
      } else {
        message.error(`您无权限查看该公司数据${traceHint}`);
      }
    } else if (httpStatus === 422) {
      const detailText = formatValidationDetails(body?.details);
      const main = detailText || serverMsg || '请求参数校验失败';
      message.error(`${main}${traceHint}`);
    } else if (httpStatus === 400) {
      message.error(serverMsg || `无法理解您的问题，请尝试换一种表述${traceHint}`);
    } else if (httpStatus === 404) {
      message.error(serverMsg || `未找到匹配数据${traceHint}`);
    } else if (httpStatus === 500) {
      message.error(`系统异常，请稍后重试${traceHint}`);
      if (traceHint) {
        console.error('[API 500]', body?.request_id, body?.trace_id, body);
      }
    } else {
      message.error(serverMsg || `网络异常，请稍后重试${traceHint}`);
    }

    return Promise.reject(error);
  }
);

/**
 * 封装通用请求方法，显式支持 AbortSignal
 */
export const request = <T>(config: AxiosRequestConfig): Promise<T> => {
  return client.request(config);
};

export default client;
