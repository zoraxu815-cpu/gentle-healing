/**
 * 运动卡路里科学计算工具
 * 基于MET值计算运动消耗卡路里
 * 公式：卡路里消耗 = MET × 体重(kg) × 运动时长(小时)
 */

export interface Exercise {
  id: string;
  name: string;
  nameCn: string;
  met: number;
  category: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'daily';
  icon: string;
  description: string;
}

// MET值数据库 - 基于Compendium of Physical Activities
export const EXERCISES: Exercise[] = [
  // 有氧运动 Cardio
  { id: 'walking_slow', name: 'Slow Walking', nameCn: '慢走', met: 2.8, category: 'cardio', icon: 'footprints', description: '普通速度慢走' },
  { id: 'walking_normal', name: 'Walking', nameCn: '快走', met: 3.8, category: 'cardio', icon: 'footprints', description: '正常速度步行' },
  { id: 'walking_brisk', name: 'Brisk Walking', nameCn: '暴走', met: 4.3, category: 'cardio', icon: 'footprints', description: '快步走，感觉稍累' },
  { id: 'jogging_light', name: 'Light Jogging', nameCn: '慢跑', met: 7.0, category: 'cardio', icon: 'run', description: '6km/h 慢跑' },
  { id: 'jogging_normal', name: 'Jogging', nameCn: '跑步', met: 8.3, category: 'cardio', icon: 'run', description: '8km/h 跑步' },
  { id: 'running', name: 'Running', nameCn: '快跑', met: 9.8, category: 'cardio', icon: 'run', description: '10km/h 以上' },
  { id: 'cycling_light', name: 'Light Cycling', nameCn: '轻松骑行', met: 4.0, category: 'cardio', icon: 'bike', description: '16km/h 以下' },
  { id: 'cycling_normal', name: 'Cycling', nameCn: '骑行', met: 6.8, category: 'cardio', icon: 'bike', description: '16-19km/h' },
  { id: 'cycling_fast', name: 'Fast Cycling', nameCn: '快速骑行', met: 10.0, category: 'cardio', icon: 'bike', description: '25km/h 以上' },
  { id: 'swimming_light', name: 'Light Swimming', nameCn: '轻松游泳', met: 5.8, category: 'cardio', icon: 'waves', description: '休闲蛙泳/仰泳' },
  { id: 'swimming_normal', name: 'Swimming', nameCn: '游泳', met: 7.0, category: 'cardio', icon: 'waves', description: '普通速度游泳' },
  { id: 'swimming_fast', name: 'Fast Swimming', nameCn: '快游', met: 9.8, category: 'cardio', icon: 'waves', description: '用力游泳' },
  { id: 'hiit', name: 'HIIT', nameCn: 'HIIT训练', met: 11.0, category: 'cardio', icon: 'zap', description: '高强度间歇训练' },
  { id: 'jump_rope', name: 'Jump Rope', nameCn: '跳绳', met: 11.8, category: 'cardio', icon: 'minus', description: '中等速度跳绳' },
  { id: 'elliptical', name: 'Elliptical', nameCn: '椭圆机', met: 5.0, category: 'cardio', icon: 'activity', description: '椭圆机训练' },
  { id: 'stair_climbing', name: 'Stair Climbing', nameCn: '爬楼梯', met: 8.8, category: 'cardio', icon: 'trending-up', description: '持续爬楼梯' },
  { id: 'dancing', name: 'Dancing', nameCn: '跳舞', met: 5.0, category: 'cardio', icon: 'music', description: '一般舞蹈' },
  { id: 'aerobics', name: 'Aerobics', nameCn: '有氧操', met: 6.0, category: 'cardio', icon: 'activity', description: '低冲击力有氧' },

  // 力量训练 Strength
  { id: 'weight_light', name: 'Light Weights', nameCn: '轻量力量', met: 3.5, category: 'strength', icon: 'dumbbell', description: '轻重量多次数' },
  { id: 'weight_heavy', name: 'Heavy Weights', nameCn: '重量训练', met: 6.0, category: 'strength', icon: 'dumbbell', description: '大重量少次数' },
  { id: 'bodyweight', name: 'Bodyweight Training', nameCn: '自重训练', met: 4.0, category: 'strength', icon: 'user', description: '俯卧撑/深蹲等' },
  { id: 'pilates', name: 'Pilates', nameCn: '普拉提', met: 3.8, category: 'strength', icon: 'stretch-horizontal', description: '普拉提训练' },
  { id: 'crossfit', name: 'CrossFit', nameCn: 'CrossFit', met: 12.0, category: 'strength', icon: 'flame', description: '高强度功能训练' },

  // 柔韧/放松 Flexibility
  { id: 'yoga_light', name: 'Light Yoga', nameCn: '轻松瑜伽', met: 2.0, category: 'flexibility', icon: 'heart', description: '拉伸放松瑜伽' },
  { id: 'yoga_power', name: 'Power Yoga', nameCn: '力量瑜伽', met: 4.0, category: 'flexibility', icon: 'heart', description: '力量瑜伽' },
  { id: 'stretching', name: 'Stretching', nameCn: '拉伸', met: 2.5, category: 'flexibility', icon: 'move', description: '全身拉伸' },

  // 球类运动 Sports
  { id: 'basketball', name: 'Basketball', nameCn: '篮球', met: 8.0, category: 'sports', icon: 'circle', description: '一般篮球比赛' },
  { id: 'tennis', name: 'Tennis', nameCn: '网球', met: 7.3, category: 'sports', icon: 'circle', description: '网球单打' },
  { id: 'badminton', name: 'Badminton', nameCn: '羽毛球', met: 5.5, category: 'sports', icon: 'circle', description: '休闲羽毛球' },
  { id: 'football', name: 'Football', nameCn: '足球', met: 8.0, category: 'sports', icon: 'circle', description: '足球比赛' },
  { id: 'table_tennis', name: 'Table Tennis', nameCn: '乒乓球', met: 4.0, category: 'sports', icon: 'circle', description: '乒乓球' },
  { id: 'golf', name: 'Golf', nameCn: '高尔夫', met: 3.8, category: 'sports', icon: 'target', description: '走路打高尔夫' },

  // 日常活动 Daily
  { id: 'housework_light', name: 'Light Housework', nameCn: '轻松家务', met: 2.3, category: 'daily', icon: 'home', description: '扫地/整理' },
  { id: 'housework_heavy', name: 'Heavy Housework', nameCn: '家务劳动', met: 4.0, category: 'daily', icon: 'home', description: '拖地/擦窗' },
  { id: 'gardening', name: 'Gardening', nameCn: '园艺', met: 3.8, category: 'daily', icon: 'flower', description: '种植/浇水' },
  { id: 'climbing', name: 'Climbing', nameCn: '登山', met: 8.5, category: 'daily', icon: 'mountain', description: '爬山' },
];

