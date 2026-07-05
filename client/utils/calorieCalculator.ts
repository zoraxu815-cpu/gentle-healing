/**
 * 卡路里计算工具
 * 基于 Mifflin-St Jeor 公式计算 BMR 和 TDEE
 */

// 活动水平系数
export const ACTIVITY_LEVELS = {
  sedentary: { value: 1.2, label: '久坐（很少运动）', desc: '日常活动主要是坐着，很少运动' },
  light: { value: 1.375, label: '轻度活跃', desc: '每周运动1-3天' },
  moderate: { value: 1.55, label: '中度活跃', desc: '每周运动3-5天' },
  active: { value: 1.725, label: '高度活跃', desc: '每周运动6-7天' },
  veryActive: { value: 1.9, label: '非常活跃', desc: '每天高强度运动或体力工作' },
};

// 性别选项
export const GENDER_OPTIONS = [
  { value: 'male', label: '男', icon: 'user' },
  { value: 'female', label: '女', icon: 'heart' },
];

// 目标选项
export const GOAL_OPTIONS = [
  { value: 'lose_aggressive', label: '快速减重', caloriesDiff: -500, desc: '每周减重0.75-1kg', weeklyLoss: '0.75-1kg' },
  { value: 'lose_normal', label: '健康减重', caloriesDiff: -350, desc: '每周减重0.5-0.75kg', weeklyLoss: '0.5-0.75kg' },
  { value: 'lose_gentle', label: '温和减重', caloriesDiff: -200, desc: '每周减重0.25-0.5kg', weeklyLoss: '0.25-0.5kg' },
  { value: 'maintain', label: '保持现状', caloriesDiff: 0, desc: '维持当前体重', weeklyLoss: '0kg' },
  { value: 'gain', label: '健康增重', caloriesDiff: 300, desc: '健康地增加体重', weeklyLoss: '+0.25kg' },
];

export interface UserProfile {
  height: number;        // 身高(cm)
  weight: number;        // 体重(kg)
  age: number;           // 年龄
  gender: 'male' | 'female';
  activityLevel: keyof typeof ACTIVITY_LEVELS;
  goalWeight: number;   // 目标体重(kg)
  goal: keyof typeof GOAL_OPTIONS;
  tdee?: number; // 每日总消耗卡路里 (自动计算)
}

/**
 * 计算BMI
 * BMI = 体重(kg) / 身高(m)^2
 */
export function calculateBMI(height: number, weight: number): number {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

/**
 * 获取BMI分类
 */
export function getBMICategory(bmi: number): { label: string; color: string; desc: string } {
  if (bmi < 18.5) {
    return { 
      label: '偏瘦', 
      color: '#A8E6CF',
      desc: '建议适当增加营养摄入'
    };
  } else if (bmi < 24) {
    return { 
      label: '正常', 
      color: '#A8E6CF',
      desc: '继续保持健康的生活方式'
    };
  } else if (bmi < 28) {
    return { 
      label: '超重', 
      color: '#FFE5B4',
      desc: '适当控制饮食会增加健康'
    };
  } else {
    return { 
      label: '肥胖', 
      color: '#FFB8B8',
      desc: '建议咨询医生制定计划'
    };
  }
}

/**
 * 基于 Mifflin-St Jeor 公式计算BMR
 * 男性: BMR = 10*体重(kg) + 6.25*身高(cm) - 5*年龄 + 5
 * 女性: BMR = 10*体重(kg) + 6.25*身高(cm) - 5*年龄 - 161
 */
export function calculateBMR(profile: UserProfile): number {
  const { weight, height, age, gender } = profile;
  const baseBMR = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? baseBMR + 5 : baseBMR - 161;
}

/**
 * 计算TDEE (Total Daily Energy Expenditure)
 * TDEE = BMR * 活动系数
 */
export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile);
  const activityFactor = ACTIVITY_LEVELS[profile.activityLevel].value;
  return Math.round(bmr * activityFactor);
}

/**
 * 计算每日卡路里建议上限
 * 建议摄入 = TDEE + 热量差
 */
