import * as vscode from 'vscode';

/**
 * 主题管理器
 * 负责切换 VS Code 主题
 */

export class ThemeManager {
  private currentTheme: string | null = null;
  private outputChannel: vscode.OutputChannel;

  constructor() {
    this.outputChannel = vscode.window.createOutputChannel('EmoCode');
  }

  /**
   * 切换到指定主题
   * @param themeName 主题名称
   * @returns 是否成功切换
   */
  async switchTheme(themeName: string): Promise<boolean> {
    if (!themeName) {
      this.log(`错误：未指定主题名称`);
      return false;
    }

    // 检查是否与当前主题相同
    if (this.currentTheme === themeName) {
      this.log(`当前已是 "${themeName}" 主题，跳过切换`);
      return false;
    }

    try {
      await vscode.workspace.getConfiguration()
        .update('workbench.colorTheme', themeName, vscode.ConfigurationTarget.Global);
      
      this.currentTheme = themeName;
      this.log(`已切换到主题 "${themeName}"`);
      return true;
    } catch (error) {
      this.log(`切换主题失败: ${error}`);
      return false;
    }
  }

  /**
   * 获取当前主题名称
   */
  getCurrentTheme(): string | null {
    return this.currentTheme;
  }

  /**
   * 输出日志
   */
  log(message: string): void {
    const timestamp = new Date().toLocaleTimeString('zh-CN');
    this.outputChannel.appendLine(`[${timestamp}] ${message}`);
  }

  /**
   * 显示日志面板
   */
  showLog(): void {
    this.outputChannel.show();
  }

  /**
   * 清理资源
   */
  dispose(): void {
    this.outputChannel.dispose();
  }
}
