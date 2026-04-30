/**
 * ============================================
 * 文件名称: QuickSuggestions.tsx
 * 文件版本: V1.0
 * 文件用途: 快捷问题建议组件（胶囊按钮展示推荐问题）
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 首次进入或清空对话后展示，点击直接发送
 * 待确认: 点击后是否从列表中移除
 * ============================================
 */



import React from 'react';
import { Tag, Typography } from 'antd';
import { BulbOutlined } from '@ant-design/icons';
import { useChatStore } from '../../stores/chatStore';

const { Text } = Typography;

const QuickSuggestions: React.FC = () => {
  const { sendMessage } = useChatStore();
  
  const suggestions = [
    "分析2024年总资产排名前五的公司",
    "展示腾讯近三年的净利润趋势",
    "对比阿里和京东的经营性现金流",
    "帮我看看哪些公司存在财务风险"
  ];

  return (
    <div className="py-6 flex flex-col items-center justify-center space-y-4">
      <div className="flex items-center gap-2 text-gray-400">
        <BulbOutlined />
        <Text type="secondary">您可以这样问我</Text>
      </div>
      <div className="flex flex-wrap justify-center gap-2 max-w-sm">
        {suggestions.map((s, index) => (
          <Tag 
            key={index} 
            className="cursor-pointer px-4 py-1 rounded-full border-blue-100 hover:border-blue-400 hover:bg-blue-50 transition-colors"
            onClick={() => sendMessage(s)}
          >
            {s}
          </Tag>
        ))}
      </div>
    </div>
  );
};

export default QuickSuggestions;