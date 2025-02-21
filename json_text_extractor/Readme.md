

```markdown
# JSON 文本提取器

## 项目概述
这个 JavaScript 项目的主要功能是从 Telegram 软件导出的群聊消息的 JSON 文件中提取特定内容，去掉重复内容，然后将结果保存到 `output.json` 文件中。它可以处理大型的 JSON 文件，通过逐行读取和处理的方式，避免一次性将整个文件加载到内存中，从而提高性能和减少内存占用。

## 项目结构
- `json_text_extractor.js`：主脚本文件，包含提取和处理 JSON 数据的主要逻辑。

## 如何使用

### 前提条件
- 确保你的 Node.js 环境已经安装，因为这个项目使用了 Node.js 的内置模块 `fs` 和 `readline`。

### 步骤
1. **准备输入文件**：将 Telegram 导出的群聊消息 JSON 文件命名为 `input.json`，并放置在项目根目录下。
2. **运行脚本**：在终端中，进入项目根目录，然后执行以下命令：
   ```sh
   node json_text_extractor.js
   ```
3. **查看结果**：脚本运行完成后，提取并去重后的内容会保存到 `output.json` 文件中。你可以在项目根目录下找到这个文件。

## 代码逻辑

### 主要函数
- `processMessage(message)`：处理单个消息，提取消息中的文本内容。
- `processJsonBlock(jsonBlock, result)`：处理 JSON 块，解析 JSON 数据并将提取的文本内容添加到结果数组中。
- `processLargeJsonFile(filePath)`：主函数，负责读取输入文件，逐行处理 JSON 数据，去重并保存结果到 `output.json` 文件。

### 错误处理
- 在读取文件、解析 JSON 数据或写入文件时，如果发生错误，会在控制台输出相应的错误信息。

## 注意事项
- 输入文件必须是 UTF-8 编码的 JSON 文件。
- 确保输入文件的格式正确，否则可能会出现 JSON 解析错误。

## 贡献
如果你发现了任何问题或者有改进的建议，欢迎提交 issue 或者 pull request。

## 许可证
这个项目采用 [MIT 许可证](https://opensource.org/licenses/MIT)，你可以自由使用、修改和分发这个项目。
```
