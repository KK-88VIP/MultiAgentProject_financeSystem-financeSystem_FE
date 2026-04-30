/**
 * ============================================
 * 文件名称: ChatMessageList.tsx
 * 文件版本: V1.0
 * 文件用途: 对话消息列表组件（用户消息 + 系统回复 + 流式渲染 + 图表混合）
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 展示对话历史，支持 SSE 流式文字追加和图表渲染
 * 待确认: SSE sql_generated 事件是否向前端展示
 * ============================================
 */
import React, { useEffect, useRef } from 'react';
import { Avatar, Spin } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import { useChatStore } from '../../stores/chatStore';
import ChatChartRenderer from './ChatChartRenderer';
import ChatTableRenderer from './ChatTableRenderer';
import ClarificationRenderer from './ClarificationRenderer';
import QuickSuggestions from './QuickSuggestions';
import ReactMarkdown from 'react-markdown';

const ChatMessageList: React.FC = () => {
  const { history, isGenerating } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isGenerating]);

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto px-4 py-2 space-y-6 scroll-smooth">
      {history.length === 0 && <QuickSuggestions />}
      
      {history.map((msg) => (
        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`flex max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
            <Avatar 
              icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />} 
              className={msg.role === 'user' ? 'bg-blue-500' : 'bg-indigo-600'}
            />
            <div className={`space-y-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              {/* 文字内容 - 支持 Markdown */}
              {msg.content && (
                <div className={`inline-block p-3 rounded-lg shadow-sm text-sm leading-relaxed ${
                  msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
                }`}>
                  <ReactMarkdown className="markdown-body">{msg.content}</ReactMarkdown>
                </div>
              )}

              {/* 多模态组件渲染 */}
              {msg.type === 'chart' && msg.chartConfig && <ChatChartRenderer config={msg.chartConfig} />}
              {msg.type === 'table' && msg.tableData && <ChatTableRenderer data={msg.tableData} />}
              {msg.type === 'clarification' && msg.clarification && <ClarificationRenderer data={msg.clarification} />}
            </div>
          </div>
        </div>
      ))}

      {/* 正在生成的加载态 */}
      {isGenerating && (
        <div className="flex justify-start gap-3">
          <Avatar icon={<RobotOutlined />} className="bg-indigo-600" />
          <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
            <Spin size="small" tip="思考中..." />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessageList;