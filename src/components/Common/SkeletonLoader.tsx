/**
 * ============================================
 * 文件名称: SkeletonLoader.tsx
 * 文件版本: V1.0
 * 文件用途: 骨架屏加载组件
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 通用骨架屏，用于看板模块和对话区加载状态
 * ============================================
 */



import React from 'react';
import { Skeleton, Card } from 'antd';

interface Props {
  type: 'card' | 'chat' | 'list';
  rows?: number;
}

const SkeletonLoader: React.FC<Props> = ({ type, rows = 3 }) => {
  if (type === 'card') {
    return (
      <Card className="w-full shadow-sm">
        <Skeleton active title={true} paragraph={{ rows: 2 }} />
      </Card>
    );
  }

  if (type === 'chat') {
    return (
      <div className="flex justify-start gap-3 w-full mb-4">
        <Skeleton.Avatar active size="large" shape="circle" />
        <div className="bg-gray-100 p-4 rounded-lg w-[70%]">
          <Skeleton active title={false} paragraph={{ rows: 2, width: ['100%', '60%'] }} />
        </div>
      </div>
    );
  }

  return <Skeleton active paragraph={{ rows }} />;
};

export default SkeletonLoader;