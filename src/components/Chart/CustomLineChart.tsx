/**
 * ============================================
 * 文件名称: CustomLineChart.tsx
 * 文件版本: V1.0
 * 文件用途: 封装折线图 ECharts 组件（趋势分析 + 多公司叠加）
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 通用折线图封装，支持多公司颜色分配、图例交互
 * 待确认: 多公司叠加时的颜色分配方案
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

const CustomLineChart: React.FC<Props> = ({ data, loading, height = '100%' }) => {
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
      formatter: (params: any[]) => {
        let res = `${params[0].name}年度<br/>`;
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
      boundaryGap: false,
      data: data.xAxis
    },
    yAxis: {
      type: 'value',
      name: isPercentMetric ? '单位 (%)' : unit,
      splitLine: { lineStyle: { type: 'dashed' } }
    },
    series: data.series.map((s: any) => ({
      name: s.name,
      type: 'line',
      smooth: true,
      showSymbol: true,
      symbolSize: 8,
      data: s.data,
      areaStyle: {
        opacity: 0.1
      }
    })),
    color: ['#1890ff', '#2fc25b', '#facc14', '#223273', '#8543e0']
  };

  return <ReactECharts option={option} style={{ height, width: '100%' }} />;
};

export default CustomLineChart;