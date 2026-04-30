import React, { useState } from 'react';
import { Button, Space } from 'antd';
import { useChatStore } from '../../stores/chatStore';

interface Props {
  data: {
    type: string;
    options: string[];
    message: string;
  };
}

const ClarificationRenderer: React.FC<Props> = ({ data }) => {
  const { sendMessage } = useChatStore();
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (option: string) => {
    setSelected(option);
    // 发送带有消歧标记的消息
    sendMessage(option, {
      clarification: { type: data.type, selection: option },
    });
  };

  return (
    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 space-y-3">
      <p className="text-sm text-blue-800 font-medium">{data.message}</p>
      <Space wrap>
        {data.options.map((opt) => (
          <Button 
            key={opt} 
            size="small" 
            type={selected === opt ? 'primary' : 'default'}
            onClick={() => handleClick(opt)}
            disabled={selected !== null}
          >
            {opt}
          </Button>
        ))}
      </Space>
    </div>
  );
};

export default ClarificationRenderer;