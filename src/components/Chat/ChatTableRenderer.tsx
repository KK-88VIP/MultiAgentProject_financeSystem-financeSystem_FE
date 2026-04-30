/**
 * ============================================
 * 文件名称: ChatTableRenderer.tsx
 * 文件版本: V1.0
 * 文件用途: 对话区表格渲染组件（根据 table_data 渲染 Ant Design Table）
 * 创建时间: 2026-04-21
 * 最新修改: 2026-04-21
 * 修改人: aQian (前端开发)
 * 说明: 在对话消息中渲染后端返回的表格数据
 * ============================================
 */

import React from 'react';
import { Table, Card, Empty } from 'antd';

interface Props {
  data: {
    columns: { title: string; dataIndex: string; key?: string }[];
    dataSource: Record<string, any>[];
    title?: string;
  };
}

const ChatTableRenderer: React.FC<Props> = ({ data }) => {
  if (!data || !data.columns || !data.dataSource) {
    return <div className="text-gray-400 text-sm">暂无表格数据</div>;
  }

  const columns = data.columns.map((col) => ({
    ...col,
    key: col.key || col.dataIndex,
  }));

  return (
    <Card
      size="small"
      className="w-full bg-white border-gray-200 shadow-sm"
      title={
        data.title ? (
          <span className="text-xs font-medium text-gray-500">{data.title}</span>
        ) : undefined
      }
    >
      {data.dataSource.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={data.title || '本次查询无数据'}
        />
      ) : (
        <Table
          columns={columns}
          dataSource={data.dataSource}
          size="small"
          pagination={false}
          scroll={{ x: 'max-content' }}
          rowKey={(_, index) => String(index)}
        />
      )}
    </Card>
  );
};

export default ChatTableRenderer;
