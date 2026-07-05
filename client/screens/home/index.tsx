/**
 * 首页 - Ins极简风格
 * 展示今日摘要、健康数据卡片、文献入口
 */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '@/utils/theme';
import { fetchTodaySteps, formatSteps, fetchTodayActiveCalories, fetchTodayExerciseMinutes } from '@/utils/healthKit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

interface UserProfile {
  height?: number;
  weight?: number;
  age?: number;
  gender?: string;
  activityLevel?: string;
  goalWeight?: number;
  dailyCalorieLimit?: number;
}

interface DailyRecord {
  calories: number;
  date: string;
  meals?: any[];
  exercises?: any[];
  weight?: number;
  mood?: string;
}

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [todayRecord, setTodayRecord] = useState<DailyRecord | null>(null);
  const [healthData, setHealthData] = useState({
    steps: 0,
    calories: 0,
    exerciseMinutes: 0,
  });

  // 加载数据
  const loadData = async () => {
    try {
      const [profileData, recordData] = await Promise.all([
        AsyncStorage.getItem('userProfile'),
        AsyncStorage.getItem(`record_${new Date().toISOString().split('T')[0]}`),
      ]);
      
      if (profileData) setProfile(JSON.parse(profileData));
      if (recordData) setTodayRecord(JSON.parse(recordData));

      // 获取Apple Health数据
      const [steps, calories, minutes] = await Promise.all([
        fetchTodaySteps().catch(() => 0),
        fetchTodayActiveCalories().catch(() => 0),
        fetchTodayExerciseMinutes().catch(() => 0),
      ]);
      
      setHealthData({ steps, calories, exerciseMinutes: minutes });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const todayCalories = todayRecord?.calories || 0;
  const calorieLimit = profile?.dailyCalorieLimit || 1800;
  const calorieProgress = Math.min((todayCalories / calorieLimit) * 100, 100);

  const netCalories = todayCalories - healthData.calories;
  const isOverLimit = todayCalories > calorieLimit;

  return (
    <Screen>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 头部 - 极简日期 */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Today</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('zh-CN', {
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Feather name="user" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* 今日摘要 - 数字卡片 */}
        <View style={styles.summarySection}>
          <View style={styles.mainCard}>
            <View style={styles.mainCardHeader}>
              <Text style={styles.mainCardLabel}>Calories</Text>
              <Text style={styles.mainCardUnit}>kcal</Text>
            </View>
            <Text style={styles.mainCardValue}>
              {todayCalories}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${calorieProgress}%`,
                    backgroundColor: isOverLimit ? COLORS.warning : COLORS.success,
                  }
                ]} 
              />
            </View>
            <Text style={styles.mainCardSubtext}>
              of {calorieLimit} kcal limit
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Feather name="minus" size={16} color={COLORS.textMuted} />
              <Text style={styles.statValue}>{healthData.calories}</Text>
              <Text style={styles.statLabel}>Burned</Text>
            </View>
            <View style={styles.statCard}>
              <Feather name="minus" size={16} color={COLORS.textMuted} />
              <Text style={styles.statValue}>{netCalories}</Text>
              <Text style={styles.statLabel}>Net</Text>
            </View>
            <View style={styles.statCard}>
              <Feather name="target" size={16} color={COLORS.textMuted} />
              <Text style={styles.statValue}>{calorieLimit - todayCalories > 0 ? calorieLimit - todayCalories : 0}</Text>
              <Text style={styles.statLabel}>Remaining</Text>
            </View>
          </View>
        </View>

        {/* Apple Health 数据 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>From Apple Health</Text>
          <View style={styles.healthGrid}>
            <View style={styles.healthCard}>
              <Feather name="activity" size={20} color={COLORS.textPrimary} />
              <Text style={styles.healthValue}>{formatSteps(healthData.steps)}</Text>
              <Text style={styles.healthLabel}>Steps</Text>
            </View>
            <View style={styles.healthCard}>
              <Feather name="activity" size={20} color={COLORS.textPrimary} />
              <Text style={styles.healthValue}>{healthData.exerciseMinutes}</Text>
              <Text style={styles.healthLabel}>Minutes</Text>
            </View>
            <View style={styles.healthCard}>
              <Feather name="zap" size={20} color={COLORS.textPrimary} />
              <Text style={styles.healthValue}>{healthData.calories}</Text>
              <Text style={styles.healthLabel}>Active</Text>
            </View>
          </View>
        </View>

        {/* 文献入口 */}
        <TouchableOpacity style={styles.articleCard}>
          <View style={styles.articleIconContainer}>
            <Feather name="book-open" size={20} color={COLORS.accent} />
          </View>
          <View style={styles.articleContent}>
            <Text style={styles.articleTitle}>Today&apos;s Reading</Text>
            <Text style={styles.articleSubtitle}>Latest research insights</Text>
          </View>
          <Feather name="chevron-right" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>

        {/* 今日建议 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mindful Tips</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <View style={styles.tipIcon}>
                <Feather name="feather" size={16} color={COLORS.accent} />
              </View>
              <Text style={styles.tipText}>Eat slowly. Savor each bite.</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipIcon}>
                <Feather name="droplet" size={16} color={COLORS.accent} />
              </View>
              <Text style={styles.tipText}>Stay hydrated. Drink water mindfully.</Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipIcon}>
                <Feather name="moon" size={16} color={COLORS.accent} />
              </View>
              <Text style={styles.tipText}>Rest well. Sleep 7-8 hours.</Text>
            </View>
          </View>
        </View>

        {/* 底部留白 */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  greeting: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  date: {
    fontSize: 24,
    fontWeight: '300',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summarySection: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  mainCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  mainCardHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.xs,
  },
  mainCardLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  mainCardUnit: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  mainCardValue: {
    fontSize: 56,
    fontWeight: '200',
    color: COLORS.textPrimary,
    letterSpacing: -2,
    marginBottom: SPACING.md,
  },
  progressBar: {
    height: 3,
    backgroundColor: COLORS.background,
    borderRadius: 2,
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  mainCardSubtext: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '300',
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: SPACING.md,
  },
  healthGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  healthCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  healthValue: {
    fontSize: 22,
    fontWeight: '300',
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
  },
  healthLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  articleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.card,
  },
  articleIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  articleContent: {
    flex: 1,
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  articleSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  tipsList: {
    gap: SPACING.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.soft,
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
  },
  bottomSpacer: {
    height: 100,
  },
});
