/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_DEFAULT_USER_ID: string;
  /** 与后端一致：admin | user，用于 X-User-Role */
  readonly VITE_DEFAULT_USER_ROLE: string;
  /** true 时看板主路径走 POST /api/dashboard/dsl/render */
  readonly VITE_USE_DSL_RENDER: string;
  /** DSL 渲染所需的 dashboard_id（VITE_USE_DSL_RENDER=true 时必填） */
  readonly VITE_DASHBOARD_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
