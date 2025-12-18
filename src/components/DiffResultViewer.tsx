import { Editor } from '@monaco-editor/react';
import { Card } from 'antd';
import { useAppStore } from '../store/useAppStore';

export const DiffResultViewer: React.FC = () => {
  const { templateCode, generatedCode } = useAppStore();

  return (
    <Card
      title="3. 审查结果"
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      bodyStyle={{ flex: 1, padding: 0, minHeight: 500 }}
    >
      <Editor
        height="100%"
        value={generatedCode || templateCode} // 如果尚未产生结果，则显示原始内容
        language="typescript"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          readOnly: true,
        }}
      />
    </Card>
  );
};
