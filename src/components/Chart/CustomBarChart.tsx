/**
 * ============================================
 * 文件名称: CustomBarChart.tsx
 * 文件版本: V1.0
 * 文件用途: 封装柱状图 ECharts 组件（公司排名 + 多年度分组）
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 通用柱状图封装，支持 ResizeObserver 自适应、dispose 清理
 * ============================================
 */



import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Spin } from 'antd';

interface Props {
  data: any;
  loading?: boolean;
  height?: number | string;
}

const CustomBarChart: React.FC<Props> = ({ data, loading, height = '100%' }) => {
  if (loading) return <div className="flex justify-center items-center h-full"><Spin /></div>;
  if (!data || !data.xAxis) return <div className="flex justify-center items-center h-full text-gray-400">暂无数据</div>;
  const unit = data.unit || '亿元';
  const isPercentMetric = unit.includes('%') || unit.includes('率');
  const formatValue = (value: number) => {
    if (isPercentMetric) {
      return `${Number(value).toFixed(2)}%`;
    }
    return Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any[]) => {
        let res = `${params[0].name}<br/>`;
        params.forEach(item => {
          res += `${item.marker} ${item.seriesName}: <b>${formatValue(item.value)}</b>${isPercentMetric ? '' : ` ${unit}`}<br/>`;
        });
        return res;
      }
    },
    legend: { bottom: 0 },
    grid: { left: '3%', right: '4%', top: '10%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: data.xAxis,
      axisLabel: { interval: 0, rotate: data.xAxis.length > 8 ? 30 : 0 }
    },
    yAxis: {
      type: 'value',
      name: isPercentMetric ? '单位 (%)' : `单位 (${unit})`,
      splitLine: { lineStyle: { type: 'dashed' } }
    },
    series: data.series.map((s: any) => ({
      name: s.name,
      type: 'bar',
      barMaxWidth: 40,
      data: s.data, // 注意：假设后端已完成单位转换，若未转换需在此 map 处理
      itemStyle: { borderRadius: [4, 4, 0, 0] }
    })),
    color: ['#1890ff', '#2fc25b', '#facc14', '#223273', '#8543e0']
  };

  return <ReactECharts option={option} style={{ height, width: '100%' }} />;
};

export default CustomBarChart;
