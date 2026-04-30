/**
 * ============================================
 * 文件名称: LineChartSection.tsx
 * 文件版本: V1.0
 * 文件用途: 折线图区域组件（趋势分析 + 多公司叠加对比）
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 展示选中公司近4年指标趋势，多公司自动叠加不同颜色折线
 * 待确认: 折线图多公司叠加颜色分配方案
 * ============================================
 */



import React, { useState } from 'react';
import { Card, Select, Space } from 'antd';
import CustomLineChart from '../Chart/CustomLineChart';
import { useDashboardStore } from '../../stores/dashboardStore';

const LineChartSection: React.FC = () => {
  const [metricKey, setMetricKey] = useState('revenue');
  const { lineData, isLoading } = useDashboardStore();

  const metricOptions = [
    { label: '营业收入', value: 'revenue' },
    { label: '净利润', value: 'net_profit' },
    { label: '负债总额', value: 'total_liabilities' },
  ];

  return (
    <Card 
      title="年度财务趋势分析" 
      extra={
        <Space>
          <span className="text-gray-400 text-sm">指标:</span>
          <Select 
            value={metricKey} 
            onChange={setMetricKey} 
            options={metricOptions} 
            size="small"
            style={{ width: 120 }}
          />
        </Space>
      }
      className="shadow-sm"
    >
      <div className="h-[300px]">
        <CustomLineChart 
          data={lineData?.[metricKey]} 
          loading={isLoading} 
        />
      </div>
    </Card>
  );
};

export default LineChartSection;