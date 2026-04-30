/**
 * ============================================
 * 文件名称: unitConverter.ts
 * 文件版本: V1.0
 * 文件用途: 单位转换工具函数（元→万元、小数→百分比、同比格式化）
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 看板数据展示前的统一单位转换
 * ============================================
 */

/**
 * 元转万元
 * @param value - 原始金额（单位：元）
 * @param decimals - 保留小数位数，默认 2
 * @returns 转换后的金额（单位：万元），保留指定位数小数
 */
export function yuanToWanYuan(value: number, decimals = 2): number {
  if (value == null || Number.isNaN(value)) return 0;
  return Number((value / 10000).toFixed(decimals));
}

/**
 * 小数转百分比
 * @param value - 小数值（如 0.8）
 * @param decimals - 保留小数位数，默认 1
 * @returns 百分比字符串（如 "80.0%"）
 */
export function decimalToPercent(value: number, decimals = 1): string {
  if (value == null || Number.isNaN(value)) return '—';
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 格式化同比变化率
 * @param value - 同比变化率数值（如 5.2 表示 +5.2%）
 * @param decimals - 保留小数位数，默认 1
 * @returns 格式化后的字符串（如 "+5.2%" / "-3.1%" / "—"）
 */
export function formatYoyChange(value: number | null | undefined, decimals = 2): string {
  if (value == null || Number.isNaN(value)) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * 获取同比变化率的颜色
 * @param value - 同比变化率数值
 * @returns 颜色值（上升红色、下降绿色、无变化灰色）
 */
export function getYoyChangeColor(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value) || value === 0) return '#8c8c8c';
  return value > 0 ? '#ff4d4f' : '#52c41a';
}

/**
 * 获取同比变化率的箭头符号
 * @param value - 同比变化率数值
 * @returns 箭头符号（↑ / ↓ / —）
 */
export function getYoyChangeArrow(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value) || value === 0) return '—';
  return value > 0 ? '↑' : '↓';
}
