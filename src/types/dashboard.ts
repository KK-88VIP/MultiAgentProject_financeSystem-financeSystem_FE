// KPI 指标数据
export interface KPIItem {
  value: number;
  yoy_change?: number; // 同比增长率（可选，单年度不展示）
  unit?: string;
}

export interface KPIData {
  [key: string]: KPIItem; // 例如 { total_assets: { value: 100, yoy_change: 5.2 } }
}

// 图表通用数据结构
export interface ChartSeries {
  name: string;
  data: number[];
}

export interface ChartData {
  title?: string;
  xAxis?: string[];
  series: ChartSeries[] | any[]; // 兼容饼图结构
  unit?: string;
}