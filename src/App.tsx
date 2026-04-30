/**
 * ============================================
 * 文件名称: App.tsx
 * 文件版本: V1.1
 * 文件用途: 应用根组件，配置路由与全局 Provider
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-21
 * 修改人: aQian (前端开发)
 * 说明: 包含路由配置（DashboardPage / NoPermissionPage）
 * ============================================
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

// 页面组件
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Ant Design 5.x 动态主题配置
 * 这里的 Token 应当与 Tailwind 的色彩系统对齐
 */
const themeConfig = {
  token: {
    colorPrimary: '#2563eb', // Tailwind blue-600
    borderRadius: 6,
    colorInfo: '#2563eb',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      headerPadding: '0 16px',
    },
    Card: {
      boxShadowTertiary: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    },
  },
};

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN} theme={themeConfig}>
      <Router>
        <Routes>
          {/* 默认进入看板页 */}
          <Route path="/" element={<DashboardPage />} />

          {/* 404 及异常路由处理 */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;
