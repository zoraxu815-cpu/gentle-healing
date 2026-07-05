/**
 * 身体信息录入页面
 * 用于收集用户基本信息，计算BMI和每日卡路里建议
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '@/components/Screen';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/utils/theme';
import {
  ACTIVITY_LEVELS,
  GENDER_OPTIONS,
  GOAL_OPTIONS,
  calculateBMI,
  getBMICategory,
  generateWeightLossPlan,
  type UserProfile,
  type WeightLossPlan,
} from '@/utils/calorieCalculator';

const { width } = Dimensions.get('window');

export default function ProfileSetupScreen() {
  const router = useSafeRouter();
  // 表单状态
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [activityLevel, setActivityLevel] = useState<keyof typeof ACTIVITY_LEVELS>('light');
  const [goalWeight, setGoalWeight] = useState('');
  const [goal, setGoal] = useState<string>('lose_normal');
  
  // 预览状态
  const [showPreview, setShowPreview] = useState(false);
  const [plan, setPlan] = useState<WeightLossPlan | null>(null);

  // 计算BMI预览
  const getBMIPreview = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      return calculateBMI(h, w);
    }
    return null;
  };

  // 处理提交
  const handleSubmit = async () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseInt(age);
    const gw = parseFloat(goalWeight);

    if (!h || !w || !a || !gw) {
      return;
    }

    const profile: UserProfile = {
      height: h,
      weight: w,
      age: a,
      gender,
      activityLevel,
      goalWeight: gw,
      goal: goal as keyof typeof GOAL_OPTIONS,
    };

    const generatedPlan = generateWeightLossPlan(profile);
    setPlan(generatedPlan);
    setShowPreview(true);

    // 保存用户信息
    await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
    await AsyncStorage.setItem('weightLossPlan', JSON.stringify(generatedPlan));
  };

  // 确认完成
  const handleConfirm = async () => {
    // 标记已完成初始化
    await AsyncStorage.setItem('profileCompleted', 'true');
    // 返回上一页
    router.back();
  };

  const bmiPreview = getBMIPreview();
  const bmiCategory = bmiPreview ? getBMICategory(bmiPreview) : null;

  if (showPreview && plan) {
    return (
      <Screen style={styles.screen}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 头部 */}
          <View style={styles.previewHeader}>
            <LinearGradient
              colors={COLORS.gradients.forest as any}
              style={styles.previewHeaderGradient}
            >
              <Feather name="check-circle" size={48} color="white" />
              <Text style={styles.previewTitle}>你的专属计划</Text>
              <Text style={styles.previewSubtitle}>根据你的身体信息生成</Text>
            </LinearGradient>
          </View>

          {/* BMI卡片 */}
          <View style={styles.bmiCard}>
            <Text style={styles.cardTitle}>身体质量指数 (BMI)</Text>
            <View style={styles.bmiRow}>
              <Text style={[styles.bmiValue, { color: bmiCategory?.color }]}>
                {plan.bmi}
              </Text>
              <View style={styles.bmiInfo}>
                <View style={[styles.bmiBadge, { backgroundColor: bmiCategory?.color + '30' }]}>
                  <Text style={[styles.bmiCategory, { color: bmiCategory?.color }]}>
                    {plan.bmiCategory}
                  </Text>
                </View>
                <Text style={styles.bmiDesc}>{plan.bmiDesc}</Text>
              </View>
            </View>
          </View>

          {/* 目标卡片 */}
          <View style={styles.goalCard}>
            <View style={styles.goalRow}>
              <View style={styles.goalItem}>
                <Text style={styles.goalValue}>{plan.currentWeight}kg</Text>
                <Text style={styles.goalLabel}>当前体重</Text>
              </View>
              <Feather name="arrow-right" size={20} color={COLORS.textMuted} />
              <View style={styles.goalItem}>
                <Text style={styles.goalValue}>{plan.goalWeight}kg</Text>
                <Text style={styles.goalLabel}>目标体重</Text>
              </View>
            </View>
            <View style={styles.goalSummary}>
              <Text style={styles.goalSummaryText}>
                计划 {plan.weeksNeeded} 周达成，减重 {Math.abs(plan.totalToLose).toFixed(1)}kg
              </Text>
            </View>
          </View>

          {/* 每日建议卡片 */}
          <View style={styles.calorieCard}>
            <Text style={styles.cardTitle}>每日卡路里建议</Text>
            <View style={styles.mainCalorie}>
              <Text style={styles.mainCalorieValue}>{plan.dailyCalorieLimit}</Text>
              <Text style={styles.mainCalorieUnit}>千卡/天</Text>
            </View>
            <View style={styles.mealDistribution}>
              <View style={styles.mealItem}>
                <Text style={styles.mealValue}>{plan.dailyCalories.breakfast}</Text>
                <Text style={styles.mealLabel}>早餐</Text>
              </View>
              <View style={styles.mealItem}>
                <Text style={styles.mealValue}>{plan.dailyCalories.lunch}</Text>
                <Text style={styles.mealLabel}>午餐</Text>
              </View>
              <View style={styles.mealItem}>
                <Text style={styles.mealValue}>{plan.dailyCalories.dinner}</Text>
                <Text style={styles.mealLabel}>晚餐</Text>
              </View>
              <View style={styles.mealItem}>
                <Text style={styles.mealValue}>{plan.dailyCalories.snacks}</Text>
                <Text style={styles.mealLabel}>零食</Text>
              </View>
            </View>
          </View>

          {/* 本周重点 */}
          <View style={styles.tipsCard}>
            <Text style={styles.cardTitle}>本周重点</Text>
            <Text style={styles.weeklyFocus}>{plan.weeklyPlan.focus}</Text>
            <View style={styles.tipsList}>
              {plan.weeklyPlan.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Feather name="check" size={16} color={COLORS.accent} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 确认按钮 */}
          <TouchableOpacity onPress={handleConfirm} activeOpacity={0.8}>
            <LinearGradient
              colors={COLORS.gradients.primary as any}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmButtonText}>开始记录</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 头部 */}
        <View style={styles.header}>
          <Text style={styles.title}>欢迎来到温柔疗愈</Text>
          <Text style={styles.subtitle}>让我们先了解一下你的身体</Text>
        </View>

        {/* 性别选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>性别</Text>
          <View style={styles.genderRow}>
            {GENDER_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.genderOption,
                  gender === option.value && styles.genderOptionActive,
                ]}
                onPress={() => setGender(option.value as 'male' | 'female')}
              >
                <Feather
                  name={option.icon as any}
                  size={24}
                  color={gender === option.value ? 'white' : COLORS.textSecondary}
                />
                <Text
                  style={[
                    styles.genderLabel,
                    gender === option.value && styles.genderLabelActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 身高体重 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>身体数据</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>身高 (cm)</Text>
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                placeholder="170"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>当前体重 (kg)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholder="65"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>
          </View>
        </View>

        {/* BMI预览 */}
        {bmiPreview && (
          <View style={styles.bmiPreviewCard}>
            <View style={styles.bmiPreviewRow}>
              <Text style={styles.bmiPreviewLabel}>你的BMI</Text>
              <Text style={[styles.bmiPreviewValue, { color: bmiCategory?.color }]}>
                {bmiPreview.toFixed(1)}
              </Text>
              <View style={[styles.bmiPreviewBadge, { backgroundColor: bmiCategory?.color + '30' }]}>
                <Text style={[styles.bmiPreviewBadgeText, { color: bmiCategory?.color }]}>
                  {bmiCategory?.label}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* 年龄 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>年龄</Text>
          <TextInput
            style={styles.inputFull}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            placeholder="25"
            placeholderTextColor={COLORS.textMuted}
          />
        </View>

        {/* 活动水平 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>活动水平</Text>
          <View style={styles.activityList}>
            {Object.entries(ACTIVITY_LEVELS).map(([key, option]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.activityOption,
                  activityLevel === key && styles.activityOptionActive,
                ]}
                onPress={() => setActivityLevel(key as keyof typeof ACTIVITY_LEVELS)}
              >
                <Text
                  style={[
                    styles.activityLabel,
                    activityLevel === key && styles.activityLabelActive,
                  ]}
                >
                  {option.label}
                </Text>
                <Text style={styles.activityDesc}>{option.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 目标 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>减重目标</Text>
          <View style={styles.goalList}>
            {GOAL_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.goalOption,
                  goal === option.value && styles.goalOptionActive,
                ]}
                onPress={() => setGoal(option.value)}
              >
                <View style={styles.goalOptionHeader}>
                  <Text
                    style={[
                      styles.goalOptionLabel,
                      goal === option.value && styles.goalOptionLabelActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text style={styles.goalOptionWeekly}>{option.weeklyLoss}/周</Text>
                </View>
                <Text style={styles.goalOptionDesc}>{option.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 目标体重 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>目标体重 (kg)</Text>
          <TextInput
            style={styles.inputFull}
            value={goalWeight}
            onChangeText={setGoalWeight}
            keyboardType="numeric"
            placeholder="60"
            placeholderTextColor={COLORS.textMuted}
          />
        </View>

        {/* 生成按钮 */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!height || !weight || !age || !goalWeight) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!height || !weight || !age || !goalWeight}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={(height && weight && age && goalWeight) ? COLORS.gradients.primary as any : ['#cccccc', '#dddddd']}
            style={styles.submitGradient}
          >
            <Text style={styles.submitButtonText}>生成我的专属计划</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  header: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  genderRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  genderOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.sm,
    ...SHADOWS.soft,
  },
  genderOptionActive: {
    backgroundColor: COLORS.primary,
  },
  genderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  genderLabelActive: {
    color: 'white',
  },
  inputRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    ...SHADOWS.soft,
  },
  inputFull: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    ...SHADOWS.soft,
  },
  bmiPreviewCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.soft,
  },
  bmiPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  bmiPreviewLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  bmiPreviewValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  bmiPreviewBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  bmiPreviewBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activityList: {
    gap: SPACING.sm,
  },
  activityOption: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.soft,
  },
  activityOptionActive: {
    backgroundColor: COLORS.accent + '30',
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  activityLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  activityLabelActive: {
    color: COLORS.accent,
  },
  activityDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  goalList: {
    gap: SPACING.sm,
  },
  goalOption: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.soft,
  },
  goalOptionActive: {
    backgroundColor: COLORS.accent + '30',
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  goalOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  goalOptionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  goalOptionLabelActive: {
    color: COLORS.accent,
  },
  goalOptionWeekly: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  goalOptionDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  submitButton: {
    marginTop: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitGradient: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: 'white',
  },
  bottomSpace: {
    height: SPACING.xxl,
  },
  // Preview styles
  previewHeader: {
    marginHorizontal: -SPACING.lg,
    marginBottom: SPACING.lg,
  },
  previewHeaderGradient: {
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xl,
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginTop: SPACING.md,
  },
  previewSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: SPACING.xs,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  bmiCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  bmiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  bmiValue: {
    fontSize: 48,
    fontWeight: '800',
  },
  bmiInfo: {
    flex: 1,
  },
  bmiBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: 4,
  },
  bmiCategory: {
    fontSize: 14,
    fontWeight: '600',
  },
  bmiDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  goalCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
  },
  goalItem: {
    alignItems: 'center',
  },
  goalValue: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  goalLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  goalSummary: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.textMuted + '30',
  },
  goalSummaryText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  calorieCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  mainCalorie: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  mainCalorieValue: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.primary,
  },
  mainCalorieUnit: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  mealDistribution: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: COLORS.textMuted + '20',
    paddingTop: SPACING.md,
  },
  mealItem: {
    alignItems: 'center',
  },
  mealValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  mealLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tipsCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.card,
  },
  weeklyFocus: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.accent,
    marginBottom: SPACING.md,
  },
  tipsList: {
    gap: SPACING.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  confirmButton: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    padding: SPACING.md,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: 'white',
  },
});
