/**
 * ============================================
 * 文件名称: useDashboardData.ts
 * 文件版本: V1.2
 * 文件用途: 看板数据请求自定义 Hook
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-29
 * 修改人: aQian (前端开发)
 * 说明: 支持 VITE_USE_DSL_RENDER 切换 DSL 渲染与兼容路径 /kpi + /chart
 * ============================================
 */

import { useEffect, useRef, useCallback } from 'react';
import { useDashboardStore } from '../stores/dashboardStore';
import { useFilterStore } from '../stores/filterStore';
import * as api from '../api/dashboard';

const isDslRenderEnabled = () => import.meta.env.VITE_USE_DSL_RENDER === 'true';

export const useDashboardData = () => {
  const { selectedCompany, selectedYear } = useFilterStore();
  const {
    setLoading,
    setKpiData,
    setBarData,
    setRingData,
    setLineData,
    setDslWidgets,
    setDslDashboardId,
    triggerVersion,
  } = useDashboardStore();

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setLoading(true);
    try {
      if (!selectedCompany || !selectedYear) {
        return;
      }

      const lastTwoYears = [selectedYear - 1, selectedYear];
      const lastThreeYears = [selectedYear - 2, selectedYear - 1, selectedYear];
      const kpiParams = { company_ids: [selectedCompany], years: lastTwoYears };
      const chartParams = { company_ids: [selectedCompany], years: lastThreeYears };

      const dslOn = isDslRenderEnabled();
      const dashboardId = (import.meta.env.VITE_DASHBOARD_ID || '').trim();

      if (dslOn && dashboardId) {
        const runtimeFilters: api.RuntimeFilters = { year: selectedYear };
        const [dslResult, kpi] = await Promise.all([
          api.postDslRender({ dashboard_id: dashboardId, runtime_filters: runtimeFilters }, signal),
          api.getKPIData(kpiParams, signal),
        ]);
        setDslDashboardId(dslResult.dashboard_id ?? dashboardId);
        setDslWidgets(dslResult.widgets);
        setKpiData(kpi);
        setBarData(null);
        setRingData(null);
        setLineData(null);
        return;
      }

      if (dslOn && !dashboardId) {
        console.warn(
          '[useDashboardData] VITE_USE_DSL_RENDER=true 但未配置 VITE_DASHBOARD_ID，已回退到 /kpi + /chart'
        );
      }

      setDslWidgets(null);
      setDslDashboardId(null);

      const applySeriesName = (chart: any, label: string) => ({
        ...chart,
        series: (chart?.series || []).map((s: any) => ({
          ...s,
          name: label,
          data: (s?.data || []).map((value: number) => Number(value.toFixed(2))),
        })),
      });

      const [kpi, barAssets, barRevenue, barProfit, barFunds, lineRevenue, lineProfit, lineLiability, ringAsset, ringRisk] =
        await Promise.all([
          api.getKPIData(kpiParams, signal),
          api.getChartData({ ...chartParams, chart_type: 'bar', metric: 'total_assets' }, signal),
          api.getChartData({ ...chartParams, chart_type: 'bar', metric: 'total_revenue' }, signal),
          api.getChartData({ ...chartParams, chart_type: 'bar', metric: 'net_profit' }, signal),
          api.getChartData({ ...chartParams, chart_type: 'bar', metric: 'monetary_funds' }, signal),
          api.getChartData({ ...chartParams, chart_type: 'line', metric: 'total_revenue' }, signal),
          api.getChartData({ ...chartParams, chart_type: 'line', metric: 'net_profit' }, signal),
          api.getChartData({ ...chartParams, chart_type: 'line', metric: 'total_liabilities' }, signal),
          api.getChartData({ ...chartParams, chart_type: 'ring', metric: 'total_assets' }, signal),
          api.getChartData({ ...chartParams, chart_type: 'ring', metric: 'net_profit' }, signal),
        ]);

      const toPieSeries = (chart: { xAxis?: string[]; series?: { data?: number[] }[] }, metricName: string) => {
        const labels = chart?.xAxis || [];
        const values = chart?.series?.[0]?.data || [];
        return labels.map((name, idx) => ({
          name: `${metricName}-${name}`,
          value: Number((values[idx] ?? 0).toFixed(2)),
        }));
      };

      setKpiData(kpi);
      setBarData({
        total_assets: applySeriesName(barAssets, '总资产'),
        revenue: applySeriesName(barRevenue, '营业收入'),
        net_profit: applySeriesName(barProfit, '净利润'),
        monetary_funds: applySeriesName(barFunds, '货币资金'),
      });
      setLineData({
        revenue: applySeriesName(lineRevenue, '营业收入'),
        net_profit: applySeriesName(lineProfit, '净利润'),
        total_liabilities: applySeriesName(lineLiability, '负债总额'),
      });
      setRingData({
        asset_structure: { series: toPieSeries(ringAsset, '资产结构') },
        risk_identification: { series: toPieSeries(ringRisk, '风险标识') },
      });
    } catch (err: any) {
      if (err.name !== 'CanceledError') {
        console.error('Dashboard fetch error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [
    selectedCompany,
    selectedYear,
    setLoading,
    setKpiData,
    setBarData,
    setRingData,
    setLineData,
    setDslWidgets,
    setDslDashboardId,
  ]);

  useEffect(() => {
    if (triggerVersion > 0) {
      fetchData();
    }

    return () => abortControllerRef.current?.abort();
  }, [triggerVersion, fetchData]);
};
