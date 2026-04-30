/**
 * ============================================
 * 文件名称: auth.ts
 * 文件版本: V1.0
 * 文件用途: 权限相关 API 接口封装
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 获取用户角色和授权公司信息
 * 待确认: MVP 阶段 user_id 的获取方式
 * ============================================
 */
// import apiClient from './index';

// import type { ApiResponse, PermissionData } from '@/types/api';

// /**
//  * 获取用户权限信息
//  * @returns 用户角色和授权公司列表
//  */
// export function fetchPermissions(): Promise<ApiResponse<PermissionData>> {
//   return apiClient.get<ApiResponse<PermissionData>>('/api/auth/permissions');
// }

import { request } from './client';
import { BackendPermissionResponse, UserPermission } from '../types/auth';

export const getPermissions = (): Promise<UserPermission> => {
  const userId = import.meta.env.VITE_DEFAULT_USER_ID || 'user_001';
  return request<BackendPermissionResponse>({
    url: '/api/auth/permissions',
    method: 'GET',
    params: {
      user_id: userId,
    },
  }).then((data) => {
    const mappedRole = data.role === 'admin' || data.role === 'system_admin'
      ? 'management'
      : 'sub_company_finance';

    return {
      role: mappedRole,
      authorizedCompanies: (data.authorized_companies || []).map((company) => String(company)),
      permissions: data.allowed ? ['dashboard:read'] : [],
    };
  });
};