/**
 * ============================================
 * 文件名称: main.tsx
 * 文件版本: V1.0
 * 文件用途: React 应用入口文件，负责渲染根组件到 DOM
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 财务数据分析看板项目入口
 * ============================================
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 样式引入顺序：Tailwind -> AntD -> 自定义样式
import './styles/tailwind.css'; 
import 'antd/dist/reset.css'; // Ant Design 5.x 的重置样式
import './styles/global.css';

/**
 * 使用 React 18 的 createRoot 开启并发渲染能力。
 * Concurrent Mode 对于具有频繁图表更新和流式文字输出的 AI 看板至关重要。
 */
const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}