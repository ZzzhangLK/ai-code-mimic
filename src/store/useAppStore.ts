import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ------------------------------------------------------------------
// 类型定义
// ------------------------------------------------------------------

export interface HistoryRecord {
  id: string;
  timestamp: number;
  apiNames: string[];
  originalCode: string;
  generatedCode: string;
}

export interface DifyConfig {
  baseUrl: string;
  apiKey: string;
}

interface AppState {
  // 配置
  config: DifyConfig;
  setConfig: (config: DifyConfig) => void;

  // 任务数据与选择
  uploadedSwaggerJson: string | null; // 原始 JSON 字符串
  parsedApiEndpoints: ApiEndpoint[]; // 解析后的端点摘要
  selectedApiIds: string[]; // 选中的 API ID
  templateCode: string; // 用户输入的模板代码

  // 执行结果
  generatedCode: string;
  isGenerating: boolean;

  // 历史记录
  history: HistoryRecord[];

  // 动作
  setSwaggerJson: (json: string, endpoints: ApiEndpoint[]) => void;
  toggleApiSelection: (id: string, selected: boolean) => void;
  setTemplateCode: (code: string) => void;
  setGeneratedCode: (code: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  addHistoryRecord: (record: HistoryRecord) => void;
  restoreFromHistory: (record: HistoryRecord) => void;
  clearHistory: () => void;
}

export interface ApiEndpoint {
  id: string; // 方法 + 路径
  path: string;
  method: string;
  summary: string;
  description?: string;
  parameters?: any[]; // 接口入参定义 (Query, Path, Header 等)
  requestBody?: any; // 接口请求体定义
  responses?: any; // 接口出参定义 (状态码 -> Schema)
}

// ------------------------------------------------------------------
// Store (状态管理)
// ------------------------------------------------------------------

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // 初始配置
      config: {
        baseUrl: '',
        apiKey: '',
      },
      setConfig: (config) => set({ config }),

      // 初始任务数据
      uploadedSwaggerJson: null,
      parsedApiEndpoints: [],
      selectedApiIds: [],
      templateCode: '// 在此处粘贴您的模板代码...',

      generatedCode: '',
      isGenerating: false,

      // 初始历史记录
      history: [],

      // 动作
      setSwaggerJson: (json, endpoints) =>
        set({
          uploadedSwaggerJson: json,
          parsedApiEndpoints: endpoints,
          selectedApiIds: [], // 上传新文件时重置选择
        }),

      toggleApiSelection: (id, selected) =>
        set((state) => {
          const nextSelected = selected
            ? [...state.selectedApiIds, id]
            : state.selectedApiIds.filter((x) => x !== id);
          return { selectedApiIds: nextSelected };
        }),

      setTemplateCode: (code) => set({ templateCode: code }),
      setGeneratedCode: (code) => set({ generatedCode: code }),
      setIsGenerating: (isGenerating) => set({ isGenerating }),

      addHistoryRecord: (record) =>
        set((state) => ({
          history: [record, ...state.history].slice(0, 50), // 保留最近 50 条记录
        })),

      restoreFromHistory: (record) =>
        set({
          templateCode: record.originalCode,
          generatedCode: record.generatedCode,
          // 可选：如果相关也可以尝试恢复选择状态，
          // 但通常历史视图只关注结果。
        }),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'ai-code-mimic-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        config: state.config,
        history: state.history,
        // 我们持久化配置和历史记录，但可能不持久化当前易变的任务数据？
        // 确保持久化配置和历史记录。
        // 用户可能也想持久化 templateCode？让我们加上它。
        templateCode: state.templateCode,
      }),
    },
  ),
);
