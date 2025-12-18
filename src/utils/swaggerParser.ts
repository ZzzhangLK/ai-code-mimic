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

      const simplifySchema = (schema: any): any => {
        if (!schema) return 'any';
        if (schema.type === 'array') {
          return [simplifySchema(schema.items)];
        }
        if (schema.type === 'object' || schema.properties) {
          const props: any = {};
          if (schema.properties) {
            Object.keys(schema.properties).forEach(key => {
              props[key] = simplifySchema(schema.properties[key]);
            });
          }
          return props;
        }
        return schema.type || 'any';
      };

      Object.keys(paths).forEach((pathKey) => {
        const pathItem = paths[pathKey];
        const methods = ['get', 'post', 'put', 'delete', 'patch'];

        methods.forEach((method) => {
          if (pathItem[method]) {
            const operation = pathItem[method];
            
            // 提取参数
            const params = (operation.parameters || []).map((p: any) => ({
              name: p.name,
              in: p.in,
              required: p.required,
              type: p.schema ? simplifySchema(p.schema) : (p.type || 'any'),
              description: p.description
            }));

            // 提取 RequestBody
            let reqBody = 'None';
            if (operation.requestBody?.content?.['application/json']?.schema) {
              reqBody = simplifySchema(operation.requestBody.content['application/json'].schema);
            }

            // 提取 Responses (仅 200)
            let resBody = 'None';
            const res200 = operation.responses?.['200'] || operation.responses?.default;
            if (res200?.content?.['application/json']?.schema) {
              resBody = simplifySchema(res200.content['application/json'].schema);
            } else if (res200?.schema) {
              resBody = simplifySchema(res200.schema);
            }

            endpoints.push({
              id: `${method.toUpperCase()} ${pathKey}`,
              path: pathKey,
              method: method.toUpperCase(),
              summary: operation.summary || operation.operationId || '无摘要',
              description: operation.description,
              parameters: params.length > 0 ? params : undefined,
              requestBody: reqBody !== 'None' ? reqBody : undefined,
              responses: resBody !== 'None' ? resBody : undefined,
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
