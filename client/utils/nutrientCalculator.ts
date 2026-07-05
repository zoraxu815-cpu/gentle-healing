/**
 * 营养素计算工具
 * 根据用户信息和TDEE计算每日营养素建议摄入量
 */

// 营养素比例配置
export const NUTRIENT_RATIOS = {
  // 减重期（蛋白质适当提高，保护肌肉）
  weightLoss: {
    carbs: 0.40, // 碳水占40%
    protein: 0.35, // 蛋白质占35%
    fat: 0.25, // 脂肪占25%
  },
  // 维持期
  maintenance: {
    carbs: 0.50,
    protein: 0.25,
    fat: 0.25,
  },
  // 增肌期（蛋白质高，碳水适中）
  muscleGain: {
    carbs: 0.45,
    protein: 0.30,
    fat: 0.25,
  },
};

export interface NutrientIntake {
  calories: number;
  carbs: number; // 克
  protein: number; // 克
  fat: number; // 克
}

export interface NutrientSuggestion {
  daily: NutrientIntake;
  breakfast: NutrientIntake;
  lunch: NutrientIntake;
  dinner: NutrientIntake;
  snack: NutrientIntake;
}

// 每克营养素的卡路里
export const CALORIES_PER_GRAM = {
  carbs: 4,
  protein: 4,
  fat: 9,
};

/**
 * 根据目标类型和TDEE计算每日营养素建议
 */
export const calculateDailyNutrients = (
  tdee: number,
  goal: string = 'loss'
): NutrientSuggestion => {
  // 根据目标调整TDEE
  let targetCalories = tdee;
  if (goal === 'loss') {
    targetCalories = Math.round(tdee * 0.85); // 减重时减少15%热量
  } else if (goal === 'gain') {
    targetCalories = Math.round(tdee * 1.10); // 增肌时增加10%热量
  }

  // 获取营养素比例
  const ratios = goal === 'loss' ? NUTRIENT_RATIOS.weightLoss : NUTRIENT_RATIOS.maintenance;

  // 计算每日各营养素克数
  const dailyCarbs = Math.round((targetCalories * ratios.carbs) / CALORIES_PER_GRAM.carbs);
  const dailyProtein = Math.round((targetCalories * ratios.protein) / CALORIES_PER_GRAM.protein);
  const dailyFat = Math.round((targetCalories * ratios.fat) / CALORIES_PER_GRAM.fat);
  const dailyCalories = Math.round(targetCalories);

  // 三餐分配比例（减重期更强调蛋白质）
  const breakfastCarbsRatio = goal === 'loss' ? 0.25 : 0.30;
  const breakfastProteinRatio = goal === 'loss' ? 0.30 : 0.25;
  const breakfastFatRatio = 0.20;

  const lunchCarbsRatio = goal === 'loss' ? 0.35 : 0.40;
  const lunchProteinRatio = goal === 'loss' ? 0.35 : 0.30;
  const lunchFatRatio = 0.35;

  const dinnerCarbsRatio = goal === 'loss' ? 0.25 : 0.25;
  const dinnerProteinRatio = goal === 'loss' ? 0.30 : 0.35;
  const dinnerFatRatio = 0.30;

  const snackCarbsRatio = goal === 'loss' ? 0.15 : 0.05;
  const snackProteinRatio = goal === 'loss' ? 0.05 : 0.10;
  const snackFatRatio = 0.15;

  return {
    daily: {
      calories: dailyCalories,
      carbs: dailyCarbs,
      protein: dailyProtein,
      fat: dailyFat,
    },
    breakfast: {
      calories: Math.round(dailyCalories * 0.25),
      carbs: Math.round(dailyCarbs * breakfastCarbsRatio),
      protein: Math.round(dailyProtein * breakfastProteinRatio),
      fat: Math.round(dailyFat * breakfastFatRatio),
    },
    lunch: {
      calories: Math.round(dailyCalories * 0.35),
      carbs: Math.round(dailyCarbs * lunchCarbsRatio),
      protein: Math.round(dailyProtein * lunchProteinRatio),
      fat: Math.round(dailyFat * lunchFatRatio),
    },
    dinner: {
      calories: Math.round(dailyCalories * 0.30),
      carbs: Math.round(dailyCarbs * dinnerCarbsRatio),
      protein: Math.round(dailyProtein * dinnerProteinRatio),
      fat: Math.round(dailyFat * dinnerFatRatio),
    },
    snack: {
      calories: Math.round(dailyCalories * 0.10),
      carbs: Math.round(dailyCarbs * snackCarbsRatio),
      protein: Math.round(dailyProtein * snackProteinRatio),
      fat: Math.round(dailyFat * snackFatRatio),
    },
  };
};

/**
 * 计算营养素百分比进度
 */
export const calculateNutrientProgress = (
  current: number,
  target: number
): { percentage: number; status: 'low' | 'good' | 'over' } => {
  if (target === 0) return { percentage: 0, status: 'low' };
  
  const percentage = Math.round((current / target) * 100);
  
  if (percentage < 80) {
    return { percentage, status: 'low' };
  } else if (percentage <= 105) {
    return { percentage, status: 'good' };
  } else {
    return { percentage, status: 'over' };
  }
};

/**
 * 获取营养素状态颜色
 */
export const getNutrientColor = (
  status: 'low' | 'good' | 'over'
): string => {
  switch (status) {
    case 'low':
      return '#A0A0A0'; // 灰色-不足
    case 'good':
      return '#5A5A5A'; // 深灰-刚好
    case 'over':
      return '#C4A89F'; // 强调色-超出
    default:
      return '#A0A0A0';
  }
};

/**
 * 格式化营养素数值
 */
export const formatNutrient = (
  value: number,
  unit: 'g' | 'kcal' = 'g'
): string => {
  return `${Math.round(value)}${unit}`;
};

/**
 * 获取温和建议文案
 */
export const getGentleSuggestion = (
  nutrients: {
    carbs: { current: number; target: number };
    protein: { current: number; target: number };
    fat: { current: number; target: number };
  }
): string => {
  const { carbs, protein, fat } = nutrients;

  // 计算差距
  const carbsDiff = Math.round(carbs.target - carbs.current);
  const proteinDiff = Math.round(protein.target - protein.current);
  const fatDiff = Math.round(fat.target - fat.current);

  // 优先建议蛋白质不足
  if (proteinDiff > 10) {
    return `蛋白质还差${proteinDiff}g，晚餐可以加一份鸡胸肉或豆腐`;
  }

  // 碳水建议
  if (carbsDiff > 15) {
    return `碳水还差${carbsDiff}g，可以吃一份全谷物或水果`;
  }

  // 脂肪建议
  if (fatDiff > 10) {
    return `优质脂肪不足，可以加一小把坚果`;
  }

  // 整体评价
  const totalProgress = ((carbs.current + protein.current + fat.current) / 
    (carbs.target + protein.target + fat.target)) * 100;

  if (totalProgress >= 95 && totalProgress <= 105) {
    return '今日营养摄入很均衡，继续保持';
  } else if (totalProgress < 80) {
    return '今日摄入略少，记得按时用餐';
  } else {
    return '今日摄入充足，注意不要过量';
  }
};

export default {
  calculateDailyNutrients,
  calculateNutrientProgress,
  getNutrientColor,
  formatNutrient,
  getGentleSuggestion,
  NUTRIENT_RATIOS,
  CALORIES_PER_GRAM,
};
