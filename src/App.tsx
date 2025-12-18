import React, { useState } from 'react';
import { Layout, Button, Typography, Space, message, theme } from 'antd';
import { SettingOutlined, ThunderboltOutlined, GithubOutlined } from '@ant-design/icons';
import { ConfigModal } from './components/ConfigModal';
import { SwaggerSelector } from './components/SwaggerSelector';
import { CodeEditorArea } from './components/CodeEditorArea';
import { DiffResultViewer } from './components/DiffResultViewer';
import { HistoryList } from './components/HistoryList';
import { useAppStore } from './store/useAppStore';
import { difyService } from './services/difyService';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [configOpen, setConfigOpen] = useState(false);
  
  const { 
    config, 
    parsedApiEndpoints, 
    selectedApiIds, 
    templateCode, 
    setIsGenerating, 
    setGeneratedCode,
    addHistoryRecord 
  } = useAppStore();

  const handleGenerate = async () => {
    // 1. 验证
    if (!config.apiKey || !config.baseUrl) {
      message.warning('请先配置 Dify 设置。');
      setConfigOpen(true);
      return;
    }
    if (selectedApiIds.length === 0) {
      message.warning('请至少选择一个 API 端点。');
      return;
    }
    if (!templateCode || templateCode.trim().length < 10) {
      message.warning('请提供有效的代码模板。');
      return;
    }

    setIsGenerating(true);
    try {
      // 2. 组装提示词
      // 2. 准备 inputs
      const selectedApis = parsedApiEndpoints.filter(ep => selectedApiIds.includes(ep.id));
      const apiContext = selectedApis.map(ep => {
        let ctx = `Endpoint: ${ep.method} ${ep.path}\n`;
        ctx += `Summary: ${ep.summary}\n`;
        if (ep.description) ctx += `Description: ${ep.description}\n`;
        if (ep.parameters) ctx += `Parameters: ${JSON.stringify(ep.parameters, null, 2)}\n`;
        if (ep.requestBody) ctx += `RequestBody: ${JSON.stringify(ep.requestBody, null, 2)}\n`;
        if (ep.responses) ctx += `Responses: ${JSON.stringify(ep.responses, null, 2)}\n`;
        return ctx;
      }).join('\n\n---\n\n');

      // 根据 DIFY_WORKFLOW_DSL.yml 定义的变量
      const inputs = {
        code_template: templateCode,
        api_definitions: apiContext,
        global_interfaces: `
// 分页通用接口
export interface PaginationProps { pageNo: number; pageSize: number; }
// 通用返回接口(分页)
export interface ResponseListType<D> { total: number; list: Array<D>; }
// 通用返回接口（有数据）
export interface ResponseDataType<D> { success: boolean; message: string; data: D; }
// 通用接口封装函数(分页)
export interface InterListFunction<D extends object, T> { (req: D & Partial<PaginationProps>): Promise<ResponseListType<T>> }
// 通用接口封装函数(不分页)
export interface InterFunction<D extends object, T> { (req?: D): Promise<T> }
// 通用接口封装函数(不分页)有data
export interface InterDataFunction<D extends object, T> { (req?: D): Promise<ResponseDataType<T>> }
        `.trim()
      };
 
      // 3. 调用 API
      const generated = await difyService.generateCode(config, inputs);
      
      // 4. 更新结果
      setGeneratedCode(generated);

      // 5. 保存历史
      addHistoryRecord({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        apiNames: selectedApis.map(ep => ep.summary || ep.path),
        originalCode: templateCode,
        generatedCode: generated
      });

      message.success('代码生成成功！');
    } catch (error: unknown) {
      console.error(error);
      message.error((error as any).message || '生成失败。');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 24px',
        background: colorBgContainer,
        borderBottom: '1px solid #f0f0f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            width: 32, height: 32, 
            background: 'linear-gradient(135deg, #1890ff 0%, #0050b3 100%)', 
            borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 18
          }}>
            AI
          </div>
          <Title level={4} style={{ margin: 0 }}>AI 代码模仿工具</Title>
        </div>
        
        <Space>
           <Button icon={<GithubOutlined />} href="https://github.com/your-repo" target="_blank" type="text"/>
           <Button 
             type="primary" 
             icon={<ThunderboltOutlined />} 
             onClick={handleGenerate}
             size="large"
            >
              生成代码
            </Button>
            <Button 
              icon={<SettingOutlined />} 
              onClick={() => setConfigOpen(true)}
            >
              设置
            </Button>
        </Space>
      </Header>
      
      <Layout>
        <Sider 
          width={300} 
          theme="light" 
          style={{ borderRight: '1px solid #f0f0f0', overflow: 'hidden' }}
        >
          <HistoryList />
        </Sider>
        
        <Content style={{ padding: '16px', height: 'calc(100vh - 64px)', overflow: 'auto' }}>
          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignContent: 'flex-start'
          }}>
            {/* 第一行：Swagger 选择 - 占据100%宽度 */}
            <div style={{ 
              width: '100%', 
              minWidth: '300px',
              height: 'calc(80vh - 40px)',
              overflow: 'hidden' 
            }}>
               <SwaggerSelector />
            </div>

            {/* 第二行左：模板输入 - 占据50%宽度 */}
            <div style={{ 
              width: 'calc(50% - 8px)', 
              minWidth: '300px',
              height: 'calc(96vh - 56px)',
              overflow: 'hidden' 
            }}>
               <CodeEditorArea />
            </div>

            {/* 第二行右：Diff / 结果 - 占据50%宽度 */}
            <div style={{ 
              width: 'calc(50% - 8px)', 
              minWidth: '300px',
              height: 'calc(96vh - 56px)',
              overflow: 'hidden' 
            }}>
               <DiffResultViewer />
            </div>
          </div>
        </Content>
      </Layout>

      <ConfigModal 
        open={configOpen} 
        onClose={() => setConfigOpen(false)} 
      />
    </Layout>
  );
};

export default App;
