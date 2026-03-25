import * as vscode from 'vscode';

/**
 * EmoCode 配置管理
 */

export interface EmoCodeConfig {
  enabled: boolean;
  themeMapping: {
    angry: string;   // 有错误
    happy: string;   // 无错误
    anxious: string; // 有警告
  };
  showNotification: boolean;
  autoSwitch: boolean;
}

const DEFAULT_THEME_MAPPING = {
  angry: 'Default Dark+',
  happy: 'Default Light+',
  anxious: 'Monokai'
};

export function getConfig(): EmoCodeConfig {
  const config = vscode.workspace.getConfiguration('emocode');
  
  return {
    enabled: config.get<boolean>('enabled', true),
    themeMapping: config.get('themeMapping', DEFAULT_THEME_MAPPING),
    showNotification: config.get<boolean>('showNotification', true),
    autoSwitch: config.get<boolean>('autoSwitch', true)
  };
}

export function getDefaultThemeMapping() {
  return DEFAULT_THEME_MAPPING;
}
