// 环境变量配置
export const env = {
  // SiliconFlow API 配置
  SILICONFLOW_API_TOKEN: import.meta.env.VITE_SILICONFLOW_API_TOKEN,
  SILICONFLOW_API_URL: import.meta.env.VITE_SILICONFLOW_API_URL || 'https://api.siliconflow.cn/v1',
  
  // 默认模型配置
  DEFAULT_MODEL: import.meta.env.VITE_DEFAULT_MODEL || 'Qwen/QwQ-32B',
  
  // 应用配置
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Concept Mentor',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
} as const;

// 验证必需的环境变量
export function validateEnv() {
  const requiredEnvVars = [
    'VITE_SILICONFLOW_API_TOKEN',
  ] as const;

  const missing = requiredEnvVars.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    console.error('Please check your .env file and ensure all required variables are set.');
    return false;
  }
  
  return true;
}

// 检查是否为开发环境
export const isDevelopment = import.meta.env.DEV;

// 检查是否为生产环境
export const isProduction = import.meta.env.PROD; 