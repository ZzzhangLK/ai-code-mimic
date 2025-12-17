import type { DifyConfig } from '../store/useAppStore';

export interface DifyResponse {
  answer: string;
  conversation_id?: string;
  // 如果需要，根据 Dify API 响应结构添加其他字段
}

export const difyService = {
  /**
   * 通过调用 Dify API 生成代码。
   * 假设我们使用的是 Dify 的 "Completion" 或 "Chat" API。
   * 根据需求，我们将尝试坚持基于通用提示的生成。
   */
  async generateCode(
    config: DifyConfig,
    inputs: Record<string, any>,
    _onProgress?: (chunk: string) => void,
  ): Promise<string> {
    void _onProgress; // Suppress unused warning
    const { baseUrl, apiKey } = config;

    // 清理 Base URL 以确保没有尾随斜杠
    const safeBaseUrl = baseUrl.replace(/\/+$/, '');
    const url = `${safeBaseUrl}/v1/chat-messages`;

    // Advanced Chat App 期望 payload:
    // {
    //   "inputs": { "var_name": "value" },
    //   "query": "something", // 必填，即使在 workflow 中没用到，通常作为用户输入
    //   "user": "user-id",
    //   "response_mode": "blocking" | "streaming",
    //   "conversation_id": "" // 可选
    // }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: inputs,
          query: 'Generate Code', // 对于 Workflow类应用，这个往往是触发器，或者是对话的初始输入
          response_mode: 'blocking',
          user: 'user-id-placeholder',
          files: [],
        }),
      });

      if (!response.ok) {
        let errorMsg = `错误 ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.message) errorMsg += ` - ${errorData.message}`;
        } catch {
          // 忽略 JSON 解析错误
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();

      // 处理 Dify 响应结构
      // chat-messages 通常也是返回 data.answer
      if (data && typeof data.answer === 'string') {
        return data.answer;
      } else {
        console.warn('Unexpected Dify response:', data);
        throw new Error('来自 Dify API 的意外响应格式');
      }
    } catch (error: unknown) {
      console.error('Dify API 错误:', error);
      throw error;
    }
  },

  /**
   * 简单的连接检查（可选，可以直接使用带有 'test' 的 generateCode）
   */
  async checkConnection(config: DifyConfig): Promise<boolean> {
    // 尝试一个轻量级请求或最小提示
    // Dify 通常没有标准的 /ping，所以我们可能会跳过或尝试一个虚拟补全。
    // 目前，假设我们通过执行最小生成来验证，或者如果格式正确则假设为真。
    // 我们将执行一个最小生成 'hi'
    await this.generateCode(config, { test: 'connection' });
    return true;
  },
};