/**
 * 计算运动消耗卡路里
 * @param met MET值
 * @param weightKg 体重（公斤）
 * @param durationMinutes 运动时长（分钟）
 * @returns 消耗卡路里（千卡）
 */
export const calculateCaloriesBurned = (
  met: number,
  weightKg: number,
  durationMinutes: number
): number => {
  // 公式：MET × 体重(kg) × 时长(小时)
  const hours = durationMinutes / 60;
  const calories = met * weightKg * hours;
  return Math.round(calories);
};

/**
 * 根据运动ID计算消耗
 */
export const calculateByExerciseId = (
  exerciseId: string,
  weightKg: number,
  durationMinutes: number
): number => {
  const exercise = EXERCISES.find(e => e.id === exerciseId);
  if (!exercise) return 0;
  return calculateCaloriesBurned(exercise.met, weightKg, durationMinutes);
};

/**
 * 根据运动对象计算消耗
 */
export const calculateByExercise = (
  exercise: Exercise,
  weightKg: number,
  durationMinutes: number
): number => {
  return calculateCaloriesBurned(exercise.met, weightKg, durationMinutes);
};

/**
 * 获取某类别的所有运动
 */
export const getExercisesByCategory = (category: Exercise['category']): Exercise[] => {
  return EXERCISES.filter(e => e.category === category);
};

/**
 * 获取所有运动类别
 */
export const getCategories = (): Exercise['category'][] => {
  return ['cardio', 'strength', 'flexibility', 'sports', 'daily'];
};

/**
 * 搜索运动
 */
export const searchExercises = (query: string): Exercise[] => {
  const q = query.toLowerCase();
  return EXERCISES.filter(e => 
    e.name.toLowerCase().includes(q) || 
    e.nameCn.includes(query)
  );
};

/**
 * 获取今日推荐运动
 */
export const getRecommendedExercises = (): Exercise[] => {
  // 返回MET值适中、适合入门的运动
  return EXERCISES.filter(e => e.met >= 3 && e.met <= 6).slice(0, 6);
};

export default {
  EXERCISES,
  calculateCaloriesBurned,
  calculateByExerciseId,
  calculateByExercise,
  getExercisesByCategory,
  getCategories,
  searchExercises,
  getRecommendedExercises,
};
