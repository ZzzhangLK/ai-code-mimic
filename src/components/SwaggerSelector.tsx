import React, { useState } from 'react';
import { Upload, Button, Table, message, Card, Input } from 'antd';
import { UploadOutlined, FileTextOutlined } from '@ant-design/icons';
import { useAppStore } from '../store/useAppStore';
import { swaggerParser } from '../utils/swaggerParser';

export const SwaggerSelector: React.FC = () => {
  const { 
    setSwaggerJson, 
    parsedApiEndpoints, 
    selectedApiIds, 
    toggleApiSelection 
  } = useAppStore();

  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      if (text) {
        try {
          const endpoints = await swaggerParser.parse(text);
          setSwaggerJson(text, endpoints);
          message.success(`成功解析 ${endpoints.length} 个端点。`);
        } catch (err: any) {
          message.error(err.message || '无法解析 JSON');
        }
      }
    };
    reader.readAsText(file);
    return false; //防止自动上传
  };

  const columns = [
    {
      title: '方法',
      dataIndex: 'method',
      key: 'method',
      width: 100,
      render: (text: string) => (
        <span style={{ 
          fontWeight: 'bold', 
          color: text === 'GET' ? '#52c41a' : 
                 text === 'POST' ? '#1890ff' : 
                 text === 'DELETE' ? '#f5222d' : '#fa8c16' 
        }}>
          {text}
        </span>
      ),
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
      ellipsis: true,
    },
    {
      title: '摘要',
      dataIndex: 'summary',
      key: 'summary',
      ellipsis: true,
    },
  ];

  const filteredEndpoints = parsedApiEndpoints.filter(ep => 
    ep.path.toLowerCase().includes(searchText.toLowerCase()) || 
    ep.summary.toLowerCase().includes(searchText.toLowerCase())
  );

  const rowSelection = {
    selectedRowKeys: selectedApiIds,
    onSelect: (record: any, selected: boolean) => {
      toggleApiSelection(record.id, selected);
    },
    onSelectAll: (selected: boolean, selectedRows: any[], changeRows: any[]) => {
      changeRows.forEach(row => toggleApiSelection(row.id, selected));
    },
  };

  return (
    <Card 
      title="1. 选择 API" 
      extra={
        <Upload beforeUpload={handleUpload} showUploadList={false} accept=".json">
          <Button icon={<UploadOutlined />}>上传 Swagger JSON</Button>
        </Upload>
      }
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      bodyStyle={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ marginBottom: 16 }}>
        <Input 
          placeholder="搜索端点..." 
          prefix={<FileTextOutlined />} 
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
      </div>
      
      <Table 
        dataSource={filteredEndpoints} 
        columns={columns} 
        rowKey="id"
        rowSelection={rowSelection}
        pagination={{ 
          pageSize: pageSize, 
          size: 'small',
          current: currentPage,
          showSizeChanger: true,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }
        }}
        scroll={{ y: 'calc(50vh)' }}
        size="small"
      />
    </Card>
  );
};
