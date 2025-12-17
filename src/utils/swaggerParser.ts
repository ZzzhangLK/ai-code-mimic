import SwaggerClient from 'swagger-client';
import type { ApiEndpoint } from '../store/useAppStore';

export const swaggerParser = {
  async parse(jsonString: string): Promise<ApiEndpoint[]> {
    try {
      // 解析 JSON
      const spec = JSON.parse(jsonString);

      // 验证基本的 Swagger/OpenAPI 结构
      if (!spec.swagger && !spec.openapi) {
        throw new Error('无效的 Swagger/OpenAPI 文件。');
      }

      // 使用 swagger-client 解析引用（虽然本地我们可以直接遍历路径）
      // 获取完整解析后的规范可能比较耗时，如果有需要，让 swagger-client 处理。
      // 但对于简单的“列出端点”，手动遍历 'paths' 通常足够且健壮。
      // 这里如果安装了 swagger-client，我们使用它来确保引用解析正常工作。
      
      const client = await SwaggerClient.resolve({ spec });
      const resolvedSpec = client.spec;

      const endpoints: ApiEndpoint[] = [];
      const paths = resolvedSpec.paths || {};

      Object.keys(paths).forEach((pathKey) => {
        const pathItem = paths[pathKey];
        const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'];

        methods.forEach((method) => {
          if (pathItem[method]) {
            const operation = pathItem[method];
            endpoints.push({
              id: `${method.toUpperCase()} ${pathKey}`,
              path: pathKey,
              method: method.toUpperCase(),
              summary: operation.summary || operation.operationId || '无摘要',
              description: operation.description,
              parameters: operation.parameters, // Swagger 2.0 / OpenAPI 3.0 parameters
              requestBody: operation.requestBody, // OpenAPI 3.0 requestBody
              responses: operation.responses,   // Responses
            });
          }
        });
      });

      return endpoints;
    } catch (error: unknown) {
      console.error('Swagger 解析错误:', error);
      throw new Error('无法解析 Swagger 定义: ' + (error as Error).message);
    }
  }
};
