/**
 * ============================================
 * 文件名称: ChatInput.tsx
 * 文件版本: V1.0
 * 文件用途: 对话输入框组件（文本输入 + 发送按钮 + 停止按钮）
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 支持 Enter 发送、Shift+Enter 换行、SSE 响应期间显示停止按钮
 * ============================================
 */



import React, { useState, KeyboardEvent } from 'react';
import { Input, Button, Tooltip } from 'antd';
import { SendOutlined, StopOutlined } from '@ant-design/icons';
import { useChatStore } from '../../stores/chatStore';

const { TextArea } = Input;

const ChatInput: React.FC = () => {
  const [text, setText] = useState('');
  const { isGenerating, sendMessage, stopGeneration } = useChatStore();

  const handleSend = () => {
    if (!text.trim() || isGenerating) return;
    sendMessage(text);
    setText('');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative">
      <TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="请输入您想查询的财务问题，如：对比腾讯2024年的营收和利润"
        autoSize={{ minRows: 2, maxRows: 6 }}
        className="pr-12 py-3 border-gray-200 focus:shadow-none resize-none"
        disabled={isGenerating}
      />
      <div className="absolute right-2 bottom-2">
        {isGenerating ? (
          <Tooltip title="停止生成">
            <Button 
              type="primary" 
              danger 
              shape="circle" 
              icon={<StopOutlined />} 
              onClick={stopGeneration} 
            />
          </Tooltip>
        ) : (
          <Button
            type="primary"
            shape="circle"
            icon={<SendOutlined />}
            disabled={!text.trim()}
            onClick={handleSend}
            className="bg-blue-600"
          />
        )}
      </div>
    </div>
  );
};

export default ChatInput;