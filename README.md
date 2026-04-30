# finance-dashboard

财务数据分析看板与智能问数系统（前端）。

## 环境要求

- Node.js 18+
- npm 9+

## 本地启动

```bash
npm install
npm run dev
```

默认启动后访问 Vite 本地地址（通常是 `http://localhost:5173`）。

## 关键脚本

- `npm run dev`：启动开发服务器
- `npm run build`：执行 TypeScript 构建检查并打包
- `npm run preview`：本地预览生产构建结果
- `npm run lint`：运行 ESLint 静态检查

## 环境变量

项目会读取以下变量（可放在 `.env.development` 或 `.env.production`）：

- `VITE_API_BASE_URL`：后端 API 根地址，默认 `http://localhost:8080`
- `VITE_DEFAULT_USER_ID`：默认用户标识（请求头 `X-User-ID`）

## 项目结构（节选）

```text
src/
  api/         # API 封装
  components/  # 业务组件
  hooks/       # 自定义 hooks（含 SSE 问数流）
  pages/       # 页面级组件
  stores/      # Zustand 状态管理
  types/       # 类型定义
  utils/       # 工具函数
```
