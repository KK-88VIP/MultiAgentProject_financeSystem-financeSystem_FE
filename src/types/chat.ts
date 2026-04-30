import { ChartData } from './dashboard';

export type MessageRole = 'user' | 'system';
export type MessageType = 'text' | 'chart' | 'table' | 'clarification';

export interface TableData {
  columns: { title: string; dataIndex: string }[];
  dataSource: Record<string, any>[];
  title?: string;
}

export interface ClarificationData {
  type: string;
  options: string[];
  message: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  type: MessageType;
  // 扩展属性，根据 type 不同而存在
  chartConfig?: ChartData;
  tableData?: TableData;
  clarification?: ClarificationData;
}