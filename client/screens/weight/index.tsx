/**
 * 体重记录页面 - Ins极简风格
 * 体重追踪和曲线变化图
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/utils/theme';
import { calculateBMI, getBMICategory } from '@/utils/calorieCalculator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';

interface WeightRecord {
  date: string;
  weight: number;
}

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - SPACING.lg * 2;
const CHART_HEIGHT = 200;

export default function WeightScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [records, setRecords] = useState<WeightRecord[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [currentWeight, setCurrentWeight] = useState<number | null>(null);

  const today = new Date().toISOString().split('T')[0];


  const loadData = async () => {
    try {
      const [profileData, weightData] = await Promise.all([
        AsyncStorage.getItem('userProfile'),
        AsyncStorage.getItem('weightRecords'),
      ]);
      
      if (profileData) setProfile(JSON.parse(profileData));
      if (weightData) {
        const parsed = JSON.parse(weightData);
        setRecords(parsed);
        if (parsed.length > 0) {
          setCurrentWeight(parsed[parsed.length - 1].weight);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const saveWeight = async () => {
    const weight = parseFloat(weightInput);
    if (isNaN(weight) || weight <= 0) return;

    const newRecord: WeightRecord = { date: today, weight };
    const newRecords = records.filter(r => r.date !== today);
    newRecords.push(newRecord);
    newRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    await AsyncStorage.setItem('weightRecords', JSON.stringify(newRecords));
    setRecords(newRecords);
    setCurrentWeight(weight);
    setModalVisible(false);
    setWeightInput('');
  };

  // 计算BMI
  const bmi = profile?.height ? calculateBMI(currentWeight || 70, profile.height) : null;
  const bmiCategory = bmi ? getBMICategory(bmi) : null;
  const bmiSuggestion = null;

  // 绘制体重曲线
  const renderChart = () => {
    if (records.length < 2) {
      return (
        <View style={styles.emptyChart}>
          <Text style={styles.emptyChartText}>Add more records to see your progress</Text>
        </View>
      );
    }

    const weights = records.map(r => r.weight);
    const minWeight = Math.min(...weights) - 2;
    const maxWeight = Math.max(...weights) + 2;
    const range = maxWeight - minWeight;

    const points = records.map((r, i) => {
      const x = (i / (records.length - 1)) * (CHART_WIDTH - 40) + 20;
      const y = CHART_HEIGHT - 40 - ((r.weight - minWeight) / range) * (CHART_HEIGHT - 80);
      return { x, y, weight: r.weight };
    });

    const pathData = points.reduce((acc, p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      return `${acc} L ${p.x} ${p.y}`;
    }, '');

    return (
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        {/* 网格线 */}
        <Line x1={20} y1={20} x2={20} y2={CHART_HEIGHT - 40} stroke={COLORS.border} strokeWidth={1} />
        <Line x1={20} y1={CHART_HEIGHT - 40} x2={CHART_WIDTH - 20} y2={CHART_HEIGHT - 40} stroke={COLORS.border} strokeWidth={1} />
        
        {/* Y轴标签 */}
        <SvgText x={10} y={30} fontSize={10} fill={COLORS.textMuted}>{maxWeight.toFixed(0)}</SvgText>
        <SvgText x={10} y={CHART_HEIGHT - 35} fontSize={10} fill={COLORS.textMuted}>{minWeight.toFixed(0)}</SvgText>

        {/* 数据线 */}
        <Path d={pathData} stroke={COLORS.accent} strokeWidth={2} fill="none" />

        {/* 数据点 */}
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={4} fill={COLORS.card} stroke={COLORS.accent} strokeWidth={2} />
        ))}

        {/* 最新值标签 */}
        {points.length > 0 && (
          <SvgText 
            x={points[points.length - 1].x} 
            y={points[points.length - 1].y - 12} 
            fontSize={12} 
            fontWeight="500" 
            fill={COLORS.textPrimary}
            textAnchor="middle"
          >
            {points[points.length - 1].weight.toFixed(1)}
          </SvgText>
        )}
      </Svg>
    );
  };

  // 计算变化
  const weightChange = records.length >= 2 
    ? currentWeight && records[records.length - 2].weight 
      ? currentWeight - records[records.length - 2].weight 
      : 0
    : 0;

  return (
    <Screen>
      <View style={styles.container}>
        {/* 头部 */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Weight</Text>
            <Text style={styles.headerSubtitle}>Track your progress</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Feather name="plus" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 当前体重卡片 */}
          <View style={styles.currentCard}>
            <Text style={styles.currentLabel}>Current Weight</Text>
            <View style={styles.currentValueContainer}>
              <Text style={styles.currentValue}>{currentWeight?.toFixed(1) || '--'}</Text>
              <Text style={styles.currentUnit}>kg</Text>
            </View>
            {weightChange !== 0 && (
              <View style={styles.changeContainer}>
                <Feather 
                  name={weightChange < 0 ? 'trending-down' : 'trending-up'} 
                  size={14} 
                  color={weightChange < 0 ? COLORS.success : COLORS.warning} 
                />
                <Text style={[styles.changeText, { color: weightChange < 0 ? COLORS.success : COLORS.warning }]}>
                  {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                </Text>
                <Text style={styles.changePeriod}>since last record</Text>
              </View>
            )}
          </View>

          {/* 体重曲线图 */}
          <View style={styles.chartCard}>
            <Text style={styles.sectionTitle}>Trend</Text>
            {renderChart()}
          </View>

          {/* BMI卡片 */}
          {bmi && (
            <View style={styles.bmiCard}>
              <View style={styles.bmiHeader}>
                <Text style={styles.sectionTitle}>BMI</Text>
                <Text style={styles.bmiValue}>{bmi.toFixed(1)}</Text>
              </View>
              <View style={styles.bmiInfo}>
                <View style={[styles.bmiBadge, { backgroundColor: bmiCategory?.color || COLORS.textMuted + '20' }]}>
                  <Text style={[styles.bmiCategory, { color: bmiCategory?.color || COLORS.textMuted }]}>
                    {bmiCategory?.label || 'N/A'}
                  </Text>
                </View>
                <Text style={styles.bmiSuggestion}>{bmiSuggestion}</Text>
              </View>
              {profile?.goalWeight && (
                <View style={styles.goalContainer}>
                  <Text style={styles.goalLabel}>Goal</Text>
                  <Text style={styles.goalValue}>{profile.goalWeight} kg</Text>
                  <Text style={styles.goalDiff}>
                    {((profile.goalWeight - (currentWeight || 0))).toFixed(1)} kg to go
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* 历史记录 */}
          {records.length > 0 && (
            <View style={styles.historySection}>
              <Text style={styles.sectionTitle}>History</Text>
              {records.slice(-7).reverse().map((record, index) => (
                <View key={record.date} style={styles.historyItem}>
                  <View style={styles.historyDot}>
                    <View style={[styles.dot, index === 0 && styles.dotActive]} />
                  </View>
                  <Text style={styles.historyDate}>
                    {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                  <Text style={styles.historyWeight}>{record.weight} kg</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* 添加体重 Modal */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Log Weight</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Feather name="x" size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <Text style={styles.inputLabel}>Weight (kg)</Text>
                <View style={styles.weightInput}>
                  <TextInput
                    style={styles.weightValue}
                    value={weightInput}
                    onChangeText={setWeightInput}
                    placeholder="0.0"
                    placeholderTextColor={COLORS.textSecondary}
                    keyboardType="decimal-pad"
                  />
                  <Text style={styles.weightUnit}>kg</Text>
                </View>

                <Text style={styles.dateText}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </Text>

                <TouchableOpacity style={styles.saveButton} onPress={saveWeight}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Screen>
  );
}

const getBMICategoryColor = (category: string | null) => {
  switch (category) {
    case 'Underweight': return COLORS.warning;
    case 'Normal': return COLORS.success;
    case 'Overweight': return COLORS.warning;
    case 'Obese': return COLORS.error;
    default: return COLORS.textMuted;
  }
};

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
  headerTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  currentLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  currentValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.sm,
  },
  currentValue: {
    fontSize: 64,
    fontWeight: '200',
    color: COLORS.textPrimary,
    letterSpacing: -3,
  },
  currentUnit: {
    fontSize: 20,
    color: COLORS.textMuted,
    marginLeft: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  changePeriod: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginLeft: 4,
  },
  chartCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: SPACING.md,
  },
  emptyChart: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChartText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  bmiCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  bmiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  bmiValue: {
    fontSize: 24,
    fontWeight: '300',
    color: COLORS.textPrimary,
  },
  bmiInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  bmiBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  bmiCategory: {
    fontSize: 12,
    fontWeight: '500',
  },
  bmiSuggestion: {
    fontSize: 14,
    color: COLORS.textSecondary,
    flex: 1,
  },
  goalContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  goalLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  goalValue: {
    fontSize: 20,
    fontWeight: '300',
    color: COLORS.textPrimary,
  },
  goalDiff: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  historySection: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.md,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  historyDot: {
    width: 20,
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: COLORS.accent,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  historyDate: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  historyWeight: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  bottomSpacer: {
    height: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  modalBody: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.md,
  },
  weightInput: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.lg,
  },
  weightValue: {
    fontSize: 64,
    fontWeight: '200',
    color: COLORS.textPrimary,
    letterSpacing: -3,
    minWidth: 160,
    textAlign: 'center',
  },
  weightUnit: {
    fontSize: 20,
    color: COLORS.textMuted,
    marginLeft: 4,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: SPACING.xl,
  },
  saveButton: {
    width: '100%',
    backgroundColor: COLORS.textPrimary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.card,
  },
});
