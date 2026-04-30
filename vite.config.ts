/**
 * ============================================
 * 文件名称: vite.config.ts
 * 文件版本: V1.0
 * 文件用途: Vite 构建工具配置文件，包含别名、插件、代理等
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 财务数据分析看板项目 Vite 配置
 * ============================================
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server:  {
    port: 3000,
    host: '127.0.0.1',
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
});
