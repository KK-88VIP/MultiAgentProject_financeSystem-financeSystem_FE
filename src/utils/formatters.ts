/**
 * ============================================
 * 文件名称: formatters.ts
 * 文件版本: V1.0
 * 文件用途: 通用数据格式化工具函数
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 数字千分位、日期格式化等通用格式化函数
 * ============================================
 */

/**
 * 数字千分位格式化
 * @param value - 数字
 * @param decimals - 小数位数，默认 2
 * @returns 格式化后的字符串（如 "123,456.78"）
 */
export function formatNumber(value: number, decimals = 2): string {
  if (value == null || Number.isNaN(value)) return '—';
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * 公司名截断（过长时显示省略号）
 * @param name - 公司全名
 * @param maxLength - 最大显示长度，默认 8
 * @returns 截断后的名称
 */
export function truncateCompanyName(name: string, maxLength = 8): string {
  if (name.length <= maxLength) return name;
  return `${name.slice(0, maxLength)}...`;
}
