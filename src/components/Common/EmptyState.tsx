/**
 * ============================================
 * 文件名称: EmptyState.tsx
 * 文件版本: V1.0
 * 文件用途: 空状态组件（无数据时的提示展示）
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 通用空状态展示，支持自定义描述和操作按钮
 * ============================================
 */


import React from 'react';
import { Empty, Button } from 'antd';

interface Props {
  message?: string;
  description?: string;
  onRetry?: () => void;
}

const EmptyState: React.FC<Props> = ({ 
  message = "暂无数据", 
  description = "请调整筛选条件或稍后再试", 
  onRetry 
}) => {
  return (
    <div className="h-full w-full flex items-center justify-center p-8 bg-white rounded-lg border border-dashed border-gray-200">
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div className="space-y-1">
            <p className="text-gray-500 font-medium">{message}</p>
            <p className="text-gray-400 text-xs">{description}</p>
          </div>
        }
      >
        {onRetry && (
          <Button type="primary" ghost onClick={onRetry} size="small">
            重新加载
          </Button>
        )}
      </Empty>
    </div>
  );
};

export default EmptyState;