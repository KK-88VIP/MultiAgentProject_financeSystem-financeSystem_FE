/**
 * ============================================
 * 文件名称: useScreenFilter.ts
 * 文件版本: V1.0
 * 文件用途: 筛选器状态与联动逻辑 Hook
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 管理筛选器变更的防抖、AbortController 取消等逻辑
 * 待确认: 筛选器变更后的具体刷新范围
 * ============================================
 */



import { useEffect, useState } from 'react';
import { useFilterStore } from '../stores/filterStore';

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export const useScreenFilter = (delay = 300) => {
  const { selectedCompany, selectedYear } = useFilterStore();
  const debouncedCompany = useDebouncedValue(selectedCompany, delay);
  const debouncedYear = useDebouncedValue(selectedYear, delay);

  // 此处主要用于同步，如果需要更复杂的联动逻辑可在此扩展
  return {
    company: debouncedCompany,
    year: debouncedYear
  };
};