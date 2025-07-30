# 环境变量配置指南

## 概述

本项目使用环境变量来安全地管理 API Token 和其他敏感配置信息。这样可以避免将敏感信息硬编码到代码中，提高安全性。

## 配置步骤

### 1. 创建环境变量文件

在项目根目录创建 `.env` 文件：

```bash
# SiliconFlow API 配置
VITE_SILICONFLOW_API_TOKEN=your_siliconflow_api_token_here

# API 端点配置
VITE_SILICONFLOW_API_URL=https://api.siliconflow.cn/v1

# 默认模型配置
VITE_DEFAULT_MODEL=Qwen/QwQ-32B

# 应用配置
VITE_APP_NAME=Concept Mentor
VITE_APP_VERSION=1.0.0
```

### 2. 获取 API Token

1. 访问 [SiliconFlow 控制台](https://cloud.siliconflow.cn)
2. 注册并登录您的账户
3. 在控制台中获取您的 API Token
4. 将 Token 替换到 `.env` 文件中的 `your_siliconflow_api_token_here`

### 3. 验证配置

启动开发服务器：

```bash
npm run dev
```

如果配置正确，应用将正常启动。如果配置有误，应用会显示错误提示。

## 环境变量说明

| 变量名 | 说明 | 必需 | 默认值 |
|--------|------|------|--------|
| `VITE_SILICONFLOW_API_TOKEN` | SiliconFlow API Token | ✅ | 无 |
| `VITE_SILICONFLOW_API_URL` | API 端点地址 | ❌ | https://api.siliconflow.cn/v1 |
| `VITE_DEFAULT_MODEL` | 默认 AI 模型 | ❌ | Qwen/QwQ-32B |
| `VITE_APP_NAME` | 应用名称 | ❌ | Concept Mentor |
| `VITE_APP_VERSION` | 应用版本 | ❌ | 1.0.0 |

## 安全注意事项

### ✅ 正确做法

- 将 `.env` 文件添加到 `.gitignore` 中
- 使用 `VITE_` 前缀的环境变量（只有这些变量会被暴露给客户端）
- 在部署时通过平台的环境变量设置功能配置

### ❌ 错误做法

- 将 `.env` 文件提交到 Git 仓库
- 在代码中硬编码 API Token
- 使用不带 `VITE_` 前缀的环境变量（这些变量不会暴露给客户端）

## 部署配置

### Vercel 部署

1. 在 Vercel 项目设置中添加环境变量
2. 变量名：`VITE_SILICONFLOW_API_TOKEN`
3. 变量值：您的 API Token

### Netlify 部署

1. 在 Netlify 站点设置中添加环境变量
2. 变量名：`VITE_SILICONFLOW_API_TOKEN`
3. 变量值：您的 API Token

### Docker 部署

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "run", "build"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - VITE_SILICONFLOW_API_TOKEN=${VITE_SILICONFLOW_API_TOKEN}
```

## 故障排除

### 常见问题

1. **"环境变量配置错误"**
   - 检查 `.env` 文件是否存在
   - 确认 `VITE_SILICONFLOW_API_TOKEN` 已正确设置
   - 重启开发服务器

2. **"API调用失败"**
   - 验证 API Token 是否正确
   - 检查网络连接
   - 确认 SiliconFlow 服务状态

3. **环境变量不生效**
   - 确认变量名以 `VITE_` 开头
   - 重启开发服务器
   - 清除浏览器缓存

### 调试技巧

在浏览器控制台中运行以下代码检查环境变量：

```javascript
console.log('API Token:', import.meta.env.VITE_SILICONFLOW_API_TOKEN);
console.log('API URL:', import.meta.env.VITE_SILICONFLOW_API_URL);
```

## 示例文件

项目根目录包含 `env.example` 文件，您可以复制它来创建自己的 `.env` 文件：

```bash
cp env.example .env
```

然后编辑 `.env` 文件，填入您的实际配置。 