//提取JavaScript中特定内容并去掉重复内容(Telegram软件导出群聊消息的JSON文件)并保存到output.json文件中
const fs = require('fs');
const readline = require('readline');

// 处理单个消息的函数
function processMessage(message) {
    if (message.text_entities) {
        return message.text_entities.map(entity => entity.text).join('');
    }
    return null;
}

// 处理 JSON 块的函数
function processJsonBlock(jsonBlock, result) {
    try {
        const json = JSON.parse(jsonBlock);
        if (json.messages) {
            json.messages.forEach(message => {
                const text = processMessage(message);
                if (text) {
                    result.push(text);
                }
            });
        }
    } catch (error) {
        console.error('JSON 解析错误:', error.message);
    }
}

// 主函数
function processLargeJsonFile(filePath) {
    const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity
    });

    let buffer = '';
    const stack = [];
    const result = [];
    let isFirstLine = true;

    rl.on('line', (line) => {
        if (isFirstLine) {
            // 去除开头可能的非法字符
            line = line.replace(/^\uFEFF/, '');
            isFirstLine = false;
        }
        buffer += line;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
                continue; // 跳过空格、制表符、换行符
            }
            if (char === '{') {
                stack.push('{');
            } else if (char === '[') {
                stack.push('[');
            } else if (char === '}') {
                if (stack.length > 0 && stack[stack.length - 1] === '{') {
                    stack.pop();
                } else {
                    console.error('JSON 格式错误: 不匹配的 }');
                    return;
                }
            } else if (char === ']') {
                if (stack.length > 0 && stack[stack.length - 1] === '[') {
                    stack.pop();
                } else {
                    console.error('JSON 格式错误: 不匹配的 ]');
                    return;
                }
            }
        }
        if (stack.length === 0) {
            processJsonBlock(buffer, result);
            buffer = '';
        }
    });

    rl.on('close', () => {
        if (buffer) {
            processJsonBlock(buffer, result);
        }

        // 使用 Set 去重
        const uniqueResult = [...new Set(result)];

        // 将去重后的结果保存到 output.json 文件
        const outputFilePath = 'output.json';
        fs.writeFile(outputFilePath, JSON.stringify(uniqueResult, null, 2), { encoding: 'utf8' }, (err) => {
            if (err) {
                console.error('写入文件时出错:', err);
            } else {
                console.log(`处理结果已保存到 ${outputFilePath}`);
            }
        });
    });

    rl.on('error', (error) => {
        console.error('读取文件时出错:', error.message);
    });
}

// 调用主函数，将文件名修改为 input.json
const filePath = 'input.json';
processLargeJsonFile(filePath);