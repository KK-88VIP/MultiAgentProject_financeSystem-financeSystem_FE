/**
 * 消费 POST /api/dashboard/dsl/render 返回的 widgets，按 chart_type 选用现有图表组件
 */
import React from 'react';
import { Card, Tag } from 'antd';
import type { DslRenderWidget } from '../../api/dashboard';
import CustomBarChart from '../Chart/CustomBarChart';
import CustomLineChart from '../Chart/CustomLineChart';
import CustomRingChart from '../Chart/CustomRingChart';

interface Props {
  widgets: DslRenderWidget[];
  loading?: boolean;
}

function toBarLineData(chart: NonNullable<DslRenderWidget['chart']>) {
  const xs = (chart.x_axis || []).map((x) => String(x));
  const ys = (chart.y_axis || []).map((v) => Number(Number(v).toFixed(2)));
  const name = chart.y_field || chart.metric_name || '指标';
  return {
    xAxis: xs,
    series: [{ name, data: ys }],
    unit: chart.unit || '亿元',
  };
}

function toRingData(chart: NonNullable<DslRenderWidget['chart']>) {
  const labels = (chart.x_axis || []).map(String);
  const values = chart.y_axis || [];
  const metricName = chart.y_field || chart.metric_name || '结构';
  const series = labels.map((name, idx) => ({
    name: `${metricName}-${name}`,
    value: Number((values[idx] ?? 0).toFixed(2)),
  }));
  return { series };
}

const DslWidgetGrid: React.FC<Props> = ({ widgets, loading }) => {
  const list = widgets.filter((w) => w.chart);

  if (list.length === 0) {
    return (
      <Card size="small" className="text-gray-500">
        DSL 看板暂无图表组件数据（widgets 为空或缺少 chart）
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {list.map((w) => {
        const chart = w.chart!;
        const type = (chart.chart_type || '').toLowerCase();
        const cacheTag = w.cache === true ? <Tag color="green">缓存</Tag> : null;

        let inner: React.ReactNode = null;
        if (type === 'bar') {
          inner = <CustomBarChart data={toBarLineData(chart)} loading={loading} height={320} />;
        } else if (type === 'line') {
          inner = <CustomLineChart data={toBarLineData(chart)} loading={loading} height={320} />;
        } else if (type === 'ring' || type === 'pie') {
          inner = <CustomRingChart data={toRingData(chart)} loading={loading} height={320} />;
        } else {
          inner = (
            <div className="text-gray-500 text-sm p-4">
              暂不支持的图表类型：<code>{chart.chart_type}</code>
            </div>
          );
        }

        return (
          <Card key={w.widget_id} size="small" title={<span className="text-base">{w.widget_id}</span>} extra={cacheTag}>
            {inner}
          </Card>
        );
      })}
    </div>
  );
};

export default DslWidgetGrid;
