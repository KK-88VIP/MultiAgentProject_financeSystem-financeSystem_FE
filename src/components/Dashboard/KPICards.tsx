/**
 * ============================================
 * 文件名称: KPICards.tsx
 * 文件版本: V1.0
 * 文件用途: 指标卡区域组件（总资产、营业收入、净利润、经营性现金流）
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 4 张卡片等宽排列，展示最新年度数值 + 同比变化率
 * ============================================
 */


import React from 'react';
import { Card, Statistic, Row, Col, Skeleton } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useDashboardStore } from '../../stores/dashboardStore';
import { formatYoyChange } from '../../utils/unitConverter';

const KPICards: React.FC = () => {
  const { kpiData, isLoading } = useDashboardStore();

  // 指标配置定义
  const metrics = [
    { title: '总资产', key: 'total_assets', color: '#1890ff' },
    { title: '营业收入', key: 'revenue', color: '#722ed1' },
    { title: '净利润', key: 'net_profit', color: '#13c2c2' },
    { title: '经营性现金流', key: 'operating_cashflow', color: '#fa8c16' },
  ];

  if (isLoading && !kpiData) {
    return <Skeleton active paragraph={{ rows: 2 }} />;
  }

  return (
    <Row gutter={16}>
      {metrics.map((m) => {
        const item = kpiData?.[m.key];
        const isUp = item?.yoy_change > 0;
        const isDown = item?.yoy_change < 0;

        return (
          <Col span={6} key={m.key}>
            <Card bordered={false} className="shadow-sm">
              <Statistic
                title={<span className="text-gray-500">{m.title}</span>}
                value={item?.value || 0}
                precision={2}
                suffix={item?.unit || '亿元'}
                valueStyle={{ color: '#1f1f1f', fontWeight: 'bold' }}
              />
              <div className="mt-2 flex items-center text-sm">
                <span className="text-gray-400 mr-2">同比</span>
                {item?.yoy_change !== undefined ? (
                  <span style={{ color: isUp ? '#ff4d4f' : isDown ? '#52c41a' : '#8c8c8c' }}>
                    {isUp ? <ArrowUpOutlined /> : isDown ? <ArrowDownOutlined /> : null}
                    {formatYoyChange(item.yoy_change)}
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default KPICards;