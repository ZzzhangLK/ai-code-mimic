import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { useAppStore } from '../store/useAppStore';
import { difyService } from '../services/difyService';

interface ConfigModalProps {
  open: boolean;
  onClose: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const { config, setConfig } = useAppStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      form.setFieldsValue(config);
    }
  }, [open, config, form]);

  const handleSave = async (values: { baseUrl: string; apiKey: string }) => {
    setLoading(true);
    try {
      // 基本验证或连接检查
      const newConfig = { baseUrl: values.baseUrl, apiKey: values.apiKey };
      
      // 可选：保存前检查连接
      // await difyService.checkConnection(newConfig); 
      
      setConfig(newConfig);
      message.success('设置保存成功！');
      onClose();
    } catch (error) {
      message.error('验证设置失败。请检查您的输入。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Dify 代理设置"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={config}
      >
        <Form.Item
          label="Dify API 基础 URL"
          name="baseUrl"
          rules={[{ required: true, message: '请输入基础 URL' }]}
          tooltip="例如：https://api.dify.ai/v1"
        >
          <Input placeholder="https://api.dify.ai/v1" />
        </Form.Item>

        <Form.Item
          label="API 密钥"
          name="apiKey"
          rules={[{ required: true, message: '请输入您的 API 密钥' }]}
        >
          <Input.Password placeholder="请输入您的 Dify API 密钥" />
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存并验证
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};
