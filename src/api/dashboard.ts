/**
 * ============================================
 * 文件名称: dashboard.ts
 * 文件版本: V1.0
 * 文件用途: 看板数据 API 接口封装（KPI + 图表数据）
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 获取指标卡和三类图表（柱状图、环形图、折线图）数据
 * ============================================
 */


import { request } from './client';
import { KPIData, ChartData } from '../types/dashboard';

/** 与后端约定：runtime_filters 的值仅允许 number | string */
export type RuntimeFilters = Record<string, number | string>;

export interface DslChartBlock {
  chart_type: string;
  x_field?: string;
  y_field?: string;
  x_axis?: (string | number)[];
  y_axis?: number[];
  metric_name?: string;
  unit?: string;
}

export interface DslRenderWidget {
  widget_id: string;
  cache?: boolean;
  chart?: DslChartBlock;
}

export interface DslRenderResult {
  dashboard_id?: string;
  widgets: DslRenderWidget[];
}

interface DashboardParams {
  company_ids: string[];
  years: number[];
}

export const getAvailableYears = (signal?: AbortSignal): Promise<number[]> => {
  return request<{ years?: Array<number | string> }>({
    url: '/api/dashboard/years',
    method: 'GET',
    signal,
  }).then((data) =>
    (data?.years || [])
      .map((year) => Number(year))
      .filter((year) => Number.isFinite(year))
      .sort((a, b) => b - a)
  );
};

interface BackendFilterCompanyItem {
  company_code: number | string;
  company_cn_name?: string;
  company_en_name?: string | null;
}

export interface DashboardFilterOptions {
  companies: Array<{ company_id: string; company_name: string }>;
  years: number[];
}

export const getFilterOptions = (signal?: AbortSignal): Promise<DashboardFilterOptions> => {
  return request<{ companies?: BackendFilterCompanyItem[]; years?: Array<number | string> }>({
    url: '/api/dashboard/filters',
    method: 'GET',
    signal,
  }).then((data) => {
    const companies = (data?.companies || []).map((item) => ({
      company_id: String(item.company_code),
      company_name: item.company_cn_name || item.company_en_name || String(item.company_code),
    }));
    const years = (data?.years || [])
      .map((year) => Number(year))
      .filter((year) => Number.isFinite(year))
      .sort((a, b) => b - a);
    return { companies, years };
  });
};

export const getKPIData = (params: DashboardParams, signal?: AbortSignal): Promise<KPIData> => {
  return request<Record<string, { value: number; yoy_change?: number | null; unit?: string }>>({
    url: '/api/dashboard/kpi',
    method: 'GET',
    params: {
      company_codes: params.company_ids.join(','),
      period_ids: params.years.join(','),
    },
    signal, // 绑定 AbortController 信号
  }).then((data) => {
    const normalizeItem = (item?: { value: number; yoy_change?: number | null; unit?: string }) => ({
      value: item?.value ?? 0,
      yoy_change: item?.yoy_change ?? undefined,
      unit: item?.unit || '亿元',
    });

    return {
      total_assets: normalizeItem(data?.total_assets),
      revenue: normalizeItem(data?.revenue || data?.total_revenue),
      net_profit: normalizeItem(data?.net_profit),
      operating_cashflow: normalizeItem(data?.operating_cashflow || data?.operating_cash_flow),
    };
  });
};

export const getChartData = (
  params: DashboardParams & { chart_type: string; metric: string },
  signal?: AbortSignal
): Promise<ChartData> => {
  return request<{
    chart_type: string;
    x_axis?: (string | number)[];
    y_axis?: number[];
    metric_name?: string;
    unit?: string;
  }>({
    url: '/api/dashboard/chart',
    method: 'GET',
    params: {
      chart_type: params.chart_type,
      metric: params.metric,
      company_codes: params.company_ids.join(','),
      period_ids: params.years.join(','),
    },
    signal,
  }).then((resp) => ({
    xAxis: (resp?.x_axis || []).map((x) => String(x)),
    series: [
      {
        name: resp?.metric_name || params.metric,
        data: resp?.y_axis || [],
      },
    ],
    unit: resp?.unit || '亿元',
  }));
};

export type PostDslRenderBody =
  | { dashboard_id: string; runtime_filters: RuntimeFilters; dsl?: never }
  | { dsl: unknown; runtime_filters: RuntimeFilters; dashboard_id?: never };

/**
 * POST /api/dashboard/dsl/render
 * 成功时由 client 拦截器直接返回业务 data（含 dashboard_id、widgets）
 */
export const postDslRender = (
  body: PostDslRenderBody,
  signal?: AbortSignal
): Promise<DslRenderResult> => {
  return request<DslRenderResult>({
    url: '/api/dashboard/dsl/render',
    method: 'POST',
    data: body,
    signal,
  }).then((data) => ({
    dashboard_id: data?.dashboard_id,
    widgets: Array.isArray(data?.widgets) ? data.widgets : [],
  }));
};