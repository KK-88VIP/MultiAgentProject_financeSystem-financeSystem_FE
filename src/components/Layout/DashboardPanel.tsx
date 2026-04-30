/**
 * ============================================
 * 文件名称: DashboardPanel.tsx
 * 文件版本: V1.0
 * 文件用途: 左侧看板面板容器（承载指标卡、柱状图、环形图、折线图）
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 占约 66% 宽度，集成四个看板模块
 * 待确认: 无公司权限时看板区域的展示方式
 * ============================================
 */


import React from 'react';
import KPICards from '../Dashboard/KPICards';
import BarChartSection from '../Dashboard/BarChartSection';
import RingChartSection from '../Dashboard/RingChartSection';
import LineChartSection from '../Dashboard/LineChartSection';
import DslWidgetGrid from '../Dashboard/DslWidgetGrid';
import { useDashboardStore } from '../../stores/dashboardStore';

const DashboardPanel: React.FC = () => {
  const { dslWidgets, isLoading } = useDashboardStore();
  const dslMode = import.meta.env.VITE_USE_DSL_RENDER === 'true';
  const showDslCharts = dslMode && dslWidgets && dslWidgets.length > 0;

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 space-y-6 bg-gray-50">
      {/* 4张指标卡 */}
      <KPICards />

      {showDslCharts ? (
        <DslWidgetGrid widgets={dslWidgets} loading={isLoading} />
      ) : (
        <>
          {/* 中间：柱状图 */}
          <BarChartSection />

          {/* 底部：环形图与折线图并排 */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <RingChartSection />
            <LineChartSection />
          </div>
        </>
      )}

      {/* 底部留白 */}
      <div className="h-4" />
    </div>
  );
};

export default DashboardPanel;