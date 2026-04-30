/**
 * ============================================
 * 文件名称: DashboardPage.tsx
 * 文件版本: V1.1
 * 文件用途: 主页面（看板 + 智能问数），整合左右面板和全局状态
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-21
 * 修改人: aQian (前端开发)
 * 说明: 66%/34% 左右分栏布局的主页面
 * ============================================
 */

import React, { useEffect } from 'react';
import { Layout } from 'antd';
import TopNav from '../components/Layout/TopNav';
import DashboardPanel from '../components/Layout/DashboardPanel';
import ChatPanel from '../components/Layout/ChatPanel';
import ErrorBoundary from '../components/Common/ErrorBoundary';
import NoPermission from '../components/Common/NoPermission';
import { useUiStore } from '../stores/uiStore';
import { useFilterStore } from '../stores/filterStore';
import { useAuthStore } from '../stores/authStore';
import { useDashboardData } from '../hooks/useDashboardData';
import { useChatSSE } from '../hooks/useChatSSE';

const DashboardPage: React.FC = () => {
  const { isChatPanelCollapsed } = useUiStore();
  const { role, authorizedCompanies, isLoaded, fetchPermissions } = useAuthStore();
  const { initCompanies, hasFilterPermission } = useFilterStore();

  // 1. 初始化：获取权限信息
  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  // 2. 权限加载后初始化筛选器
  useEffect(() => {
    if (isLoaded) {
      initCompanies(role, authorizedCompanies);
    }
  }, [isLoaded, role, authorizedCompanies, initCompanies]);

  // 3. 挂载数据获取钩子：监听筛选器变化并自动请求后端 API
  useDashboardData();

  // 4. 挂载 SSE 聊天钩子
  useChatSSE();

  // 5. 处理 ECharts 的响应式适配
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 310); // 略长于 Tailwind 的 duration-300 动画时间
    return () => clearTimeout(timer);
  }, [isChatPanelCollapsed]);

  // 权限未加载时显示占位
  if (!isLoaded) {
    return (
      <Layout className="h-screen w-screen overflow-hidden flex items-center justify-center bg-gray-50">
        <div className="text-gray-400">加载中...</div>
      </Layout>
    );
  }

  if (!hasFilterPermission) {
    return (
      <Layout className="h-screen w-screen overflow-hidden flex flex-col bg-gray-50">
        <TopNav />
        <Layout.Content className="flex-1">
          <NoPermission
            title="权限受限"
            subTitle="当前无可用公司或年度筛选项，请联系管理员为该账号配置筛选器权限。"
          />
        </Layout.Content>
      </Layout>
    );
  }

  return (
    <Layout className="h-screen w-screen overflow-hidden flex flex-col bg-gray-50">
      {/* 顶部导航：筛选器与权限展示 */}
      <TopNav />

      <Layout.Content className="flex-1 flex overflow-hidden relative">
        {/* 左侧看板区：利用 ErrorBoundary 防止局部图表崩溃影响全局 */}
        <ErrorBoundary>
          <div className="flex-1 h-full overflow-hidden relative">
            <DashboardPanel />
          </div>
        </ErrorBoundary>

        {/* 右侧 AI 问数面板 */}
        <ErrorBoundary>
          <ChatPanel />
        </ErrorBoundary>
      </Layout.Content>
    </Layout>
  );
};

export default DashboardPage;
