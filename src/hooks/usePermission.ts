/**
 * ============================================
 * 文件名称: usePermission.ts
 * 文件版本: V1.1
 * 文件用途: 权限状态自定义 Hook
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-21
 * 修改人: aQian (前端开发)
 * 说明: 页面初始化时调用权限接口，将结果写入 authStore
 * ============================================
 */

import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export const usePermission = () => {
  const { role, authorizedCompanies, fetchPermissions } = useAuthStore();

  // 初始化时获取权限信息
  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const isManager = role === 'management';
  const isSubFinance = role === 'sub_company_finance';

  const canModifyCompanies = isManager;
  const hasAccessTo = (companyId: string) =>
    isManager || authorizedCompanies.includes(companyId);

  return { isManager, isSubFinance, canModifyCompanies, hasAccessTo };
};
