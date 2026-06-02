export const Colors = {
  primary: '#3b82f6',
  primaryDark: '#2563eb',
  primaryLight: '#eff6ff',
  bg: '#f4f6fa',
  surface: '#ffffff',
  border: '#dde1ea',
  text: '#1e293b',
  muted: '#64748b',
  success: '#22c55e',
  danger: '#ef4444',
  dangerLight: '#fee2e2',
  warning: '#f59e0b',
  warningLight: '#fef9c3',
  successLight: '#dcfce7',
  purple: '#7c3aed',
  purpleLight: '#ede9fe',
} as const

export const DifficultyColors: Record<string, { bg: string; text: string }> = {
  easy: { bg: '#dcfce7', text: '#16a34a' },
  medium: { bg: '#fef9c3', text: '#ca8a04' },
  hard: { bg: '#fee2e2', text: '#dc2626' },
  mixed: { bg: '#ede9fe', text: '#7c3aed' },
}

export const DifficultyLabels: Record<string, string> = {
  easy: 'Dễ',
  medium: 'Trung bình',
  hard: 'Khó',
  mixed: 'Hỗn hợp',
}
