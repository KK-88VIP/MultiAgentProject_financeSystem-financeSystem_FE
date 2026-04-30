/**
 * ============================================
 * 文件名称: BarChartSection.tsx
 * 文件版本: V1.0
 * 文件用途: 柱状图区域组件（公司排名 + 指标切换 + 多年度分组）
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 默认展示总资产排名，支持切换指标和多年度分组对比
 * ============================================
 */


import React, { useState } from 'react';
import { Card, Select, Space } from 'antd';
import CustomBarChart from '../Chart/CustomBarChart';
import { useDashboardStore } from '../../stores/dashboardStore';

const BarChartSection: React.FC = () => {
  const [metricKey, setMetricKey] = useState('total_assets');
  const { barData, isLoading } = useDashboardStore();

  const metricOptions = [
    { label: '总资产', value: 'total_assets' },
    { label: '营业收入', value: 'revenue' },
    { label: '净利润', value: 'net_profit' },
    { label: '货币资金', value: 'monetary_funds' },
  ];

  return (
    <Card
      title="近三年趋势"
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
      <div className="h-[350px]">
        <CustomBarChart 
          data={barData?.[metricKey]} 
          loading={isLoading}
        />
      </div>
    </Card>
  );
};

export default BarChartSection;