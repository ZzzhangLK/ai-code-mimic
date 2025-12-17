import React from 'react';
import { List, Typography, Button, Popconfirm, Card } from 'antd';
import { DeleteOutlined, HistoryOutlined, ReloadOutlined } from '@ant-design/icons';
import { useAppStore } from '../store/useAppStore';
import type { HistoryRecord } from '../store/useAppStore';

const { Text } = Typography;

export const HistoryList: React.FC = () => {
  const { history, restoreFromHistory, clearHistory } = useAppStore();

  return (
    <Card 
        title={<span><HistoryOutlined /> 历史记录</span>}
        extra={
            history.length > 0 && (
                <Popconfirm title="清除所有历史记录？" onConfirm={clearHistory}>
                    <Button type="text" icon={<DeleteOutlined />} danger />
                </Popconfirm>
            )
        }
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        bodyStyle={{ flex: 1, overflowY: 'auto', padding: '12px' }}
    >
      <List
        itemLayout="vertical"
        dataSource={history}
        renderItem={(item: HistoryRecord) => (
          <List.Item
            style={{ 
                background: '#fafafa', 
                marginBottom: '8px', 
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #f0f0f0' 
            }}
            actions={[
                <Button 
                    type="link" 
                    size="small" 
                    icon={<ReloadOutlined />} 
                    onClick={() => restoreFromHistory(item)}
                >
                    恢复
                </Button>
            ]}
          >
            <List.Item.Meta
              title={<Text strong>{new Date(item.timestamp).toLocaleString()}</Text>}
              description={
                <div>
                   <Text type="secondary" style={{ fontSize: '12px' }}>
                       API: {item.apiNames.length > 0 ? item.apiNames.join(', ') : '无'}
                   </Text>
                </div>
              }
            />
          </List.Item>
        )}
      />
      {history.length === 0 && (
          <div style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>
              暂无历史记录
          </div>
      )}
    </Card>
  );
};
