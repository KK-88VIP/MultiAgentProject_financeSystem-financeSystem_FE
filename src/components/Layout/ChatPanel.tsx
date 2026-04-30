/**
 * ============================================
 * 文件名称: ChatPanel.tsx
 * 文件版本: V1.0
 * 文件用途: 右侧智能问数面板容器（可折叠/展开）
 * 创建时间: 2026-04-20
 * 最新修改: 2026-04-20
 * 修改人: aQian (前端开发)
 * 说明: 占约 34% 宽度，包含对话消息列表、输入框、快捷问题
 * ============================================
 */



import React from 'react';
import { Button, Tooltip } from 'antd';
import { RightOutlined, LeftOutlined, MessageOutlined, DeleteOutlined } from '@ant-design/icons';
import { useUiStore } from '../../stores/uiStore';
import { useChatStore } from '../../stores/chatStore';
import ChatMessageList from '../Chat/ChatMessageList';
import ChatInput from '../Chat/ChatInput';

const ChatPanel: React.FC = () => {
  const { isChatPanelCollapsed, toggleChatPanel } = useUiStore();
  const { clearHistory, history } = useChatStore();

  return (
    <div 
      className={`relative h-full bg-white border-l shadow-xl flex flex-col transition-all duration-300 ease-in-out ${
        isChatPanelCollapsed ? 'w-0 overflow-hidden' : 'w-[34%]'
      }`}
      style={{ minWidth: isChatPanelCollapsed ? 0 : '400px' }}
    >
      {/* 折叠控制按钮 - 挂在面板左边缘 */}
      <div className="absolute top-1/2 -left-4 z-10 -translate-y-1/2">
        <Tooltip title={isChatPanelCollapsed ? "展开问数" : "收起面板"}>
          <Button
            shape="circle"
            size="small"
            icon={isChatPanelCollapsed ? <LeftOutlined /> : <RightOutlined />}
            onClick={toggleChatPanel}
            className="shadow-md border-gray-200"
          />
        </Tooltip>
      </div>

      {!isChatPanelCollapsed && (
        <>
          {/* 面板头部 */}
          <div className="px-4 py-3 border-b flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-2 text-blue-600">
              <MessageOutlined />
              <span className="font-bold text-gray-800">智能财务助手</span>
            </div>
            {history.length > 0 && (
              <Button 
                type="text" 
                size="small" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={clearHistory}
              >
                新对话
              </Button>
            )}
          </div>

          {/* 消息列表区 - 自动撑开 */}
          <div className="flex-1 overflow-hidden relative">
            <ChatMessageList />
          </div>

          {/* 输入框区 */}
          <div className="p-4 border-t bg-white">
            <ChatInput />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPanel;