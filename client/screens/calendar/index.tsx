/**
 * 日历视图页面 - Ins极简风格
 * 展示每日记录
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/utils/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

interface DayRecord {
  date: string;
  calories?: number;
  weight?: number;
  hasFood?: boolean;
  hasExercise?: boolean;
  hasWeight?: boolean;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarScreen() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [records, setRecords] = useState<Record<string, DayRecord>>({});

  const loadMonthRecords = async () => {
    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      const newRecords: Record<string, DayRecord> = {};
      
      for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const recordData = await AsyncStorage.getItem(`record_${dateStr}`);
        const weightData = await AsyncStorage.getItem('weightRecords');
        
        const record: DayRecord = { date: dateStr };
        
        if (recordData) {
          const parsed = JSON.parse(recordData);
          record.calories = parsed.calories;
          record.hasFood = parsed.meals?.length > 0;
        }
        
        if (weightData) {
          const weights = JSON.parse(weightData);
          const weightRecord = weights.find((w: any) => w.date === dateStr);
          if (weightRecord) {
            record.weight = weightRecord.weight;
            record.hasWeight = true;
          }
        }
        
        newRecords[dateStr] = record;
      }
      
      setRecords(newRecords);
    } catch (error) {
      console.error('Error loading records:', error);
    }
  };

  const navigateMonth = (delta: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + delta);
    setCurrentMonth(newMonth);
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const formatDate = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const getRecord = (day: number): DayRecord | null => {
    if (!day) return null;
    return records[formatDate(day)] || null;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const days = getDaysInMonth();

  return (
    <Screen>
      <View style={styles.container}>
        {/* 头部 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Calendar</Text>
          <Text style={styles.headerSubtitle}>Your journey</Text>
        </View>

        {/* 月份导航 */}
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={() => navigateMonth(-1)} style={styles.navButton}>
            <Feather name="chevron-left" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.monthText}>
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
          <TouchableOpacity onPress={() => navigateMonth(1)} style={styles.navButton}>
            <Feather name="chevron-right" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* 星期标题 */}
        <View style={styles.weekdayRow}>
          {WEEKDAYS.map(day => (
            <Text key={day} style={styles.weekdayText}>{day}</Text>
          ))}
        </View>

        {/* 日期网格 */}
        <View style={styles.daysGrid}>
          {days.map((day, index) => {
            const record = getRecord(day || 0);
            const isSelected = selectedDate === formatDate(day || 0);
            const today = isToday(day || 0);
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  isSelected && styles.dayCellSelected,
                  today && !isSelected && styles.dayCellToday,
                ]}
                onPress={() => day && setSelectedDate(formatDate(day))}
                disabled={!day}
              >
                {day && (
                  <>
                    <Text style={[
                      styles.dayNumber,
                      isSelected && styles.dayNumberSelected,
                      today && !isSelected && styles.dayNumberToday,
                    ]}>
                      {day}
                    </Text>
                    {record && (
                      <View style={styles.dots}>
                        {record.hasFood && <View style={styles.dotFood} />}
                        {record.hasWeight && <View style={styles.dotWeight} />}
                        {record.hasExercise && <View style={styles.dotExercise} />}
                      </View>
                    )}
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 图例 */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.accent }]} />
            <Text style={styles.legendText}>Food</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.textMuted }]} />
            <Text style={styles.legendText}>Weight</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.success }]} />
            <Text style={styles.legendText}>Exercise</Text>
          </View>
        </View>

        {/* 选中日期详情 */}
        {selectedDate && (
          <View style={styles.detailCard}>
            <Text style={styles.detailDate}>
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            
            {getRecord(parseInt(selectedDate.split('-')[2])) ? (
              <View style={styles.detailContent}>
                {records[selectedDate]?.calories ? (
                  <View style={styles.detailRow}>
                    <Feather name="zap" size={16} color={COLORS.accent} />
                    <Text style={styles.detailLabel}>Calories</Text>
                    <Text style={styles.detailValue}>{records[selectedDate].calories} kcal</Text>
                  </View>
                ) : null}
                
                {records[selectedDate]?.weight ? (
                  <View style={styles.detailRow}>
                    <Feather name="activity" size={16} color={COLORS.textMuted} />
                    <Text style={styles.detailLabel}>Weight</Text>
                    <Text style={styles.detailValue}>{records[selectedDate].weight} kg</Text>
                  </View>
                ) : null}
                
                {!records[selectedDate]?.calories && !records[selectedDate]?.weight && (
                  <Text style={styles.noRecord}>No records for this day</Text>
                )}
              </View>
            ) : (
              <Text style={styles.noRecord}>No records for this day</Text>
            )}
          </View>
        )}

        {/* 统计摘要 */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>This Month</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {Object.values(records).filter(r => r.hasFood).length}
              </Text>
              <Text style={styles.summaryLabel}>Days Tracked</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {Object.values(records).filter(r => r.hasWeight).length}
              </Text>
              <Text style={styles.summaryLabel}>Weight Logs</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {Object.values(records).reduce((sum, r) => sum + (r.calories || 0), 0).toLocaleString()}
              </Text>
              <Text style={styles.summaryLabel}>Total kcal</Text>
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
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
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '400',
    color: COLORS.textPrimary,
  },
  weekdayRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  dayCellSelected: {
    backgroundColor: COLORS.textPrimary,
    borderRadius: BORDER_RADIUS.md,
  },
  dayCellToday: {
    backgroundColor: COLORS.accent,
    borderRadius: BORDER_RADIUS.md,
  },
  dayNumber: {
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  dayNumberSelected: {
    color: COLORS.card,
  },
  dayNumberToday: {
    color: COLORS.accent,
    fontWeight: '500',
  },
  dots: {
    flexDirection: 'row',
    marginTop: 2,
    gap: 2,
  },
  dotFood: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.accent,
  },
  dotWeight: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textMuted,
  },
  dotExercise: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.success,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.lg,
    paddingVertical: SPACING.md,
    marginHorizontal: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: SPACING.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  detailCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    ...SHADOWS.card,
  },
  detailDate: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  detailContent: {
    gap: SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  detailLabel: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  noRecord: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  summaryCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    ...SHADOWS.card,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '300',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
