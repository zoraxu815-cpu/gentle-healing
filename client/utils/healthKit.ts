/**
 * Apple HealthKit 数据集成
 * 用于从苹果健康App导入运动数据
 */

import { Platform } from 'react-native';

// 注意：在实际部署时需要在 app.json 中配置 HealthKit 权限
// Apple HealthKit 仅在 iOS 设备上可用

export interface HealthData {
  steps: number;
  activeEnergy: number;        // 活动能量消耗（卡路里）
  exerciseMinutes: number;     // 运动分钟数
  standHours: number;          // 站立小时数
  heartRate: number | null;    // 心率
  sleepHours: number | null;   // 睡眠时长
  distance: number;            // 步行+跑步距离（米）
  workouts: WorkoutData[];
}

export interface WorkoutData {
  type: string;
  duration: number;            // 分钟
  calories: number;
  startDate: string;
  distance?: number;
}

export interface HealthPermissionStatus {
  steps: boolean;
  activeEnergy: boolean;
  exerciseMinutes: boolean;
  heartRate: boolean;
  sleep: boolean;
}

/**
 * 检查HealthKit是否可用（仅iOS）
 */
export const isHealthKitAvailable = (): boolean => {
  return Platform.OS === 'ios';
};

/**
 * 请求HealthKit权限
 */
export const requestHealthKitPermissions = async (): Promise<HealthPermissionStatus> => {
  // 模拟权限请求（实际需要使用 react-native-health 或 expo-health-connect）
  // 返回默认权限状态
  return {
    steps: true,
    activeEnergy: true,
    exerciseMinutes: true,
    heartRate: true,
    sleep: true,
  };
};

/**
 * 获取今日健康数据
 * 实际实现需要使用 react-native-health 或 expo-health-connect
 */
export const fetchTodayHealthData = async (): Promise<HealthData> => {
  // 检查平台
  if (!isHealthKitAvailable()) {
    console.log('HealthKit is only available on iOS');
    return getMockHealthData();
  }

  try {
    // 实际实现需要使用 react-native-health 或 expo-health-connect
    // 这里返回模拟数据，实际部署时替换为真实API调用
    return getMockHealthData();
  } catch (error) {
    console.error('Error fetching health data:', error);
    return getMockHealthData();
  }
};

/**
 * 获取Mock健康数据（用于开发和测试）
 */
export const getMockHealthData = (): HealthData => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));

  return {
    steps: Math.floor(Math.random() * 5000) + 3000, // 3000-8000步
    activeEnergy: Math.floor(Math.random() * 200) + 100, // 100-300卡路里
    exerciseMinutes: Math.floor(Math.random() * 30) + 10, // 10-40分钟
    standHours: Math.floor(Math.random() * 6) + 4, // 4-10小时
    heartRate: Math.floor(Math.random() * 20) + 65, // 65-85bpm
    sleepHours: Math.random() * 3 + 6, // 6-9小时
    distance: Math.floor(Math.random() * 3000) + 2000, // 2-5公里
    workouts: [
      {
        type: 'Walking',
        duration: 30,
        calories: 120,
        startDate: startOfDay.toISOString(),
        distance: 2500,
      },
    ],
  };
};

/**
 * 获取今日步数
 */
export const fetchTodaySteps = async (): Promise<number> => {
  const data = await fetchTodayHealthData();
  return data.steps;
};

/**
 * 获取今日运动消耗卡路里
 */
export const fetchTodayActiveCalories = async (): Promise<number> => {
  const data = await fetchTodayHealthData();
  return data.activeEnergy;
};

/**
 * 获取今日运动时长（分钟）
 */
export const fetchTodayExerciseMinutes = async (): Promise<number> => {
  const data = await fetchTodayHealthData();
  return data.exerciseMinutes;
};

/**
 * 获取今日心率
 */
export const fetchTodayHeartRate = async (): Promise<number | null> => {
  const data = await fetchTodayHealthData();
  return data.heartRate;
};

/**
 * 格式化步数为可读字符串
 */
export const formatSteps = (steps: number): string => {
  if (steps >= 10000) {
    return `${(steps / 10000).toFixed(1)}万`;
  }
  return steps.toLocaleString();
};

/**
 * 格式化距离
 */
export const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)}km`;
  }
  return `${meters}m`;
};

/**
 * 获取步行/跑步距离的卡路里估算
 */
export const estimateDistanceCalories = (meters: number, weightKg: number = 60): number => {
  // 步行约 0.5卡/米, 跑步约 1卡/米
  const avgCaloriesPerMeter = 0.6;
  return Math.round(meters * avgCaloriesPerMeter * (weightKg / 60));
};

export default {
  isHealthKitAvailable,
  requestHealthKitPermissions,
  fetchTodayHealthData,
  fetchTodaySteps,
  fetchTodayActiveCalories,
  fetchTodayExerciseMinutes,
  fetchTodayHeartRate,
  formatSteps,
  formatDistance,
  estimateDistanceCalories,
  getMockHealthData,
};
