/**
 * ============================================
 * 文件名称: ErrorBoundary.tsx
 * 文件版本: V1.0
 * 文件用途: 错误边界组件（捕获子组件渲染错误并展示友好提示）
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: React 错误边界，防止单个模块崩溃导致整个页面白屏
 * 待确认: 错误重试的具体行为（单模块重试 vs 全部重试）
 * ============================================
 */



import { Component, ErrorInfo, ReactNode } from 'react';
import { Result, Button } from 'antd';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 flex justify-center bg-white rounded-lg border">
          <Result
            status="error"
            title="组件加载失败"
            subTitle="抱歉，该模块在渲染时发生了异常。"
            extra={[
              <Button type="primary" key="reload" onClick={() => window.location.reload()}>
                刷新页面
              </Button>,
            ]}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
