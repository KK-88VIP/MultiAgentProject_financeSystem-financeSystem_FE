/**
 * ============================================
 * 文件名称: authStore.ts
 * 文件版本: V1.1
 * 文件用途: 权限状态全局 Store（角色、授权公司、用户ID）
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-21
 * 修改人: aQian (前端开发)
 * 说明: 使用 Zustand 管理用户权限状态
 * ============================================
 */

import { create } from 'zustand';
import { getPermissions } from '../api/auth';

interface AuthState {
  role: 'management' | 'sub_company_finance';
  authorizedCompanies: string[];
  permissions: string[];
  isLoaded: boolean;
  setAuth: (auth: Partial<AuthState>) => void;
  fetchPermissions: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: 'management',
  authorizedCompanies: [],
  permissions: [],
  isLoaded: false,
  setAuth: (auth) => set((state) => ({ ...state, ...auth })),
  fetchPermissions: async () => {
    try {
      const data = await getPermissions();
      set({
        role: data.role,
        authorizedCompanies: data.authorizedCompanies,
        permissions: data.permissions,
        isLoaded: true,
      });
    } catch (e) {
      console.error('Failed to fetch permissions:', e);
      // MVP 阶段失败时使用默认值
      set({ isLoaded: true });
    }
  },
}));
