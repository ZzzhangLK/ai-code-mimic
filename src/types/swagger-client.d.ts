declare module 'swagger-client' {
  export interface SwaggerSpec {
    swagger?: string;
    openapi?: string;
    paths?: Record<string, any>;
    [key: string]: any;
  }

  export interface ResolveResult {
    spec: SwaggerSpec;
  }

  export interface SwaggerClientOptions {
    spec: SwaggerSpec;
  }

  const SwaggerClient: {
    resolve(options: SwaggerClientOptions): Promise<ResolveResult>;
  };

  export default SwaggerClient;
}