export function calculateDailyCalorieLimit(profile: UserProfile): number {
  const tdee = calculateTDEE(profile);
  const goalConfig = GOAL_OPTIONS.find(g => g.value === profile.goal);
  const caloriesDiff = goalConfig?.caloriesDiff || 0;
  return Math.round(tdee + caloriesDiff);
}

/**
 * 生成瘦身计划
 */
export interface WeightLossPlan {
  currentWeight: number;
  goalWeight: number;
  totalToLose: number;
  weeklyLoss: string;
  weeksNeeded: number;
  dailyCalorieLimit: number;
  bmi: number;
  bmiCategory: string;
  bmiDesc: string;
  dailyCalories: {
    breakfast: number;   // 早餐建议
    lunch: number;       // 午餐建议
    dinner: number;      // 晚餐建议
    snacks: number;      // 零食建议
  };
  weeklyPlan: {
    focus: string;
    tips: string[];
  };
}

export function generateWeightLossPlan(profile: UserProfile): WeightLossPlan {
  const { weight, goalWeight } = profile;
  const bmi = calculateBMI(profile.height, profile.weight);
  const bmiCategory = getBMICategory(bmi);
  const dailyLimit = calculateDailyCalorieLimit(profile);
  const goalConfig = GOAL_OPTIONS.find(g => g.value === profile.goal);
  
  const totalToLose = weight - goalWeight;
  const weeklyLossKg = Math.abs(goalConfig?.caloriesDiff || 0) / 7700; // 约7700卡路里 = 1kg
  const weeksNeeded = totalToLose > 0 ? Math.ceil(totalToLose / weeklyLossKg) : 52;

  // 分配三餐卡路里
  return {
    currentWeight: weight,
    goalWeight: goalWeight,
    totalToLose: totalToLose,
    weeklyLoss: goalConfig?.weeklyLoss || '0kg',
    weeksNeeded: weeksNeeded,
    dailyCalorieLimit: dailyLimit,
    bmi: Math.round(bmi * 10) / 10,
    bmiCategory: bmiCategory.label,
    bmiDesc: bmiCategory.desc,
    dailyCalories: {
      breakfast: Math.round(dailyLimit * 0.3),   // 30%
      lunch: Math.round(dailyLimit * 0.35),       // 35%
      dinner: Math.round(dailyLimit * 0.25),       // 25%
      snacks: Math.round(dailyLimit * 0.1),       // 10%
    },
    weeklyPlan: {
      focus: getWeeklyFocus(profile),
      tips: getWeeklyTips(profile),
    },
  };
}

function getWeeklyFocus(profile: UserProfile): string {
  const bmi = calculateBMI(profile.height, profile.weight);
  if (bmi < 18.5) {
    return '健康增重，重点是均衡营养';
  } else if (bmi < 24) {
    return '保持健康，培养好习惯';
  } else if (bmi < 28) {
    return '温和减重，循序渐进';
  } else {
    return '健康减重，养成习惯';
  }
}

function getWeeklyTips(profile: UserProfile): string[] {
  const tips = [
    '每餐细嚼慢咽，感受食物的美味',
    '专注吃饭，避免边吃边看手机',
    '感到饥饿时先喝一杯温水',
    '记录饮食可以帮助更好了解自己',
    '适度运动，从散步开始',
    '保证充足睡眠，7-8小时最佳',
    '给自己一些弹性，不必过于严格',
  ];
  
  // 随机选择4条
  const shuffled = tips.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4);
}

/**
 * 计算剩余卡路里
 */
export function getCalorieStatus(current: number, limit: number): {
  remaining: number;
  percent: number;
  status: 'good' | 'warning' | 'over';
  message: string;
} {
  const remaining = limit - current;
  const percent = (current / limit) * 100;
  
  if (percent < 80) {
    return {
      remaining,
      percent,
      status: 'good',
      message: '继续保持，今天的你很棒',
    };
  } else if (percent < 100) {
    return {
      remaining,
      percent,
      status: 'warning',
      message: '接近目标了，可以选择更轻盈的食物',
    };
  } else {
    return {
      remaining,
      percent,
      status: 'over',
      message: '今天吃多了也没关系，明天继续加油',
    };
  }
}

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 从本地存储获取用户配置
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const data = await AsyncStorage.getItem('userProfile');
    if (data) {
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Error loading user profile:', error);
    return null;
  }
}
