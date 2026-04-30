/**
 * ============================================
 * 文件名称: filterStore.ts
 * 文件版本: V1.1
 * 文件用途: 筛选器状态全局 Store（公司、年度选择）
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-21
 * 修改人: aQian (前端开发)
 * 说明: 管理顶部筛选器的选中状态，变更时联动触发看板刷新
 * ============================================
 */

import { create } from 'zustand';
import { getCompanyList, CompanyItem } from '../api/company';
import { getAvailableYears, getFilterOptions } from '../api/dashboard';

interface FilterState {
  selectedCompany?: string;
  selectedYear?: number;
  yearOptions: number[];
  companyList: CompanyItem[];
  hasFilterPermission: boolean;
  setCompany: (id?: string) => void;
  setYear: (year?: number) => void;
  fetchCompanyList: () => Promise<void>;
  fetchYearOptions: () => Promise<void>;
  fetchFilterOptions: () => Promise<void>;
  // 初始化时根据权限设置默认选中
  initCompanies: (role: string, authorizedCompanies: string[]) => void;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  selectedCompany: undefined,
  selectedYear: undefined,
  yearOptions: [2025, 2024, 2023, 2022],
  companyList: [],
  hasFilterPermission: true,
  setCompany: (selectedCompany) => set({ selectedCompany }),
  setYear: (selectedYear) => set({ selectedYear }),
  fetchCompanyList: async () => {
    try {
      const list = await getCompanyList();
      set({ companyList: list });
    } catch (e) {
      console.error('Failed to fetch companies', e);
    }
  },
  fetchYearOptions: async () => {
    try {
      const years = await getAvailableYears();
      if (years.length === 0) {
        return;
      }
      set((state) => ({
        yearOptions: years,
        selectedYear: years.includes(state.selectedYear || -1) ? state.selectedYear : years[0],
      }));
    } catch (e) {
      // 后端未提供年度接口时，前端回退到内置年份配置
      console.warn('Failed to fetch year options, fallback to local options', e);
      set((state) => ({
        selectedYear: state.selectedYear || state.yearOptions[0],
      }));
    }
  },
  fetchFilterOptions: async () => {
    try {
      const { companies, years } = await getFilterOptions();
      const hasFilterPermission = companies.length > 0 && years.length > 0;

      if (!hasFilterPermission) {
        set({
          companyList: [],
          yearOptions: [],
          selectedCompany: undefined,
          selectedYear: undefined,
          hasFilterPermission: false,
        });
        return;
      }

      const selectedCompany = [...companies]
        .sort((a, b) => Number(a.company_id) - Number(b.company_id))[0]?.company_id;
      const selectedYear = years[0];
      set({
        companyList: companies,
        yearOptions: years,
        selectedCompany,
        selectedYear,
        hasFilterPermission: true,
      });
    } catch (e) {
      // 兼容后端未完成筛选器接口时，前端回退旧逻辑
      console.warn('Failed to fetch unified filter options, fallback to legacy APIs', e);
      await Promise.all([get().fetchCompanyList(), get().fetchYearOptions()]);
      const { companyList, yearOptions } = get();
      const hasFilterPermission = companyList.length > 0 && yearOptions.length > 0;
      set((state) => ({
        selectedCompany: state.selectedCompany || companyList[0]?.company_id,
        selectedYear: state.selectedYear || yearOptions[0],
        hasFilterPermission,
      }));
    }
  },
  initCompanies: (role, authorizedCompanies) => {
    const { companyList, yearOptions, hasFilterPermission } = get();
    if (!hasFilterPermission) {
      set({
        selectedCompany: undefined,
        selectedYear: undefined,
      });
      return;
    }
    const availableCompanyIds = role === 'management'
      ? companyList.map((c) => c.company_id)
      : (authorizedCompanies.length > 0 ? authorizedCompanies : companyList.map((c) => c.company_id));
    const selectedCompany = [...availableCompanyIds].sort((a, b) => Number(a) - Number(b))[0] || companyList[0]?.company_id;
    set((state) => ({
      selectedCompany: selectedCompany || state.selectedCompany,
      selectedYear: state.selectedYear || yearOptions[0],
    }));
  },
}));
