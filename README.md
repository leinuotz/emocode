# EmoCode - 代码状态主题切换器

根据代码中的错误和警告自动切换 VS Code 主题。有错深色、无错浅色，让编辑器更懂你。

这是一个前几年的练手作品，仅供好玩。

## 功能特性

- 自动检测代码错误并切换到深色主题
- 自动检测代码警告并切换到高对比主题
- 代码无错误时切换到浅色主题
- 支持通过 VS Code 设置完全自定义

## 安装

### 源码安装

```bash
# 克隆项目
git clone https://github.com/leinuotz/emocode.git
cd emocode

# 安装依赖
npm install

# 编译
npm run compile

# 打包
npm install -g @vscode/vsce
vsce package

# 安装
code --install-extension ./emocode-1.0.0.vsix
```

## 使用方法

安装后自动启用，无需任何配置。

### 自动行为

| 代码状态 | 主题 |
|---------|------|
| 有错误 | 深色主题 |
| 有警告 | 高对比主题 |
| 无错误 | 浅色主题 |

### 手动命令

按 Ctrl+Shift+P / Cmd+Shift+P：

- EmoCode: 检查代码状态 - 立即检查并切换
- EmoCode: 查看日志 - 查看切换历史
- EmoCode: 启用/禁用 - 开启或关闭功能

## 配置选项

在 settings.json 中自定义：

```json
{
  "emocode.enabled": true,
  "emocode.showNotification": true,
  "emocode.themeMapping": {
    "angry": "Default Dark+",
    "happy": "Default Light+",
    "anxious": "Monokai"
  }
}
```

## 工作原理

```
代码文件变化
    |
    v
VS Code 诊断系统分析
    |
    v
统计 Error / Warning 数量
    |
    v
状态判断：
  errors > 0 -> 深色主题
  warnings > 0 -> 高对比主题
  else -> 浅色主题
    |
    v
自动切换主题
```

## 隐私说明

- 所有分析在本地完成
- 不访问网络
- 不上传任何数据
- 基于 VS Code 内置诊断 API

## 项目结构

```
emocode/
├── src/
|   ├── extension.ts
|   ├── analyzer.ts
|   ├── themeManager.ts
|   └── config.ts
├── .vscode/
|   ├── launch.json
|   └── tasks.json
├── package.json
├── tsconfig.json
└── README.md
```

## 许可证

MIT License

---

Made with by leinuo
