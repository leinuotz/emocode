import * as vscode from 'vscode';
import { analyzeDiagnostics, CodeStatus } from './analyzer';
import { ThemeManager } from './themeManager';
import { getConfig } from './config';

/**
 * EmoCode - 根据代码错误状态自动切换主题
 * 
 * 有错误 → 深色主题（护眼，错误更明显）
 * 有警告 → 高对比主题
 * 无错误 → 浅色主题（舒适阅读）
 */

let themeManager: ThemeManager | null = null;
let lastStatus: CodeStatus | null = null;
let isActivated = false;

// 扩展激活入口
export function activate(context: vscode.ExtensionContext) {
  if (isActivated) {
    return;
  }
  isActivated = true;

  console.log('EmoCode 扩展已激活 - 基于代码状态切换主题');
  
  // 初始化主题管理器
  themeManager = new ThemeManager();

  // 注册命令：手动触发检查
  const checkCommand = vscode.commands.registerCommand('emocode.check', async () => {
    await performCheck();
  });

  // 注册命令：切换到指定状态主题
  const switchCommand = vscode.commands.registerCommand('emocode.switchStatus', async (status: string) => {
    if (themeManager && status) {
      const config = getConfig();
      const mapping = getStatusThemeMapping(config.themeMapping);
      const themeName = mapping[status as CodeStatus];
      await vscode.workspace.getConfiguration()
        .update('workbench.colorTheme', themeName, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(`已切换到 ${getStatusLabel(status as CodeStatus)} 主题`);
    }
  });

  // 注册命令：显示日志
  const logCommand = vscode.commands.registerCommand('emocode.showLog', () => {
    themeManager?.showLog();
  });

  // 注册命令：启用/禁用
  const toggleCommand = vscode.commands.registerCommand('emocode.toggle', async () => {
    const config = getConfig();
    const configSection = vscode.workspace.getConfiguration('emocode');
    await configSection.update('enabled', !config.enabled, true);
    vscode.window.showInformationMessage(`EmoCode 已${!config.enabled ? '启用' : '禁用'}`);
  });

  // 注册诊断信息变更监听器（核心功能）
  const diagnosticChangeListener = vscode.languages.onDidChangeDiagnostics((event) => {
    const config = getConfig();
    
    if (!config.enabled) {
      return;
    }

    // 检查是否涉及活动编辑器
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      return;
    }

    // 检查变更的 URI 是否包含活动文档
    const activeUri = activeEditor.document.uri.toString();
    const isRelevant = event.uris.some(uri => uri.toString() === activeUri);
    
    if (isRelevant) {
      // 立即检查，不需要防抖（诊断信息已经过处理）
      performCheck();
    }
  });

  // 注册活动编辑器变更监听器
  const editorChangeListener = vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor) {
      performCheck();
    }
  });

  // 注册文档保存时检查
  const saveListener = vscode.workspace.onDidSaveTextDocument(() => {
    const config = getConfig();
    if (config.enabled) {
      performCheck();
    }
  });

  // 注册配置变更监听器
  const configChangeListener = vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration('emocode')) {
      console.log('EmoCode 配置已更新');
      performCheck();
    }
  });

  // 添加到订阅列表
  context.subscriptions.push(
    checkCommand,
    switchCommand,
    logCommand,
    toggleCommand,
    diagnosticChangeListener,
    editorChangeListener,
    saveListener,
    configChangeListener,
    {
      dispose: () => {
        themeManager?.dispose();
      }
    }
  );

  // 延迟初始化，等 VS Code 完全加载
  setTimeout(() => {
    performCheck();
  }, 1000);

  // 显示欢迎提示
  vscode.window.showInformationMessage(
    '🐱 EmoCode 已启用！根据代码状态自动切换主题~',
    '查看状态'
  ).then((selection) => {
    if (selection === '查看状态') {
      performCheck();
    }
  });
}

/**
 * 获取状态到主题的映射
 */
function getStatusThemeMapping(themeMapping: Record<string, string>): Record<string, string> {
  return {
    'error': themeMapping['angry'] || 'Default Dark+',
    'warning': themeMapping['anxious'] || 'Monokai',
    'clean': themeMapping['happy'] || 'Default Light+'
  };
}

/**
 * 获取状态的友好标签
 */
function getStatusLabel(status: CodeStatus): string {
  const labels: Record<CodeStatus, string> = {
    'error': '❌ 有错误',
    'warning': '⚠️ 有警告',
    'clean': '✅ 无错误'
  };
  return labels[status];
}

/**
 * 执行诊断检查
 */
async function performCheck(): Promise<void> {
  const config = getConfig();
  
  if (!config.enabled) {
    return;
  }

  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  try {
    // 获取文档 URI
    const document = editor.document;
    const uri = document.uri;

    // 获取诊断信息
    const diagnostics = vscode.languages.getDiagnostics(uri);
    
    // 统计错误和警告
    let errorCount = 0;
    let warningCount = 0;

    for (const diagnostic of diagnostics) {
      switch (diagnostic.severity) {
        case vscode.DiagnosticSeverity.Error:
        case vscode.DiagnosticSeverity.Warning:
          // VS Code 的 Error = 0, Warning = 1, Information = 2, Hint = 3
          if (diagnostic.severity === vscode.DiagnosticSeverity.Error) {
            errorCount++;
          } else if (diagnostic.severity === vscode.DiagnosticSeverity.Warning) {
            warningCount++;
          }
          break;
      }
    }

    // 分析状态
    const result = analyzeDiagnostics(errorCount, warningCount);
    
    // 检查状态是否变化
    if (lastStatus === result.status) {
      return;
    }

    // 切换主题
    const mapping = getStatusThemeMapping(config.themeMapping);
    const themeName = mapping[result.status];

    await vscode.workspace.getConfiguration()
      .update('workbench.colorTheme', themeName, vscode.ConfigurationTarget.Global);

    lastStatus = result.status;
    
    // 显示通知
    showStatusNotification(result);

  } catch (error) {
    console.error('诊断检查失败:', error);
  }
}

/**
 * 显示状态通知
 */
function showStatusNotification(result: ReturnType<typeof analyzeDiagnostics>): void {
  let message: string;
  let icon: string;

  switch (result.status) {
    case 'error':
      icon = '😤';
      message = `检测到 ${result.errorCount} 个错误 → 深色主题`;
      break;
    case 'warning':
      icon = '😰';
      message = `检测到 ${result.warningCount} 个警告 → 高对比主题`;
      break;
    case 'clean':
      icon = '😊';
      message = '代码干净无错 → 浅色主题';
      break;
  }

  vscode.window.setStatusBarMessage(`${icon} ${message}`, 3000);
  themeManager?.log(message);
}

// 扩展停用入口
export function deactivate() {
  if (themeManager) {
    themeManager.dispose();
  }
  isActivated = false;
}
