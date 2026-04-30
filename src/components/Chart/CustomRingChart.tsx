/**
 * ============================================
 * 文件名称: CustomRingChart.tsx
 * 文件版本: V1.0
 * 文件用途: 封装环形图 ECharts 组件（资产结构 / 风险标识双模式）
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 通用环形图封装，支持两种数据模式的渲染
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

const CustomRingChart: React.FC<Props> = ({ data, loading, height = '100%' }) => {
  if (loading) return <div className="flex justify-center items-center h-full"><Spin /></div>;
  if (!data || !data.series) return <div className="flex justify-center items-center h-full text-gray-400">暂无数据</div>;

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => `指标：${params.name}<br/>数值：<b>${Number(params.value).toFixed(2)}</b><br/>占比：${Number(params.percent).toFixed(2)}%`,
    },
    legend: { orient: 'vertical', left: 'left', top: 'center', textStyle: { fontSize: 12 } },
    series: [
      {
        name: '占比分析',
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: {
          label: { show: true, fontSize: 16, fontWeight: 'bold' }
        },
        labelLine: { show: false },
        data: data.series // 格式：[{ value: 1048, name: 'Search Engine' }, ...]
      }
    ],
    color: ['#1890ff', '#13c2c2', '#ff4d4f', '#faad14', '#722ed1']
  };

  return <ReactECharts option={option} style={{ height, width: '100%' }} />;
};

export default CustomRingChart;