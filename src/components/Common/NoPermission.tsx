/**
 * ============================================
 * 文件名称: NoPermission.tsx
 * 文件版本: V1.0
 * 文件用途: 无权限提示组件（用于无权限页面或模块级无权限展示）
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 展示"您无访问权限"提示
 * ============================================
 */



import React from 'react';
import { Result } from 'antd';
import { LockOutlined } from '@ant-design/icons';

interface Props {
  title?: string;
  subTitle?: string;
}

const NoPermission: React.FC<Props> = ({ 
  title = "权限受限", 
  subTitle = "您暂无权限查看当前公司或年度的财务分析数据，请联系系统管理员进行授权。" 
}) => {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-50">
      <Result
        icon={<LockOutlined className="text-gray-300 text-6xl" />}
        title={<span className="text-gray-600">{title}</span>}
        subTitle={<span className="text-gray-400">{subTitle}</span>}
      />
    </div>
  );
};

export default NoPermission;