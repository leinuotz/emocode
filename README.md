# 🐱 EmoCode - 代码状态主题切换器

根据代码中的**错误和警告**自动切换 VS Code 主题。有错深色、无错浅色，让编辑器更懂你！

![VS Code](https://img.shields.io/badge/VS%20Code-1.75.0+-007ACC.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)

## ✨ 功能特性

- 🔴 **自动检测错误** → 切换到深色主题（更容易看清错误）
- 🟡 **自动检测警告** → 切换到高对比主题（提醒你注意）
- 🟢 **代码干净** → 切换到浅色主题（舒适阅读）
- 🔒 **隐私优先** → 完全本地运行，不上传任何数据
- ⚡ **实时响应** → 诊断信息变化立即切换

## 📦 安装

### 源码安装

```bash
# 克隆项目
git clone https://github.com/your-username/emocode.git
cd emocode

# 安装依赖
npm install

# 编译
npm run compile

# 打包（需要先安装 vsce）
npx vsce package

# 安装
code --install-extension ./emocode-1.0.0.vsix
```

## 🚀 使用方法

安装后自动启用，无需任何配置！

### 自动行为

| 代码状态 | 主题 | 通知 |
|---------|------|------|
| ❌ 有错误 | 深色主题 | 😤 检测到 X 个错误 |
| ⚠️ 有警告 | 高对比主题 | 😰 检测到 X 个警告 |
| ✅ 无错误 | 浅色主题 | 😊 代码干净无错 |

### 手动命令

按 `Ctrl+Shift+P` / `Cmd+Shift+P`：

- `EmoCode: 检查代码状态` - 立即检查并切换
- `EmoCode: 查看日志` - 查看切换历史
- `EmoCode: 启用/禁用` - 开启或关闭功能

## ⚙️ 配置选项

在 `settings.json` 中自定义：

```json
{
  // 是否启用自动切换
  "emocode.enabled": true,
  
  // 是否显示切换通知
  "emocode.showNotification": true,
  
  // 状态到主题的映射
  "emocode.themeMapping": {
    "angry": "Default Dark+",     // 有错误时
    "happy": "Default Light+",     // 无错误时
    "anxious": "Monokai"           // 有警告时
  }
}
```

## 🔧 工作原理

```
代码文件变化
    ↓
VS Code 诊断系统分析
    ↓
统计 Error / Warning 数量
    ↓
状态判断：
  errors > 0 → error → 深色主题
  warnings > 0 → warning → 高对比
  else → clean → 浅色主题
    ↓
自动切换主题
```

## 🔒 隐私说明

- ✅ 所有分析在本地完成
- ✅ 不访问网络
- ✅ 不上传任何数据
- ✅ 基于 VS Code 内置诊断 API

## 📝 项目结构

```
emocode/
├── src/
│   ├── extension.ts      # 主入口
│   ├── analyzer.ts      # 诊断分析器
│   ├── themeManager.ts  # 主题切换器
│   └── config.ts        # 配置管理
├── .vscode/
│   ├── launch.json
│   └── tasks.json
├── package.json
├── tsconfig.json
└── README.md
```

## 📄 许可证

MIT License

---

Made with 🐱 by EmoCode
