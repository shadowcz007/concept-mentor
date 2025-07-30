# Concept Mentor - AI 学习助手

一个基于 AI 的智能学习助手，帮助用户更好地理解和掌握各种概念。

## 项目信息

**URL**: https://lovable.dev/projects/9523ccc6-e9ec-4e56-a3fb-a39fc5fed240

## 快速开始

### 环境变量配置

在开始使用之前，您需要配置环境变量：

1. 复制环境变量示例文件：
```bash
cp env.example .env
```

2. 编辑 `.env` 文件，填入您的 SiliconFlow API Token：
```bash
VITE_SILICONFLOW_API_TOKEN=your_siliconflow_api_token_here
```

3. 获取 API Token：
   - 访问 [SiliconFlow 控制台](https://cloud.siliconflow.cn)
   - 注册并登录您的账户
   - 在控制台中获取您的 API Token

详细配置说明请参考：[环境变量配置指南](./ENV_SETUP.md)

### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 如何编辑代码？

有多种方式可以编辑您的应用程序：

**使用 Lovable**

访问 [Lovable Project](https://lovable.dev/projects/9523ccc6-e9ec-4e56-a3fb-a39fc5fed240) 并开始提示。

通过 Lovable 所做的更改将自动提交到此仓库。

**使用您喜欢的 IDE**

如果您想使用自己的 IDE 在本地工作，可以克隆此仓库并推送更改。推送的更改也会反映在 Lovable 中。

唯一的要求是安装 Node.js 和 npm - [使用 nvm 安装](https://github.com/nvm-sh/nvm#installing-and-updating)

按照以下步骤操作：

```sh
# 步骤 1: 使用项目的 Git URL 克隆仓库。
git clone <YOUR_GIT_URL>

# 步骤 2: 导航到项目目录。
cd <YOUR_PROJECT_NAME>

# 步骤 3: 安装必要的依赖。
npm i

# 步骤 4: 启动开发服务器，具有自动重载和即时预览。
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/9523ccc6-e9ec-4e56-a3fb-a39fc5fed240) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
