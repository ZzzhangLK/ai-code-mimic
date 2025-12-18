import { ApiEndpoint } from '../store/useAppStore';

/**
 * 简化 Swagger 操作定义，只保留核心要素。
 * 供 Dify 接口调用时作为 api_definitions 使用，以减少消耗并提高模型理解力。
 */
export const simplifySwagger = (endpoint: ApiEndpoint) => {
  return {
    summary: endpoint.summary,
    url: endpoint.path,
    method: endpoint.method.toLowerCase(),
    params: [
      ...(endpoint.parameters || []).map((p: any) => ({
        name: p.name,
        type: typeof p.type === 'string' ? p.type : 'object',
      })),
      ...(endpoint.requestBody ? [{ name: 'body', type: endpoint.requestBody }] : []),
    ],
    response: endpoint.responses || {},
  };
};
