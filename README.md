
# OVH 服务器监控与抢购系统

## 项目信息

**URL**: https://lovable.dev/projects/cbb03994-efde-4378-9920-18fac285c6d6

## 项目结构

本项目是一个全栈应用程序，用于监控 OVH 服务器的可用性并在服务器可用时自动购买。

### 前端部分
- 使用 React, TypeScript, Tailwind CSS 构建
- 主要文件位于 `src/pages` 和 `src/components` 目录
- 前端负责用户界面、表单验证和向后端API发送请求

### 后端部分
- 使用 Express.js 构建的 API
- 主要文件位于 `src/server/api` 目录
- 后端负责与 OVH API 通信、监控服务器状态和处理购买请求

### 配置文件
- API凭据配置位于 `src/config/apiConfig.ts`
- 包含与OVH API通信所需的配置信息

## 如何编辑此代码？

有多种方式可以编辑您的应用程序。

**使用 Lovable**

只需访问 [Lovable 项目](https://lovable.dev/projects/cbb03994-efde-4378-9920-18fac285c6d6) 并开始提示。

通过 Lovable 进行的更改将自动提交到此仓库。

**使用您喜欢的 IDE**

如果您想使用自己的 IDE 在本地工作，您可以克隆此仓库并推送更改。推送的更改也将反映在 Lovable 中。

唯一的要求是安装 Node.js 和 npm - [使用 nvm 安装](https://github.com/nvm-sh/nvm#installing-and-updating)

按照以下步骤操作：

```sh
# 步骤 1：使用项目的 Git URL 克隆仓库。
git clone <您的GIT_URL>

# 步骤 2：导航到项目目录。
cd <您的项目名称>

# 步骤 3：安装必要的依赖项。
npm i

# 步骤 4：启动开发服务器，实现自动重新加载和即时预览。
npm run dev
```

**直接在 GitHub 中编辑文件**

- 导航到所需的文件。
- 点击文件视图右上方的"编辑"按钮（铅笔图标）。
- 进行更改并提交更改。

**使用 GitHub Codespaces**

- 导航到仓库的主页。
- 点击右上方附近的"代码"按钮（绿色按钮）。
- 选择"Codespaces"选项卡。
- 点击"新建 codespace"以启动新的 Codespace 环境。
- 直接在 Codespace 中编辑文件，完成后提交并推送更改。

## 此项目使用了哪些技术？

本项目基于以下技术构建：

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Express.js (后端API)

## 如何部署此项目？

只需打开 [Lovable](https://lovable.dev/projects/cbb03994-efde-4378-9920-18fac285c6d6) 并点击 分享 -> 发布。

## 我可以将自定义域名连接到我的 Lovable 项目吗？

是的，可以！

要连接域名，请导航到 项目 > 设置 > 域名，然后点击连接域名。

在此处阅读更多信息：[设置自定义域名](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
