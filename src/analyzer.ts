/**
 * 代码状态分析器
 * 基于诊断信息（错误/警告）判断代码状态
 */

export type CodeStatus = 'error' | 'warning' | 'clean';

export interface DiagnosticsResult {
  status: CodeStatus;
  errorCount: number;
  warningCount: number;
  hasErrors: boolean;
}

/**
 * 分析诊断信息，返回代码状态
 * @param errors 错误数量
 * @param warnings 警告数量
 * @returns 分析结果
 */
export function analyzeDiagnostics(
  errors: number,
  warnings: number
): DiagnosticsResult {
  // 错误优先：只要有错误就是 error 状态
  if (errors > 0) {
    return {
      status: 'error',
      errorCount: errors,
      warningCount: warnings,
      hasErrors: true
    };
  }

  // 没有错误，有警告
  if (warnings > 0) {
    return {
      status: 'warning',
      errorCount: errors,
      warningCount: warnings,
      hasErrors: false
    };
  }

  // 完全没有问题
  return {
    status: 'clean',
    errorCount: 0,
    warningCount: 0,
    hasErrors: false
  };
}

/**
 * 根据代码状态返回对应的情绪
 * @param status 代码状态
 * @returns 情绪名称
 */
export function statusToEmotion(status: CodeStatus): string {
  const mapping: Record<CodeStatus, string> = {
    'error': 'angry',
    'warning': 'anxious',
    'clean': 'happy'
  };
  return mapping[status];
}
