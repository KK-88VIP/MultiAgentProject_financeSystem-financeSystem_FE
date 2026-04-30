/**
 * ============================================
 * 文件名称: ChatChartRenderer.tsx
 * 文件版本: V1.0
 * 文件用途: 对话区图表渲染组件（根据 chart_config 渲染对应图表）
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 在对话消息中渲染后端返回的图表配置
 * 待确认: SSE chart_config 的详细字段定义
 * ============================================
 */



import React from 'react';
import { Card } from 'antd';
import CustomBarChart from '../Chart/CustomBarChart';
import CustomRingChart from '../Chart/CustomRingChart';
import CustomLineChart from '../Chart/CustomLineChart';

interface Props {
  config: any; // 由后端 SSE 下发的 chart_config
}

const ChatChartRenderer: React.FC<Props> = ({ config }) => {
  const renderChart = () => {
    switch (config.chart_type) {
      case 'bar': return <CustomBarChart data={config} height={250} />;
      case 'ring': return <CustomRingChart data={config} height={250} />;
      case 'line': return <CustomLineChart data={config} height={250} />;
      default: return <div className="text-gray-400">暂不支持该图表类型</div>;
    }
  };

  return (
    <Card 
      size="small" 
      className="w-full bg-white border-gray-200 shadow-sm"
      title={<span className="text-xs font-medium text-gray-500">{config.title}</span>}
    >
      <div className="w-full overflow-hidden">
        {renderChart()}
      </div>
    </Card>
  );
};

export default ChatChartRenderer;
