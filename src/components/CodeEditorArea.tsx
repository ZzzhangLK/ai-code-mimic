import React from 'react';
import Editor from '@monaco-editor/react';
import { Card } from 'antd';
import { useAppStore } from '../store/useAppStore';

export const CodeEditorArea: React.FC = () => {
  const { templateCode, setTemplateCode } = useAppStore();

  const handleEditorChange = (value: string | undefined) => {
    setTemplateCode(value || '');
  };

  return (
    <Card 
      title="2. 输入模板代码" 
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      bodyStyle={{ flex: 1, padding: 0, minHeight: 400 }}
    >
      <Editor
        height="100%"
        defaultLanguage="typescript"
        value={templateCode}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: 'on',
        }}
      />
    </Card>
  );
};
