/**
 * ============================================
 * 文件名称: company.ts
 * 文件版本: V1.0
 * 文件用途: 公司列表 API 接口封装
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 获取19家公司列表，数据缓存在 Store 中
 * ============================================
 */
// import apiClient from './index';

// import type { ApiResponse, CompanyListResponse } from '@/types/api';

// /**
//  * 获取公司列表
//  * @returns 公司编码和名称列表
//  */
// export function fetchCompanies(): Promise<ApiResponse<CompanyListResponse>> {
//   return apiClient.get<ApiResponse<CompanyListResponse>>('/api/companies');
// }


import { request } from './client';

interface BackendCompanyItem {
  company_code: number;
  company_cn_name: string;
  company_en_name?: string | null;
}

export interface CompanyItem {
  company_id: string;
  company_name: string;
}

export const getCompanyList = (): Promise<CompanyItem[]> => {
  return request<BackendCompanyItem[]>({
    url: '/api/companies',
    method: 'GET',
  }).then((items) =>
    (items || []).map((item) => ({
      company_id: String(item.company_code),
      company_name: item.company_cn_name || item.company_en_name || String(item.company_code),
    }))
  );
};