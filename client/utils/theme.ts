// Instagram风格的现代配色方案 - 浅色主题
export const COLORS = {
  // 主色调
  primary: '#E1306C',
  accent: '#F77737',

  // 文字色
  textPrimary: '#262626',
  textSecondary: '#8E8E8E',
  textMuted: '#C7C7C7',

  // 背景色
  background: '#FAFAFA',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  // 功能色
  success: '#78C257',
  warning: '#FCAF45',
  error: '#ED4956',

  // 边框
  border: '#DBDBDB',
  divider: '#EFEFEF',

  // 渐变色
  gradients: {
    primary: ['#E1306C', '#F77737'],
    instagram: ['#E1306C', '#833AB4', '#0095F6'],
    sunset: ['#FDC830', '#F37335'],
    ocean: ['#2193b0', '#6dd5ed'],
    forest: ['#134E5E', '#71B280'],
    warm: ['#E8DDD8', '#F8F8F8'],
    healing: ['#81B29A', '#F2CC8F'],
    carbs: ['#E07A5F', '#F2CC8F'],
    protein: ['#81B29A', '#B5D89A'],
    fat: ['#9B8AA0', '#C5B8D0'],
    calories: ['#E1306C', '#F77737'],
  },

  // 营养素颜色
  macroColors: {
    carbs: '#E07A5F',
    protein: '#81B29A',
    fat: '#9B8AA0',
    calories: '#E1306C',
  },
};

// 间距常量
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

// 圆角常量
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

// 字体大小常量
export const FONT_SIZES = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 48,
};

// 阴影样式 - 极轻柔和
export const SHADOWS = {
  none: {},
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
};

// 字体样式
export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -0.5, color: COLORS.textPrimary },
  h2: { fontSize: 24, fontWeight: '600' as const, letterSpacing: -0.3, color: COLORS.textPrimary },
  h3: { fontSize: 20, fontWeight: '600' as const, color: COLORS.textPrimary },
  body: { fontSize: 15, fontWeight: '400' as const, color: COLORS.textPrimary },
  caption: { fontSize: 13, fontWeight: '400' as const, color: COLORS.textSecondary },
  label: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.5, textTransform: 'uppercase' as const, color: COLORS.textMuted },
};

export default {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  FONT_SIZES,
  SHADOWS,
  TYPOGRAPHY,
};
