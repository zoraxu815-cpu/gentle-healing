/**
 * 饮食记录页面 - Ins极简风格
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

import { COLORS, SPACING } from '@/utils/theme';
import {
  FOOD_DATABASE_FULL as FOOD_DATABASE,
  FOOD_CATEGORIES,
  getFoodsByCategory,
  searchFoodsFull as searchFoods,
  FoodItem,
} from '@/utils/foodDatabase';
import { calculateDailyNutrients, NutrientSuggestion } from '@/utils/nutrientCalculator';
import { getUserProfile } from '@/utils/calorieCalculator';

const SCREEN_PADDING = 20;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface DailyRecord {
  date: string;
  meals: Record<MealType, FoodRecord[]>;
  totalCalories: number;
  totalCarbs: number;
  totalFat: number;
  totalProtein: number;
}

interface FoodRecord {
  id: string;
  foodId: string;
  name: string;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
  unit: string;
  serving: number;
  mealType: MealType;
  imageUri?: string;
}

interface RecognizedFood {
  name: string;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
  confidence: number;
}

const MEAL_CONFIG: Record<MealType, { label: string; icon: string }> = {
  breakfast: { label: 'Breakfast', icon: 'sunrise' },
  lunch: { label: 'Lunch', icon: 'sun' },
  dinner: { label: 'Dinner', icon: 'moon' },
  snack: { label: 'Snack', icon: 'coffee' },
};

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export default function FoodScreen() {
  const [dailyRecord, setDailyRecord] = useState<DailyRecord | null>(null);
  const [nutrientSuggestion, setNutrientSuggestion] = useState<NutrientSuggestion | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<MealType>('breakfast');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [servingCount, setServingCount] = useState(1);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [recognizedFoods, setRecognizedFoods] = useState<RecognizedFood[]>([]);
  const [isRecognizing, setIsRecognizing] = useState(false);

  const today = getTodayString();

  const loadData = useCallback(async () => {
    try {
      const profileData = await getUserProfile();
      if (profileData?.tdee) {
        setNutrientSuggestion(calculateDailyNutrients(profileData.tdee, 'loss'));
      }

      const recordData = await AsyncStorage.getItem(`food_${today}`);
      if (recordData) {
        setDailyRecord(JSON.parse(recordData));
      } else {
        const emptyRecord: DailyRecord = {
          date: today,
          meals: { breakfast: [], lunch: [], dinner: [], snack: [] },
          totalCalories: 0, totalCarbs: 0, totalFat: 0, totalProtein: 0,
        };
        setDailyRecord(emptyRecord);
        await AsyncStorage.setItem(`food_${today}`, JSON.stringify(emptyRecord));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, [today]);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const filteredFoods = useMemo(() => {
    let foods = selectedCategory === 'all' ? FOOD_DATABASE : getFoodsByCategory(selectedCategory);
    if (searchQuery.trim()) foods = searchFoods(searchQuery);
    return foods.slice(0, 50);
  }, [selectedCategory, searchQuery]);

  const calculateTotals = (records: FoodRecord[]) => 
    records.reduce((acc, r) => ({
      calories: acc.calories + r.calories,
      carbs: acc.carbs + r.carbs,
      fat: acc.fat + r.protein,
      protein: acc.protein + r.protein,
    }), { calories: 0, carbs: 0, fat: 0, protein: 0 });

  const allTotals = dailyRecord 
    ? { 
        calories: dailyRecord.totalCalories, 
        carbs: dailyRecord.totalCarbs, 
        fat: dailyRecord.totalFat, 
        protein: dailyRecord.totalProtein 
      }
    : { calories: 0, carbs: 0, fat: 0, protein: 0 };

  const handleAddFood = async (food: FoodItem | RecognizedFood, mealType: MealType, servings: number = 1) => {
    if (!dailyRecord) return;

    const newRecord: FoodRecord = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      foodId: 'custom',
      name: food.name,
      calories: Math.round(food.calories * servings),
      carbs: Math.round(food.carbs * servings * 10) / 10,
      fat: Math.round(food.fat * servings * 10) / 10,
      protein: Math.round(food.protein * servings * 10) / 10,
      unit: '份',
      serving: servings,
      mealType,
    };

    const updatedRecord: DailyRecord = {
      ...dailyRecord,
      meals: { ...dailyRecord.meals, [mealType]: [...dailyRecord.meals[mealType], newRecord] },
      totalCalories: dailyRecord.totalCalories + newRecord.calories,
      totalCarbs: dailyRecord.totalCarbs + newRecord.carbs,
      totalFat: dailyRecord.totalFat + newRecord.fat,
      totalProtein: dailyRecord.totalProtein + newRecord.protein,
    };

    setDailyRecord(updatedRecord);
    await AsyncStorage.setItem(`food_${today}`, JSON.stringify(updatedRecord));
    setShowCameraModal(false);
    setRecognizedFoods([]);
  };

  const handleDeleteFood = async (recordId: string, mealType: MealType) => {
    const records = dailyRecord!.meals[mealType];
    const recordToDelete = records.find(r => r.id === recordId);
    if (!recordToDelete) return;

    const updatedRecord: DailyRecord = {
      ...dailyRecord!,
      meals: { ...dailyRecord!.meals, [mealType]: records.filter(r => r.id !== recordId) },
      totalCalories: dailyRecord!.totalCalories - recordToDelete.calories,
      totalCarbs: dailyRecord!.totalCarbs - recordToDelete.carbs,
      totalFat: dailyRecord!.totalFat - recordToDelete.fat,
      totalProtein: dailyRecord!.totalProtein - recordToDelete.protein,
    };

    setDailyRecord(updatedRecord);
    await AsyncStorage.setItem(`food_${today}`, JSON.stringify(updatedRecord));
  };

  const simulateRecognition = () => {
    setIsRecognizing(true);
    // 模拟AI识别过程
    setTimeout(() => {
      const mockRecognized: RecognizedFood[] = [
        {
          name: '蔬菜沙拉配鸡胸肉',
          calories: 280,
          carbs: 12,
          fat: 8,
          protein: 35,
          confidence: 0.92,
        },
        {
          name: '全麦面包2片',
          calories: 180,
          carbs: 32,
          fat: 3,
          protein: 8,
          confidence: 0.88,
        },
        {
          name: '美式咖啡1杯',
          calories: 5,
          carbs: 0,
          fat: 0,
          protein: 0,
          confidence: 0.95,
        },
      ];
      setRecognizedFoods(mockRecognized);
      setIsRecognizing(false);
    }, 2000);
  };

  const getProgressPercent = (current: number, target: number) => {
    if (!target) return 0;
    return Math.min(100, (current / target) * 100);
  };

  const getProgressColor = (current: number, target: number) => {
    const ratio = current / target;
    if (ratio > 1.1) return '#FF6B6B';
    if (ratio > 0.9) return COLORS.success;
    return COLORS.textMuted;
  };

  const currentMealRecords = dailyRecord?.meals[selectedMeal] || [];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Nutrition</Text>
          <Text style={styles.date}>{today}</Text>
        </View>

        {/* Main Calorie Display */}
        <View style={styles.calorieHero}>
          <View style={styles.calorieCircle}>
            <Text style={styles.calorieValue}>{allTotals.calories}</Text>
            <Text style={styles.calorieLabel}>kcal</Text>
            <View style={styles.calorieRing}>
              <View 
                style={[
                  styles.calorieRingProgress, 
                  { 
                    width: `${getProgressPercent(allTotals.calories, nutrientSuggestion?.daily.calories || 1800)}%`,
                    backgroundColor: getProgressColor(allTotals.calories, nutrientSuggestion?.daily.calories || 1800)
                  }
                ]} 
              />
            </View>
          </View>
          <View style={styles.calorieTarget}>
            <Feather name="target" size={14} color={COLORS.textMuted} />
            <Text style={styles.calorieTargetText}>
              / {nutrientSuggestion?.daily.calories || 1800} kcal
            </Text>
          </View>
        </View>

        {/* Macros Grid */}
        <View style={styles.macrosGrid}>
          <View style={styles.macroCard}>
              <Text style={[styles.macroValue, { color: '#E07A5F' }]}>

              {Math.round(allTotals.carbs)}<Text style={styles.macroUnit}>g</Text>
            </Text>
            <Text style={styles.macroLabel}>Carbs</Text>
            <View style={styles.macroBar}>
              <View style={[styles.macroBarFill, { 
                width: `${getProgressPercent(allTotals.carbs, nutrientSuggestion?.daily.carbs || 200)}%`,
                backgroundColor: '#E07A5F'
              }]} />
            </View>
          </View>
          
          <View style={styles.macroCard}>
              <Text style={[styles.macroValue, { color: '#81B29A' }]}>

              {Math.round(allTotals.protein)}<Text style={styles.macroUnit}>g</Text>
            </Text>
            <Text style={styles.macroLabel}>Protein</Text>
            <View style={styles.macroBar}>
              <View style={[styles.macroBarFill, { 
                width: `${getProgressPercent(allTotals.protein, nutrientSuggestion?.daily.protein || 120)}%`,
                backgroundColor: '#81B29A'
              }]} />
            </View>
          </View>
          
          <View style={styles.macroCard}>
              <Text style={[styles.macroValue, { color: '#9B8AA0' }]}>

              {Math.round(allTotals.fat)}<Text style={styles.macroUnit}>g</Text>
            </Text>
            <Text style={styles.macroLabel}>Fat</Text>
            <View style={styles.macroBar}>
              <View style={[styles.macroBarFill, { 
                width: `${getProgressPercent(allTotals.fat, nutrientSuggestion?.daily.fat || 60)}%`,
                backgroundColor: '#9B8AA0'
              }]} />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.primaryBtn} 
            onPress={() => setShowAddModal(true)}
          >
            <LinearGradient 
              colors={['#1A1A1A', '#2D2D2D']} 
              style={styles.primaryBtnGradient}
            >
              <Feather name="plus" size={18} color="white" />
              <Text style={styles.primaryBtnText}>Add</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryBtn} 
            onPress={() => {
              setShowCameraModal(true);
              simulateRecognition();
            }}
          >
            <Feather name="camera" size={18} color={COLORS.textPrimary} />
            <Text style={styles.secondaryBtnText}>Scan</Text>
          </TouchableOpacity>
        </View>

        {/* Meal Tabs */}
        <View style={styles.mealSection}>
          <Text style={styles.sectionTitle}>Meals</Text>
          <View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.mealTabs}
            >
            {(Object.keys(MEAL_CONFIG) as MealType[]).map((meal) => {
              const totals = dailyRecord?.meals[meal]?.reduce((acc, r) => ({
                calories: acc.calories + r.calories,
              }), { calories: 0 }) || { calories: 0 };
              const isSelected = selectedMeal === meal;
              return (
                <TouchableOpacity 
                  key={meal} 
                  style={[styles.mealTab, isSelected && styles.mealTabActive]} 
                  onPress={() => setSelectedMeal(meal)}
                >
                  <Feather 
                    name={MEAL_CONFIG[meal].icon as any} 
                    size={16} 
                    color={isSelected ? 'white' : COLORS.textMuted} 
                  />
                  <Text style={[styles.mealTabLabel, isSelected && styles.mealTabLabelActive]}>
                    {MEAL_CONFIG[meal].label}
                  </Text>
                  <Text style={[styles.mealTabCal, isSelected && styles.mealTabCalActive]}>
                    {totals.calories} kcal
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          </View>
        </View>

        {/* Food Records */}
        <View style={styles.recordsSection}>
          {currentMealRecords.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Feather name="feather" size={24} color={COLORS.textMuted} />
              </View>
              <Text style={styles.emptyText}>No food logged</Text>
              <TouchableOpacity onPress={() => setShowAddModal(true)}>
                <Text style={styles.emptyAction}>Start tracking</Text>
              </TouchableOpacity>
            </View>
          ) : (
            currentMealRecords.map((record) => (
              <View key={record.id} style={styles.recordItem}>
                <View style={styles.recordLeft}>
                  <Text style={styles.recordName}>{record.name}</Text>
                  <View style={styles.recordMacros}>
                    <Text style={styles.recordMacro}>C {record.carbs}g</Text>
                    <Text style={styles.recordMacroDot}>·</Text>
                    <Text style={styles.recordMacro}>P {record.protein}g</Text>
                    <Text style={styles.recordMacroDot}>·</Text>
                    <Text style={styles.recordMacro}>F {record.fat}g</Text>
                  </View>
                </View>
                <View style={styles.recordRight}>
                  <Text style={styles.recordCalories}>{record.calories}</Text>
                  <TouchableOpacity 
                    style={styles.deleteBtn}
                    onPress={() => handleDeleteFood(record.id, selectedMeal)}
                  >
                    <Feather name="x" size={14} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Add Food Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={modalStyles.overlay}>
          <View style={modalStyles.container}>
            <View style={modalStyles.header}>
              <Text style={modalStyles.title}>Add Food</Text>
              <TouchableOpacity onPress={() => { 
                setShowAddModal(false); 
                setSelectedFood(null); 
                setSearchQuery(''); 
              }}>
                <Feather name="x" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={modalStyles.searchBox}>
              <Feather name="search" size={18} color={COLORS.textMuted} />
              <TextInput 
                style={modalStyles.searchInput} 
                placeholder="Search foods..." 
                placeholderTextColor={COLORS.textMuted} 
                value={searchQuery} 
                onChangeText={setSearchQuery} 
              />
            </View>

            <View style={modalStyles.categoriesRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity 
                  style={[modalStyles.categoryChip, selectedCategory === 'all' && modalStyles.categoryChipActive]} 
                  onPress={() => setSelectedCategory('all')}
                >
                  <Text style={[modalStyles.categoryText, selectedCategory === 'all' && modalStyles.categoryTextActive]}>
                    All
                  </Text>
                </TouchableOpacity>
                {FOOD_CATEGORIES.slice(0, 6).map((cat) => (
                  <TouchableOpacity 
                    key={cat.id} 
                    style={[modalStyles.categoryChip, selectedCategory === cat.id && modalStyles.categoryChipActive]} 
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <Text style={[modalStyles.categoryText, selectedCategory === cat.id && modalStyles.categoryTextActive]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <FlatList
              data={filteredFoods}
              keyExtractor={(item) => item.id}
              style={modalStyles.foodList}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[modalStyles.foodItem, selectedFood?.id === item.id && modalStyles.foodItemSelected]} 
                  onPress={() => setSelectedFood(item)}
                >
                  <View style={modalStyles.foodInfo}>
                    <Text style={modalStyles.foodName}>{item.name}</Text>
                    <Text style={modalStyles.foodMeta}>
                      {Math.round(item.caloriesPerUnit)} kcal · C{item.carbsPerUnit}g · P{item.proteinPerUnit}g · F{item.fatPerUnit}g
                    </Text>
                  </View>
                  {selectedFood?.id === item.id && (
                    <Feather name="check-circle" size={20} color={COLORS.textPrimary} />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={modalStyles.emptyList}>
                  <Feather name="search" size={32} color={COLORS.textMuted} />
                  <Text style={modalStyles.emptyText}>No foods found</Text>
                </View>
              }
            />

            {selectedFood && (
              <View style={modalStyles.selectedPanel}>
                <View style={modalStyles.selectedInfo}>
                  <Text style={modalStyles.selectedName}>{selectedFood.name}</Text>
                  <Text style={modalStyles.selectedNutrition}>
                    {Math.round(selectedFood.caloriesPerUnit * servingCount)} kcal
                  </Text>
                </View>
                
                <View style={modalStyles.servingControl}>
                  <TouchableOpacity 
                    style={modalStyles.servingBtn}
                    onPress={() => setServingCount(Math.max(0.5, servingCount - 0.5))}
                  >
                    <Feather name="minus" size={16} color={COLORS.textPrimary} />
                  </TouchableOpacity>
                  <Text style={modalStyles.servingValue}>{servingCount}</Text>
                  <TouchableOpacity 
                    style={modalStyles.servingBtn}
                    onPress={() => setServingCount(servingCount + 0.5)}
                  >
                    <Feather name="plus" size={16} color={COLORS.textPrimary} />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={modalStyles.addBtn}
                  onPress={() => {
                    handleAddFood(selectedFood, selectedMeal, servingCount);
                    setShowAddModal(false);
                    setSelectedFood(null);
                    setServingCount(1);
                  }}
                >
                  <LinearGradient colors={['#1A1A1A', '#2D2D2D']} style={modalStyles.addBtnGradient}>
                    <Text style={modalStyles.addBtnText}>Add to {MEAL_CONFIG[selectedMeal].label}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Camera Recognition Modal */}
      <Modal visible={showCameraModal} animationType="slide" transparent>
        <View style={cameraStyles.overlay}>
          <View style={cameraStyles.container}>
            <View style={cameraStyles.header}>
              <Text style={cameraStyles.title}>Scan Food</Text>
              <TouchableOpacity onPress={() => { 
                setShowCameraModal(false); 
                setRecognizedFoods([]); 
              }}>
                <Feather name="x" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {isRecognizing ? (
              <View style={cameraStyles.loadingState}>
                <View style={cameraStyles.loadingIcon}>
                  <Feather name="camera" size={40} color={COLORS.textMuted} />
                </View>
                <Text style={cameraStyles.loadingText}>Analyzing food...</Text>
                <Text style={cameraStyles.loadingSubtext}>
                  Please wait while our AI identifies the food items
                </Text>
              </View>
            ) : recognizedFoods.length > 0 ? (
              <View style={cameraStyles.resultsState}>
                <Text style={cameraStyles.resultsTitle}>Recognized Items</Text>
                <Text style={cameraStyles.resultsSubtitle}>
                  Please verify the results below
                </Text>
                
                {recognizedFoods.map((food, index) => (
                  <View key={index} style={cameraStyles.foodCard}>
                    <View style={cameraStyles.foodCardHeader}>
                      <Text style={cameraStyles.foodName}>{food.name}</Text>
                      <View style={cameraStyles.confidenceBadge}>
                        <Text style={cameraStyles.confidenceText}>
                          {Math.round(food.confidence * 100)}%
                        </Text>
                      </View>
                    </View>
                    
                    <View style={cameraStyles.nutritionRow}>
                      <View style={cameraStyles.nutritionItem}>
                        <Text style={cameraStyles.nutritionValue}>{food.calories}</Text>
                        <Text style={cameraStyles.nutritionLabel}>kcal</Text>
                      </View>
                      <View style={cameraStyles.nutritionItem}>
                        <Text style={[cameraStyles.nutritionValue, { color: '#E07A5F' }]}>{food.carbs}g</Text>
                        <Text style={cameraStyles.nutritionLabel}>Carbs</Text>
                      </View>
                      <View style={cameraStyles.nutritionItem}>
                        <Text style={[cameraStyles.nutritionValue, { color: '#81B29A' }]}>{food.protein}g</Text>
                        <Text style={cameraStyles.nutritionLabel}>Protein</Text>
                      </View>
                      <View style={cameraStyles.nutritionItem}>
                        <Text style={[cameraStyles.nutritionValue, { color: '#9B8AA0' }]}>{food.fat}g</Text>
                        <Text style={cameraStyles.nutritionLabel}>Fat</Text>
                      </View>
                    </View>

                    <View style={cameraStyles.mealSelector}>
                      <Text style={cameraStyles.mealSelectorLabel}>Add to:</Text>
                      <View style={cameraStyles.mealButtons}>
                        {(Object.keys(MEAL_CONFIG) as MealType[]).map((meal) => (
                          <TouchableOpacity
                            key={meal}
                            style={cameraStyles.mealBtn}
                            onPress={() => handleAddFood(food, meal)}
                          >
                            <Text style={cameraStyles.mealBtnText}>{MEAL_CONFIG[meal].label}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                ))}

                <TouchableOpacity 
                  style={cameraStyles.rescanBtn}
                  onPress={simulateRecognition}
                >
                  <Feather name="refresh-cw" size={16} color={COLORS.textPrimary} />
                  <Text style={cameraStyles.rescanText}>Scan Again</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={cameraStyles.emptyState}>
                <TouchableOpacity 
                  style={cameraStyles.scanBtn}
                  onPress={simulateRecognition}
                >
                  <Feather name="camera" size={48} color="white" />
                  <Text style={cameraStyles.scanBtnText}>Tap to Scan</Text>
                </TouchableOpacity>
                <Text style={cameraStyles.emptyText}>
                  Position your food in the frame
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background,
  },
  scrollView: { 
    flex: 1,
  },
  header: { 
    padding: SCREEN_PADDING, 
    paddingTop: 60,
  },
  title: { 
    fontSize: 34, 
    fontWeight: '200', 
    color: COLORS.textPrimary, 
    letterSpacing: 1,
  },
  date: { 
    fontSize: 13, 
    color: COLORS.textMuted, 
    marginTop: 4,
    letterSpacing: 0.5,
  },
  
  // Calorie Hero
  calorieHero: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  calorieCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  calorieValue: {
    fontSize: 42,
    fontWeight: '200',
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  calorieLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginTop: 2,
  },
  calorieRing: {
    position: 'absolute',
    bottom: -4,
    left: 20,
    right: 20,
    height: 4,
    backgroundColor: COLORS.surface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  calorieRingProgress: {
    height: '100%',
    borderRadius: 2,
  },
  calorieTarget: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 4,
  },
  calorieTargetText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  
  // Macros Grid
  macrosGrid: {
    flexDirection: 'row',
    paddingHorizontal: SCREEN_PADDING,
    gap: 12,
    marginBottom: 24,
  },
  macroCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 22,
    fontWeight: '300',
    color: COLORS.textPrimary,
  },
  macroUnit: {
    fontSize: 12,
    fontWeight: '400',
  },
  macroLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  macroBar: {
    width: '100%',
    height: 3,
    backgroundColor: COLORS.surface,
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  macroBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  
  // Action Buttons
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: SCREEN_PADDING,
    gap: 12,
    marginBottom: 24,
  },
  primaryBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  primaryBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  primaryBtnText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    gap: 8,
  },
  secondaryBtnText: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  
  // Meal Section
  mealSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textMuted,
    letterSpacing: 1,
    paddingHorizontal: SCREEN_PADDING,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  mealTabs: {
    paddingHorizontal: SCREEN_PADDING,
    gap: 8,
  },
  mealTab: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    minWidth: 80,
  },
  mealTabActive: {
    backgroundColor: COLORS.textPrimary,
  },
  mealTabLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  mealTabLabelActive: {
    color: 'white',
  },
  mealTabCal: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  mealTabCalActive: {
    color: 'rgba(255,255,255,0.7)',
  },
  
  // Records
  recordsSection: {
    paddingHorizontal: SCREEN_PADDING,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textMuted,
    marginTop: 12,
  },
  emptyAction: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginTop: 4,
    textDecorationLine: 'underline',
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  recordLeft: {
    flex: 1,
  },
  recordName: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  recordMacros: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  recordMacro: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  recordMacroDot: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  recordRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recordCalories: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const modalStyles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'flex-end' 
  },
  container: { 
    backgroundColor: COLORS.background, 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    maxHeight: '90%',
    paddingBottom: 34,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: SCREEN_PADDING, 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.surface,
  },
  title: { 
    fontSize: 17, 
    fontWeight: '600', 
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  searchBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    margin: SCREEN_PADDING, 
    padding: 14, 
    backgroundColor: COLORS.card, 
    borderRadius: 12, 
    gap: 10,
  },
  searchInput: { 
    flex: 1, 
    fontSize: 15, 
    color: COLORS.textPrimary,
  },
  categoriesRow: {
    paddingLeft: SCREEN_PADDING,
    marginBottom: 12,
  },
  categoryChip: { 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    marginRight: 8, 
    backgroundColor: COLORS.card, 
    borderRadius: 20,
  },
  categoryChipActive: { 
    backgroundColor: COLORS.textPrimary,
  },
  categoryText: { 
    fontSize: 13, 
    color: COLORS.textMuted,
  },
  categoryTextActive: { 
    color: 'white',
  },
  foodList: { 
    maxHeight: 320, 
    paddingHorizontal: SCREEN_PADDING,
  },
  foodItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 14, 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.surface,
  },
  foodItemSelected: { 
    backgroundColor: COLORS.card,
    marginHorizontal: -SCREEN_PADDING,
    paddingHorizontal: SCREEN_PADDING,
    borderRadius: 8,
  },
  foodInfo: { 
    flex: 1,
  },
  foodName: { 
    fontSize: 15, 
    color: COLORS.textPrimary, 
    fontWeight: '500',
  },
  foodMeta: { 
    fontSize: 12, 
    color: COLORS.textMuted, 
    marginTop: 4,
  },
  emptyList: { 
    alignItems: 'center', 
    paddingVertical: 48,
  },
  emptyText: { 
    fontSize: 15, 
    color: COLORS.textMuted,
    marginTop: 8,
  },
  selectedPanel: { 
    padding: SCREEN_PADDING, 
    borderTopWidth: 1, 
    borderTopColor: COLORS.surface, 
    backgroundColor: COLORS.card,
  },
  selectedInfo: { 
    marginBottom: 16,
  },
  selectedName: { 
    fontSize: 15, 
    color: COLORS.textPrimary, 
    fontWeight: '500',
  },
  selectedNutrition: { 
    fontSize: 13, 
    color: COLORS.textMuted, 
    marginTop: 4,
  },
  servingControl: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 24, 
    marginBottom: 16,
  },
  servingBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: COLORS.background, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  servingValue: { 
    fontSize: 22, 
    fontWeight: '300', 
    color: COLORS.textPrimary, 
    minWidth: 40, 
    textAlign: 'center',
  },
  addBtn: { 
    borderRadius: 12, 
    overflow: 'hidden',
  },
  addBtnGradient: { 
    paddingVertical: 14, 
    alignItems: 'center',
  },
  addBtnText: { 
    color: 'white', 
    fontSize: 15, 
    fontWeight: '600',
  },
});

const cameraStyles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'flex-end' 
  },
  container: { 
    backgroundColor: COLORS.background, 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    paddingBottom: 34,
    minHeight: 500,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: SCREEN_PADDING, 
    borderBottomWidth: 1, 
    borderBottomColor: COLORS.surface,
  },
  title: { 
    fontSize: 17, 
    fontWeight: '600', 
    color: COLORS.textPrimary,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SCREEN_PADDING,
  },
  loadingIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  loadingText: {
    fontSize: 17,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  loadingSubtext: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SCREEN_PADDING,
  },
  scanBtn: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  scanBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  resultsState: {
    padding: SCREEN_PADDING,
  },
  resultsTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  resultsSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
    marginBottom: 20,
  },
  foodCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  foodCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  confidenceBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '600',
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: '400',
    color: COLORS.textPrimary,
  },
  nutritionLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  mealSelector: {
    borderTopWidth: 1,
    borderTopColor: COLORS.surface,
    paddingTop: 12,
  },
  mealSelectorLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  mealButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  mealBtn: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  mealBtnText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  rescanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    marginTop: 8,
  },
  rescanText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
});
