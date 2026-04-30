/**
 * ============================================
 * 文件名称: RingChartSection.tsx
 * 文件版本: V1.0
 * 文件用途: 环形图区域组件（资产结构 / 风险标识双模式 Tab 切换）
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 两个 Tab 模式：资产结构（展示科目占比）、风险标识（风险/正常科目占比）
 * 待确认: 环形图多选公司时的展示逻辑
 * ============================================
 */



import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
import CustomRingChart from '../Chart/CustomRingChart';
import { useDashboardStore } from '../../stores/dashboardStore';

const RingChartSection: React.FC = () => {
  const [mode, setMode] = useState('asset_structure');
  const { ringData, isLoading } = useDashboardStore();

  return (
    <Card className="shadow-sm overflow-hidden" bodyStyle={{ padding: '0 24px 24px' }}>
      <Tabs 
        activeKey={mode} 
        onChange={setMode}
        items={[
          { key: 'asset_structure', label: '资产结构' },
          { key: 'risk_identification', label: '风险标识' },
        ]}
      />

      <div className="h-[300px]">
        <CustomRingChart 
          data={ringData?.[mode]} 
          loading={isLoading} 
        />
      </div>
    </Card>
  );
};

export default RingChartSection;
