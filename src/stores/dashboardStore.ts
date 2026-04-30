/**
 * ============================================
 * 文件名称: dashboardStore.ts
 * 文件版本: V1.1
 * 文件用途: 看板数据状态全局 Store（KPI、图表数据、加载/错误状态）
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-21
 * 修改人: aQian (前端开发)
 * 说明: 管理看板四大模块的数据和状态，通过 triggerVersion 触发刷新
 * ============================================
 */

import { create } from 'zustand';
import type { DslRenderWidget } from '../api/dashboard';

interface DashboardState {
  isLoading: boolean;
  kpiData: any;
  barData: any;
  ringData: any;
  lineData: any;
  /** DSL 渲染结果（VITE_USE_DSL_RENDER=true 时使用） */
  dslWidgets: DslRenderWidget[] | null;
  dslDashboardId: string | null;
  triggerVersion: number; // 刷新触发器
  setLoading: (val: boolean) => void;
  setKpiData: (data: any) => void;
  setBarData: (data: any) => void;
  setRingData: (data: any) => void;
  setLineData: (data: any) => void;
  setDslWidgets: (widgets: DslRenderWidget[] | null) => void;
  setDslDashboardId: (id: string | null) => void;
  refreshAllData: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  isLoading: false,
  kpiData: null,
  barData: null,
  ringData: null,
  lineData: null,
  dslWidgets: null,
  dslDashboardId: null,
  triggerVersion: 0,
  setLoading: (isLoading) => set({ isLoading }),
  setKpiData: (kpiData) => set({ kpiData }),
  setBarData: (barData) => set({ barData }),
  setRingData: (ringData) => set({ ringData }),
  setLineData: (lineData) => set({ lineData }),
  setDslWidgets: (dslWidgets) => set({ dslWidgets }),
  setDslDashboardId: (dslDashboardId) => set({ dslDashboardId }),
  refreshAllData: () => {
    set((state) => ({ triggerVersion: state.triggerVersion + 1 }));
  },
}));
