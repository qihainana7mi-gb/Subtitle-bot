# Subtitle-bot 使用说明

## 项目概述
`Subtitle-bot` 是一个返回随机台词的 Telegram Inline Bot，借助 Cloudflare Worker 实现运行。本指南将详细介绍如何搭建和使用这个 Bot。

## 前期准备
### 注册 Telegram Bot 并获取 Token
1. 打开 Telegram 应用，搜索 `BotFather` 并开启对话。
2. 输入 `/newbot` 命令创建新的 Bot，依照提示输入 Bot 的名称和用户名（用户名需以 `bot` 结尾，如 `my_subtitle_bot`）。
3. `BotFather` 会提供一个 Token，格式类似 `1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghi`，请妥善保存。

### 开启 Inline 模式
1. 继续与 `BotFather` 对话，使用 `/setinline` 命令。
2. 选择刚创建的 Bot，再选择 `Enable` 开启 Inline 模式。

### 注册 Cloudflare 账户
若没有 Cloudflare 账户，需先在 [Cloudflare 官网](https://www.cloudflare.com/) 完成注册。

## 配置 Cloudflare Worker
### 创建新的 Worker
1. 登录 Cloudflare 账户，进入 [Cloudflare Workers 控制台](https://dash.cloudflare.com/)。
2. 点击 `Create a Worker` 按钮创建新的 Worker。

### 复制 `worker.js` 文件内容
1. 从 `Subtitle-bot` 仓库找到 `worker.js` 文件并打开。
2. 将 `worker.js` 文件的所有代码复制到 Cloudflare Workers 控制台的代码编辑区域。

### 修改配置
#### 修改 `SECRET TOKEN`
找到以下代码行：
```javascript
const SECRET_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
```
把 `YOUR_TELEGRAM_BOT_TOKEN` 替换为从 `BotFather` 获取的 Telegram Bot Token。

#### 配置 `SOURCE`
有两种配置 `SOURCE` 的方式：
- **远程引用 txt 文件（便于维护）**：
```javascript
const SOURCE = 'https://raw.githubusercontent.com/用户名/仓库名/分支名/文件路径.txt';
```
将链接替换为你实际存储台词的 GitHub 仓库 txt 文件的原始链接。注意要使用 `raw.githubusercontent.com`，而非 `github.com`。

- **直接赋值到 `lines` 变量中（懒人部署）**：
```javascript
var lines = `
{description}台词
`;
```
将 `{description}台词` 替换为实际的台词数据，格式为 `{S1E03}很好喝`，不同台词用换行符分隔。例如：
```javascript
var lines = `
{S1E03}很好喝
{S1E03}嗯，我也最喜欢咖啡了
{S1E03}我好像迷上了智乃给我泡的咖啡了
`;
```

## 部署并注册 Webhook
### 部署 Worker
在 Cloudflare Workers 控制台点击 `Save and Deploy` 按钮，将修改后的代码部署到 Cloudflare 服务器。

### 访问 `/registerWebhook`
新部署时，在浏览器输入 `https://your-worker-url/registerWebhook`（`your-worker-url` 是刚创建的 Cloudflare Worker 的 URL），访问后会收到 Webhook 注册成功的提示。

## 使用 Bot
### 打开 Telegram
在 Telegram 中找到创建的 Bot 并进入聊天界面。

### 使用 Inline 模式
1. 在任何聊天窗口输入 `@your_bot_username`（`your_bot_username` 是 Bot 的用户名），接着输入关键字（若 Bot 支持）或直接按空格键。
2. Bot 会返回随机台词。

## 常见问题及解决办法
### 远程引用获取到 HTML 标签内容
- **问题原因**：可能是语料库数据被污染或数据获取错误。
- **解决办法**：
  - 检查语料库文件（如 `rabbit.txt`）或 `lines` 变量的赋值部分，确保不包含 HTML 标签等异常内容。
  - 确认 `SOURCE` 指向的是正确的纯文本文件地址，可在获取数据后添加日志输出检查：
```javascript
if (typeof SOURCE !== 'undefined') {
  const response = await fetch(SOURCE);
  lines = await response.text();
  console.log('Fetched lines:', lines); // 添加日志输出
}
```
  - 增强数据过滤，只保留符合字幕台词格式的数据：
```javascript
const linesArray = lines.trim().split('\n').filter(line => {
  const trimmedLine = line.trim();
  return trimmedLine !== '' && trimmedLine.startsWith('{');
});
```

## 注意事项
- 若修改了 `worker.js` 文件代码，再次点击 `Save and Deploy` 按钮完成更新，无需再次访问 `/registerWebhook`。
- 确保台词文件（使用远程引用方式时）公开可访问，否则 Cloudflare Worker 无法获取台词数据。
- 遇到问题可查看 Cloudflare Workers 控制台日志或 Telegram Bot 日志排查。 
