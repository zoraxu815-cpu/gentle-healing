/**
 * 内置食物营养数据库
 * 包含：卡路里、碳水化合物、脂肪、蛋白质（每100g数据）
 * 参考：USDA FoodData Central、中国食物成分表
 */

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  calories: number; // 每100g的卡路里
  carbs: number; // 碳水化合物 (g)
  fat: number; // 脂肪 (g)
  protein: number; // 蛋白质 (g)
  unit: string; // 计量单位
  servingSize: number; // 每单位对应的克数
  caloriesPerUnit: number; // 每个计量单位的卡路里
  carbsPerUnit: number; // 每计量单位碳水 (g)
  fatPerUnit: number; // 每计量单位脂肪 (g)
  proteinPerUnit: number; // 每计量单位蛋白质 (g)
  image?: string;
}

// 食物分类
export const FOOD_CATEGORIES = [
  { id: 'main', name: '主食', icon: 'wheat', color: '#E8E8E8' },
  { id: 'vegetable', name: '蔬菜', icon: 'feather', color: '#D4E5D4' },
  { id: 'fruit', name: '水果', icon: 'feather', color: '#E8D4D8' },
  { id: 'meat', name: '肉类', icon: 'feather', color: '#D8D4E8' },
  { id: 'egg', name: '蛋类', icon: 'feather', color: '#E8E0D4' },
  { id: 'dairy', name: '乳制品', icon: 'droplet', color: '#D8E8E0' },
  { id: 'snack', name: '零食', icon: 'circle', color: '#E0D8E8' },
  { id: 'drink', name: '饮品', icon: 'coffee', color: '#D8E0D8' },
];

// 食物数据库 (数据来源：USDA / 中国食物成分表)
export const FOOD_DATABASE: FoodItem[] = [
  // ========== 主食类 ==========
  // 米饭：100g = 116kcal, 碳水25.9g, 脂肪0.3g, 蛋白2.6g
  { id: 'rice', name: '米饭', category: 'main', calories: 116, carbs: 25.9, fat: 0.3, protein: 2.6, unit: '碗', servingSize: 200, caloriesPerUnit: 232, carbsPerUnit: 51.8, fatPerUnit: 0.6, proteinPerUnit: 5.2, image: 'rice' },
  // 面条：100g = 110kcal, 碳水24.3g, 脂肪1.2g, 蛋白3.5g
  { id: 'noodle', name: '面条', category: 'main', calories: 110, carbs: 24.3, fat: 1.2, protein: 3.5, unit: '碗', servingSize: 250, caloriesPerUnit: 275, carbsPerUnit: 60.8, fatPerUnit: 3.0, proteinPerUnit: 8.8, image: 'noodle' },
  // 全麦面包：100g = 80kcal, 碳水15.0g, 脂肪1.0g, 蛋白4.0g
  { id: 'bread', name: '全麦面包', category: 'main', calories: 80, carbs: 15.0, fat: 1.0, protein: 4.0, unit: '片', servingSize: 50, caloriesPerUnit: 40, carbsPerUnit: 7.5, fatPerUnit: 0.5, proteinPerUnit: 2.0, image: 'bread' },
  // 馒头：100g = 110kcal, 碳水23.0g, 脂肪1.1g, 蛋白3.2g
  { id: 'steamed_bun', name: '馒头', category: 'main', calories: 110, carbs: 23.0, fat: 1.1, protein: 3.2, unit: '个', servingSize: 100, caloriesPerUnit: 110, carbsPerUnit: 23.0, fatPerUnit: 1.1, proteinPerUnit: 3.2, image: 'feather' },
  // 燕麦粥：100g = 68kcal, 碳水12.0g, 脂肪1.4g, 蛋白2.5g
  { id: 'oatmeal', name: '燕麦粥', category: 'main', calories: 68, carbs: 12.0, fat: 1.4, protein: 2.5, unit: '碗', servingSize: 250, caloriesPerUnit: 170, carbsPerUnit: 30.0, fatPerUnit: 3.5, proteinPerUnit: 6.3, image: 'coffee' },
  // 玉米：100g = 96kcal, 碳水19.0g, 脂肪1.2g, 蛋白3.3g
  { id: 'corn', name: '玉米', category: 'main', calories: 96, carbs: 19.0, fat: 1.2, protein: 3.3, unit: '根', servingSize: 150, caloriesPerUnit: 144, carbsPerUnit: 28.5, fatPerUnit: 1.8, proteinPerUnit: 5.0, image: 'feather' },
  // 红薯：100g = 99kcal, 碳水20.1g, 脂肪0.1g, 蛋白1.1g
  { id: 'sweet_potato', name: '红薯', category: 'main', calories: 99, carbs: 20.1, fat: 0.1, protein: 1.1, unit: '个', servingSize: 180, caloriesPerUnit: 178, carbsPerUnit: 36.2, fatPerUnit: 0.2, proteinPerUnit: 2.0, image: 'feather' },
  // 土豆：100g = 76kcal, 碳水17.0g, 脂肪0.1g, 蛋白2.0g
  { id: 'potato', name: '土豆', category: 'main', calories: 76, carbs: 17.0, fat: 0.1, protein: 2.0, unit: '个', servingSize: 150, caloriesPerUnit: 114, carbsPerUnit: 25.5, fatPerUnit: 0.2, proteinPerUnit: 3.0, image: 'feather' },
  // 饺子：100g = 200kcal, 碳水25.0g, 脂肪8.0g, 蛋白8.0g
  { id: 'dumpling', name: '饺子', category: 'main', calories: 200, carbs: 25.0, fat: 8.0, protein: 8.0, unit: '个', servingSize: 25, caloriesPerUnit: 50, carbsPerUnit: 6.3, fatPerUnit: 2.0, proteinPerUnit: 2.0, image: 'feather' },
  // 包子：100g = 227kcal, 碳水30.0g, 脂肪8.0g, 蛋白7.0g
  { id: 'buns', name: '包子', category: 'main', calories: 227, carbs: 30.0, fat: 8.0, protein: 7.0, unit: '个', servingSize: 80, caloriesPerUnit: 182, carbsPerUnit: 24.0, fatPerUnit: 6.4, proteinPerUnit: 5.6, image: 'feather' },

  // ========== 蔬菜类 ==========
  // 西兰花：100g = 34kcal, 碳水6.6g, 脂肪0.4g, 蛋白2.8g
  { id: 'broccoli', name: '西兰花', category: 'vegetable', calories: 34, carbs: 6.6, fat: 0.4, protein: 2.8, unit: '份', servingSize: 100, caloriesPerUnit: 34, carbsPerUnit: 6.6, fatPerUnit: 0.4, proteinPerUnit: 2.8, image: 'feather' },
  // 菠菜：100g = 23kcal, 碳水3.6g, 脂肪0.4g, 蛋白2.9g
  { id: 'spinach', name: '菠菜', category: 'vegetable', calories: 23, carbs: 3.6, fat: 0.4, protein: 2.9, unit: '份', servingSize: 100, caloriesPerUnit: 23, carbsPerUnit: 3.6, fatPerUnit: 0.4, proteinPerUnit: 2.9, image: 'feather' },
  // 番茄：100g = 18kcal, 碳水3.9g, 脂肪0.2g, 蛋白0.9g
  { id: 'tomato', name: '番茄', category: 'vegetable', calories: 18, carbs: 3.9, fat: 0.2, protein: 0.9, unit: '个', servingSize: 150, caloriesPerUnit: 27, carbsPerUnit: 5.9, fatPerUnit: 0.3, proteinPerUnit: 1.4, image: 'feather' },
  // 黄瓜：100g = 15kcal, 碳水3.6g, 脂肪0.1g, 蛋白0.7g
  { id: 'cucumber', name: '黄瓜', category: 'vegetable', calories: 15, carbs: 3.6, fat: 0.1, protein: 0.7, unit: '根', servingSize: 150, caloriesPerUnit: 23, carbsPerUnit: 5.4, fatPerUnit: 0.2, proteinPerUnit: 1.1, image: 'feather' },
  // 胡萝卜：100g = 41kcal, 碳水9.6g, 脂肪0.2g, 蛋白0.9g
  { id: 'carrot', name: '胡萝卜', category: 'vegetable', calories: 41, carbs: 9.6, fat: 0.2, protein: 0.9, unit: '根', servingSize: 100, caloriesPerUnit: 41, carbsPerUnit: 9.6, fatPerUnit: 0.2, proteinPerUnit: 0.9, image: 'feather' },
  // 生菜：100g = 15kcal, 碳水2.9g, 脂肪0.2g, 蛋白1.4g
  { id: 'lettuce', name: '生菜', category: 'vegetable', calories: 15, carbs: 2.9, fat: 0.2, protein: 1.4, unit: '份', servingSize: 100, caloriesPerUnit: 15, carbsPerUnit: 2.9, fatPerUnit: 0.2, proteinPerUnit: 1.4, image: 'feather' },
  // 蘑菇：100g = 22kcal, 碳水3.3g, 脂肪0.3g, 蛋白3.1g
  { id: 'mushroom', name: '蘑菇', category: 'vegetable', calories: 22, carbs: 3.3, fat: 0.3, protein: 3.1, unit: '份', servingSize: 100, caloriesPerUnit: 22, carbsPerUnit: 3.3, fatPerUnit: 0.3, proteinPerUnit: 3.1, image: 'feather' },
  // 芦笋：100g = 20kcal, 碳水3.9g, 脂肪0.1g, 蛋白2.2g
  { id: 'asparagus', name: '芦笋', category: 'vegetable', calories: 20, carbs: 3.9, fat: 0.1, protein: 2.2, unit: '份', servingSize: 100, caloriesPerUnit: 20, carbsPerUnit: 3.9, fatPerUnit: 0.1, proteinPerUnit: 2.2, image: 'feather' },
  // 青椒：100g = 26kcal, 碳水6.0g, 脂肪0.3g, 蛋白1.0g
  { id: 'bell_pepper', name: '青椒', category: 'vegetable', calories: 26, carbs: 6.0, fat: 0.3, protein: 1.0, unit: '份', servingSize: 100, caloriesPerUnit: 26, carbsPerUnit: 6.0, fatPerUnit: 0.3, proteinPerUnit: 1.0, image: 'feather' },
  // 芹菜：100g = 16kcal, 碳水3.0g, 脂肪0.2g, 蛋白0.7g
  { id: 'celery', name: '芹菜', category: 'vegetable', calories: 16, carbs: 3.0, fat: 0.2, protein: 0.7, unit: '份', servingSize: 100, caloriesPerUnit: 16, carbsPerUnit: 3.0, fatPerUnit: 0.2, proteinPerUnit: 0.7, image: 'feather' },

  // ========== 水果类 ==========
  // 苹果：100g = 52kcal, 碳水13.8g, 脂肪0.2g, 蛋白0.3g
  { id: 'apple', name: '苹果', category: 'fruit', calories: 52, carbs: 13.8, fat: 0.2, protein: 0.3, unit: '个', servingSize: 180, caloriesPerUnit: 94, carbsPerUnit: 24.8, fatPerUnit: 0.4, proteinPerUnit: 0.5, image: 'feather' },
  // 香蕉：100g = 89kcal, 碳水22.8g, 脂肪0.3g, 蛋白1.1g
  { id: 'banana', name: '香蕉', category: 'fruit', calories: 89, carbs: 22.8, fat: 0.3, protein: 1.1, unit: '根', servingSize: 120, caloriesPerUnit: 107, carbsPerUnit: 27.4, fatPerUnit: 0.4, proteinPerUnit: 1.3, image: 'feather' },
  // 橙子：100g = 47kcal, 碳水11.8g, 脂肪0.1g, 蛋白0.9g
  { id: 'orange', name: '橙子', category: 'fruit', calories: 47, carbs: 11.8, fat: 0.1, protein: 0.9, unit: '个', servingSize: 150, caloriesPerUnit: 71, carbsPerUnit: 17.7, fatPerUnit: 0.2, proteinPerUnit: 1.4, image: 'feather' },
  // 草莓：100g = 32kcal, 碳水7.7g, 脂肪0.3g, 蛋白0.7g
  { id: 'strawberry', name: '草莓', category: 'fruit', calories: 32, carbs: 7.7, fat: 0.3, protein: 0.7, unit: '份', servingSize: 100, caloriesPerUnit: 32, carbsPerUnit: 7.7, fatPerUnit: 0.3, proteinPerUnit: 0.7, image: 'feather' },
  // 葡萄：100g = 67kcal, 碳水17.3g, 脂肪0.2g, 蛋白0.6g
  { id: 'grape', name: '葡萄', category: 'fruit', calories: 67, carbs: 17.3, fat: 0.2, protein: 0.6, unit: '份', servingSize: 100, caloriesPerUnit: 67, carbsPerUnit: 17.3, fatPerUnit: 0.2, proteinPerUnit: 0.6, image: 'feather' },
  // 西瓜：100g = 30kcal, 碳水7.6g, 脂肪0.1g, 蛋白0.6g
  { id: 'watermelon', name: '西瓜', category: 'fruit', calories: 30, carbs: 7.6, fat: 0.1, protein: 0.6, unit: '块', servingSize: 300, caloriesPerUnit: 90, carbsPerUnit: 22.8, fatPerUnit: 0.3, proteinPerUnit: 1.8, image: 'feather' },
  // 蓝莓：100g = 57kcal, 碳水14.5g, 脂肪0.3g, 蛋白0.7g
  { id: 'blueberry', name: '蓝莓', category: 'fruit', calories: 57, carbs: 14.5, fat: 0.3, protein: 0.7, unit: '份', servingSize: 100, caloriesPerUnit: 57, carbsPerUnit: 14.5, fatPerUnit: 0.3, proteinPerUnit: 0.7, image: 'feather' },
  // 牛油果：100g = 160kcal, 碳水8.5g, 脂肪14.7g, 蛋白2.0g
  { id: 'avocado', name: '牛油果', category: 'fruit', calories: 160, carbs: 8.5, fat: 14.7, protein: 2.0, unit: '个', servingSize: 150, caloriesPerUnit: 240, carbsPerUnit: 12.8, fatPerUnit: 22.1, proteinPerUnit: 3.0, image: 'feather' },
  // 猕猴桃：100g = 61kcal, 碳水14.5g, 脂肪0.5g, 蛋白1.1g
  { id: 'kiwi', name: '猕猴桃', category: 'fruit', calories: 61, carbs: 14.5, fat: 0.5, protein: 1.1, unit: '个', servingSize: 80, caloriesPerUnit: 49, carbsPerUnit: 11.6, fatPerUnit: 0.4, proteinPerUnit: 0.9, image: 'feather' },
  // 火龙果：100g = 50kcal, 碳水13.0g, 脂肪0.0g, 蛋白1.1g
  { id: 'dragon_fruit', name: '火龙果', category: 'fruit', calories: 50, carbs: 13.0, fat: 0.0, protein: 1.1, unit: '个', servingSize: 200, caloriesPerUnit: 100, carbsPerUnit: 26.0, fatPerUnit: 0.0, proteinPerUnit: 2.2, image: 'feather' },

  // ========== 肉类 ==========
  // 鸡胸肉：100g = 133kcal, 碳水0.0g, 脂肪3.1g, 蛋白31.0g
  { id: 'chicken_breast', name: '鸡胸肉', category: 'meat', calories: 133, carbs: 0.0, fat: 3.1, protein: 31.0, unit: '份', servingSize: 150, caloriesPerUnit: 200, carbsPerUnit: 0.0, fatPerUnit: 4.7, proteinPerUnit: 46.5, image: 'feather' },
  // 鱼肉：100g = 90kcal, 碳水0.0g, 脂肪2.0g, 蛋白20.0g
  { id: 'fish', name: '鱼肉', category: 'meat', calories: 90, carbs: 0.0, fat: 2.0, protein: 20.0, unit: '份', servingSize: 150, caloriesPerUnit: 135, carbsPerUnit: 0.0, fatPerUnit: 3.0, proteinPerUnit: 30.0, image: 'feather' },
  // 牛肉：100g = 125kcal, 碳水0.0g, 脂肪5.0g, 蛋白26.0g
  { id: 'beef', name: '牛肉', category: 'meat', calories: 125, carbs: 0.0, fat: 5.0, protein: 26.0, unit: '份', servingSize: 150, caloriesPerUnit: 188, carbsPerUnit: 0.0, fatPerUnit: 7.5, proteinPerUnit: 39.0, image: 'feather' },
  // 猪肉：100g = 143kcal, 碳水0.0g, 脂肪7.0g, 蛋白21.0g
  { id: 'pork', name: '猪肉', category: 'meat', calories: 143, carbs: 0.0, fat: 7.0, protein: 21.0, unit: '份', servingSize: 150, caloriesPerUnit: 215, carbsPerUnit: 0.0, fatPerUnit: 10.5, proteinPerUnit: 31.5, image: 'feather' },
  // 虾：100g = 85kcal, 碳水0.2g, 脂肪0.5g, 蛋白20.0g
  { id: 'shrimp', name: '虾', category: 'meat', calories: 85, carbs: 0.2, fat: 0.5, protein: 20.0, unit: '份', servingSize: 100, caloriesPerUnit: 85, carbsPerUnit: 0.2, fatPerUnit: 0.5, proteinPerUnit: 20.0, image: 'feather' },
  // 豆腐：100g = 76kcal, 碳水1.9g, 脂肪4.8g, 蛋白8.1g
  { id: 'tofu', name: '豆腐', category: 'meat', calories: 76, carbs: 1.9, fat: 4.8, protein: 8.1, unit: '块', servingSize: 100, caloriesPerUnit: 76, carbsPerUnit: 1.9, fatPerUnit: 4.8, proteinPerUnit: 8.1, image: 'feather' },
  // 豆皮：100g = 302kcal, 碳水8.0g, 脂肪18.0g, 蛋白35.0g
  { id: 'tofu_skin', name: '豆皮', category: 'meat', calories: 302, carbs: 8.0, fat: 18.0, protein: 35.0, unit: '份', servingSize: 50, caloriesPerUnit: 151, carbsPerUnit: 4.0, fatPerUnit: 9.0, proteinPerUnit: 17.5, image: 'feather' },
  // 鸭肉：100g = 145kcal, 碳水0.0g, 脂肪8.0g, 蛋白18.0g
  { id: 'duck', name: '鸭肉', category: 'meat', calories: 145, carbs: 0.0, fat: 8.0, protein: 18.0, unit: '份', servingSize: 150, caloriesPerUnit: 218, carbsPerUnit: 0.0, fatPerUnit: 12.0, proteinPerUnit: 27.0, image: 'feather' },

  // ========== 蛋类 ==========
  // 鸡蛋：100g = 155kcal, 碳水1.1g, 脂肪11.0g, 蛋白13.0g
  { id: 'egg', name: '鸡蛋', category: 'egg', calories: 155, carbs: 1.1, fat: 11.0, protein: 13.0, unit: '个', servingSize: 50, caloriesPerUnit: 78, carbsPerUnit: 0.6, fatPerUnit: 5.5, proteinPerUnit: 6.5, image: 'feather' },
  // 蛋白：100g = 52kcal, 碳水0.7g, 脂肪0.2g, 蛋白11.0g
  { id: 'egg_white', name: '蛋白', category: 'egg', calories: 52, carbs: 0.7, fat: 0.2, protein: 11.0, unit: '个', servingSize: 33, caloriesPerUnit: 17, carbsPerUnit: 0.2, fatPerUnit: 0.1, proteinPerUnit: 3.6, image: 'feather' },
  // 蛋黄：100g = 322kcal, 碳水3.6g, 脂肪26.0g, 蛋白16.0g
  { id: 'egg_yolk', name: '蛋黄', category: 'egg', calories: 322, carbs: 3.6, fat: 26.0, protein: 16.0, unit: '个', servingSize: 17, caloriesPerUnit: 55, carbsPerUnit: 0.6, fatPerUnit: 4.4, proteinPerUnit: 2.7, image: 'feather' },

  // ========== 乳制品类 ==========
  // 牛奶：100g = 42kcal, 碳水5.0g, 脂肪1.0g, 蛋白3.2g
  { id: 'milk', name: '牛奶', category: 'dairy', calories: 42, carbs: 5.0, fat: 1.0, protein: 3.2, unit: '杯', servingSize: 250, caloriesPerUnit: 105, carbsPerUnit: 12.5, fatPerUnit: 2.5, proteinPerUnit: 8.0, image: 'droplet' },
  // 低脂牛奶：100g = 35kcal, 碳水5.0g, 脂肪0.4g, 蛋白3.4g
  { id: 'skim_milk', name: '低脂牛奶', category: 'dairy', calories: 35, carbs: 5.0, fat: 0.4, protein: 3.4, unit: '杯', servingSize: 250, caloriesPerUnit: 88, carbsPerUnit: 12.5, fatPerUnit: 1.0, proteinPerUnit: 8.5, image: 'droplet' },
  // 无糖豆浆：100g = 33kcal, 碳水1.2g, 脂肪1.8g, 蛋白2.9g
  { id: 'soy_milk_unsweet', name: '无糖豆浆', category: 'dairy', calories: 33, carbs: 1.2, fat: 1.8, protein: 2.9, unit: '杯', servingSize: 250, caloriesPerUnit: 83, carbsPerUnit: 3.0, fatPerUnit: 4.5, proteinPerUnit: 7.3, image: 'droplet' },
  // 原味豆浆：100g = 45kcal, 碳水3.5g, 脂肪1.6g, 蛋白2.8g
  { id: 'soy_milk_original', name: '原味豆浆', category: 'dairy', calories: 45, carbs: 3.5, fat: 1.6, protein: 2.8, unit: '杯', servingSize: 250, caloriesPerUnit: 113, carbsPerUnit: 8.8, fatPerUnit: 4.0, proteinPerUnit: 7.0, image: 'droplet' },
  // 甜豆浆：100g = 60kcal, 碳水9.8g, 脂肪1.5g, 蛋白2.6g
  { id: 'soy_milk_sweet', name: '甜豆浆', category: 'dairy', calories: 60, carbs: 9.8, fat: 1.5, protein: 2.6, unit: '杯', servingSize: 250, caloriesPerUnit: 150, carbsPerUnit: 24.5, fatPerUnit: 3.8, proteinPerUnit: 6.5, image: 'droplet' },
  // 豆浆粉（无糖）：100g = 400kcal, 碳水25.0g, 脂肪20.0g, 蛋白30.0g
  { id: 'soy_milk_powder_unsweet', name: '无糖豆浆粉', category: 'dairy', calories: 400, carbs: 25.0, fat: 20.0, protein: 30.0, unit: '勺', servingSize: 25, caloriesPerUnit: 100, carbsPerUnit: 6.3, fatPerUnit: 5.0, proteinPerUnit: 7.5, image: 'droplet' },
  // 豆浆粉（含糖）：100g = 420kcal, 碳水55.0g, 脂肪12.0g, 蛋白20.0g
  { id: 'soy_milk_powder_sweet', name: '甜豆浆粉', category: 'dairy', calories: 420, carbs: 55.0, fat: 12.0, protein: 20.0, unit: '勺', servingSize: 25, caloriesPerUnit: 105, carbsPerUnit: 13.8, fatPerUnit: 3.0, proteinPerUnit: 5.0, image: 'droplet' },
  // 酸奶：100g = 59kcal, 碳水9.3g, 脂肪1.0g, 蛋白3.2g
  { id: 'yogurt', name: '酸奶', category: 'dairy', calories: 59, carbs: 9.3, fat: 1.0, protein: 3.2, unit: '杯', servingSize: 200, caloriesPerUnit: 118, carbsPerUnit: 18.6, fatPerUnit: 2.0, proteinPerUnit: 6.4, image: 'droplet' },
  // 无糖酸奶：100g = 48kcal, 碳水4.0g, 脂肪0.7g, 蛋白3.5g
  { id: 'yogurt_unsweet', name: '无糖酸奶', category: 'dairy', calories: 48, carbs: 4.0, fat: 0.7, protein: 3.5, unit: '杯', servingSize: 200, caloriesPerUnit: 96, carbsPerUnit: 8.0, fatPerUnit: 1.4, proteinPerUnit: 7.0, image: 'droplet' },
  // 奶酪：100g = 402kcal, 碳水1.3g, 脂肪33.0g, 蛋白25.0g
  { id: 'cheese', name: '奶酪', category: 'dairy', calories: 402, carbs: 1.3, fat: 33.0, protein: 25.0, unit: '片', servingSize: 30, caloriesPerUnit: 121, carbsPerUnit: 0.4, fatPerUnit: 9.9, proteinPerUnit: 7.5, image: 'feather' },

  // ========== 坚果类 ==========
  // 杏仁：100g = 579kcal, 碳水22.0g, 脂肪50.0g, 蛋白21.0g
  { id: 'almond', name: '杏仁', category: 'snack', calories: 579, carbs: 22.0, fat: 50.0, protein: 21.0, unit: '把', servingSize: 30, caloriesPerUnit: 174, carbsPerUnit: 6.6, fatPerUnit: 15.0, proteinPerUnit: 6.3, image: 'feather' },
  // 开心果：100g = 560kcal, 碳水28.0g, 脂肪45.0g, 蛋白20.0g
  { id: 'pistachio', name: '开心果', category: 'snack', calories: 560, carbs: 28.0, fat: 45.0, protein: 20.0, unit: '把', servingSize: 30, caloriesPerUnit: 168, carbsPerUnit: 8.4, fatPerUnit: 13.5, proteinPerUnit: 6.0, image: 'feather' },
  // 巴旦木：100g = 579kcal, 碳水21.0g, 脂肪50.0g, 蛋白21.0g
  { id: 'badam', name: '巴旦木', category: 'snack', calories: 579, carbs: 21.0, fat: 50.0, protein: 21.0, unit: '把', servingSize: 30, caloriesPerUnit: 174, carbsPerUnit: 6.3, fatPerUnit: 15.0, proteinPerUnit: 6.3, image: 'feather' },
  // 核桃：100g = 654kcal, 碳水14.0g, 脂肪65.0g, 蛋白15.0g
  { id: 'walnut', name: '核桃', category: 'snack', calories: 654, carbs: 14.0, fat: 65.0, protein: 15.0, unit: '把', servingSize: 30, caloriesPerUnit: 196, carbsPerUnit: 4.2, fatPerUnit: 19.5, proteinPerUnit: 4.5, image: 'feather' },
  // 腰果：100g = 553kcal, 碳水30.0g, 脂肪44.0g, 蛋白18.0g
  { id: 'cashew', name: '腰果', category: 'snack', calories: 553, carbs: 30.0, fat: 44.0, protein: 18.0, unit: '把', servingSize: 30, caloriesPerUnit: 166, carbsPerUnit: 9.0, fatPerUnit: 13.2, proteinPerUnit: 5.4, image: 'feather' },
  // 夏威夷果：100g = 718kcal, 碳水14.0g, 脂肪76.0g, 蛋白8.0g
  { id: 'macadamia', name: '夏威夷果', category: 'snack', calories: 718, carbs: 14.0, fat: 76.0, protein: 8.0, unit: '把', servingSize: 30, caloriesPerUnit: 215, carbsPerUnit: 4.2, fatPerUnit: 22.8, proteinPerUnit: 2.4, image: 'feather' },
  // 碧根果：100g = 691kcal, 碳水18.0g, 脂肪72.0g, 蛋白9.0g
  { id: 'pecan', name: '碧根果', category: 'snack', calories: 691, carbs: 18.0, fat: 72.0, protein: 9.0, unit: '把', servingSize: 30, caloriesPerUnit: 207, carbsPerUnit: 5.4, fatPerUnit: 21.6, proteinPerUnit: 2.7, image: 'feather' },
  // 松子：100g = 673kcal, 碳水13.0g, 脂肪68.0g, 蛋白14.0g
  { id: 'pine_nut', name: '松子', category: 'snack', calories: 673, carbs: 13.0, fat: 68.0, protein: 14.0, unit: '把', servingSize: 30, caloriesPerUnit: 202, carbsPerUnit: 3.9, fatPerUnit: 20.4, proteinPerUnit: 4.2, image: 'feather' },
  // 榛子：100g = 607kcal, 碳水17.0g, 脂肪60.0g, 蛋白15.0g
  { id: 'hazelnut', name: '榛子', category: 'snack', calories: 607, carbs: 17.0, fat: 60.0, protein: 15.0, unit: '把', servingSize: 30, caloriesPerUnit: 182, carbsPerUnit: 5.1, fatPerUnit: 18.0, proteinPerUnit: 4.5, image: 'feather' },
  // 花生：100g = 567kcal, 碳水16.0g, 脂肪49.0g, 蛋白26.0g
  { id: 'peanut', name: '花生', category: 'snack', calories: 567, carbs: 16.0, fat: 49.0, protein: 26.0, unit: '把', servingSize: 30, caloriesPerUnit: 170, carbsPerUnit: 4.8, fatPerUnit: 14.7, proteinPerUnit: 7.8, image: 'feather' },
  // 葵花籽：100g = 584kcal, 碳水20.0g, 脂肪51.0g, 蛋白21.0g
  { id: 'sunflower_seed', name: '葵花籽', category: 'snack', calories: 584, carbs: 20.0, fat: 51.0, protein: 21.0, unit: '把', servingSize: 30, caloriesPerUnit: 175, carbsPerUnit: 6.0, fatPerUnit: 15.3, proteinPerUnit: 6.3, image: 'feather' },
  // 南瓜子：100g = 559kcal, 碳水10.0g, 脂肪49.0g, 蛋白30.0g
  { id: 'pumpkin_seed', name: '南瓜子', category: 'snack', calories: 559, carbs: 10.0, fat: 49.0, protein: 30.0, unit: '把', servingSize: 30, caloriesPerUnit: 168, carbsPerUnit: 3.0, fatPerUnit: 14.7, proteinPerUnit: 9.0, image: 'feather' },
  // 葡萄干：100g = 299kcal, 碳水79.0g, 脂肪0.5g, 蛋白3.0g
  { id: 'raisin', name: '葡萄干', category: 'snack', calories: 299, carbs: 79.0, fat: 0.5, protein: 3.0, unit: '把', servingSize: 30, caloriesPerUnit: 90, carbsPerUnit: 23.7, fatPerUnit: 0.2, proteinPerUnit: 0.9, image: 'feather' },
  // 黑巧克力：100g = 546kcal, 碳水46.0g, 脂肪43.0g, 蛋白5.0g
  { id: 'dark_chocolate', name: '黑巧克力', category: 'snack', calories: 546, carbs: 46.0, fat: 43.0, protein: 5.0, unit: '块', servingSize: 20, caloriesPerUnit: 109, carbsPerUnit: 9.2, fatPerUnit: 8.6, proteinPerUnit: 1.0, image: 'feather' },
  // 全麦饼干：100g = 440kcal, 碳水67.0g, 脂肪15.0g, 蛋白8.0g
  { id: 'cracker', name: '全麦饼干', category: 'snack', calories: 440, carbs: 67.0, fat: 15.0, protein: 8.0, unit: '片', servingSize: 10, caloriesPerUnit: 44, carbsPerUnit: 6.7, fatPerUnit: 1.5, proteinPerUnit: 0.8, image: 'circle' },
  // 爆米花：100g = 387kcal, 碳水78.0g, 脂肪5.0g, 蛋白13.0g
  { id: 'popcorn', name: '爆米花', category: 'snack', calories: 387, carbs: 78.0, fat: 5.0, protein: 13.0, unit: '份', servingSize: 30, caloriesPerUnit: 116, carbsPerUnit: 23.4, fatPerUnit: 1.5, proteinPerUnit: 3.9, image: 'feather' },
  // 花生：100g = 567kcal, 碳水16.0g, 脂肪49.0g, 蛋白26.0g
  { id: 'peanut', name: '花生', category: 'snack', calories: 567, carbs: 16.0, fat: 49.0, protein: 26.0, unit: '把', servingSize: 30, caloriesPerUnit: 170, carbsPerUnit: 4.8, fatPerUnit: 14.7, proteinPerUnit: 7.8, image: 'feather' },

  // ========== 饮品 ==========
  // 白开水：0kcal
  { id: 'water', name: '白开水', category: 'drink', calories: 0, carbs: 0.0, fat: 0.0, protein: 0.0, unit: '杯', servingSize: 250, caloriesPerUnit: 0, carbsPerUnit: 0.0, fatPerUnit: 0.0, proteinPerUnit: 0.0, image: 'droplet' },
  // 绿茶：100g = 1kcal
  { id: 'green_tea', name: '绿茶', category: 'drink', calories: 1, carbs: 0.0, fat: 0.0, protein: 0.0, unit: '杯', servingSize: 250, caloriesPerUnit: 1, carbsPerUnit: 0.0, fatPerUnit: 0.0, proteinPerUnit: 0.0, image: 'coffee' },
  // 红茶：100g = 2kcal
  { id: 'black_tea', name: '红茶', category: 'drink', calories: 2, carbs: 0.0, fat: 0.0, protein: 0.0, unit: '杯', servingSize: 250, caloriesPerUnit: 2, carbsPerUnit: 0.0, fatPerUnit: 0.0, proteinPerUnit: 0.0, image: 'coffee' },
  // 乌龙茶：100g = 1kcal
  { id: 'oolong_tea', name: '乌龙茶', category: 'drink', calories: 1, carbs: 0.0, fat: 0.0, protein: 0.0, unit: '杯', servingSize: 250, caloriesPerUnit: 1, carbsPerUnit: 0.0, fatPerUnit: 0.0, proteinPerUnit: 0.0, image: 'coffee' },
  // 茉莉花茶：100g = 1kcal
  { id: 'jasmine_tea', name: '茉莉花茶', category: 'drink', calories: 1, carbs: 0.0, fat: 0.0, protein: 0.0, unit: '杯', servingSize: 250, caloriesPerUnit: 1, carbsPerUnit: 0.0, fatPerUnit: 0.0, proteinPerUnit: 0.0, image: 'coffee' },
  // 柠檬水：100g = 20kcal, 碳水5.0g, 脂肪0.0g, 蛋白0.0g
  { id: 'lemon_water', name: '柠檬水', category: 'drink', calories: 20, carbs: 5.0, fat: 0.0, protein: 0.0, unit: '杯', servingSize: 300, caloriesPerUnit: 60, carbsPerUnit: 15.0, fatPerUnit: 0.0, proteinPerUnit: 0.0, image: 'droplet' },
  // 椰子水：100g = 19kcal, 碳水3.7g, 脂肪0.2g, 蛋白0.7g
  { id: 'coconut_water', name: '椰子水', category: 'drink', calories: 19, carbs: 3.7, fat: 0.2, protein: 0.7, unit: '杯', servingSize: 240, caloriesPerUnit: 46, carbsPerUnit: 8.9, fatPerUnit: 0.5, proteinPerUnit: 1.7, image: 'feather' },
  
  // ========== 咖啡 ==========
  // 美式咖啡（小杯）：约150ml, 10kcal
  { id: 'americano_short', name: '美式咖啡(小杯)', category: 'drink', calories: 10, carbs: 2.0, fat: 0.0, protein: 0.5, unit: '杯', servingSize: 150, caloriesPerUnit: 10, carbsPerUnit: 2.0, fatPerUnit: 0.0, proteinPerUnit: 0.5, image: 'coffee' },
  // 美式咖啡（中杯）：约300ml, 15kcal
  { id: 'americano_tall', name: '美式咖啡(中杯)', category: 'drink', calories: 15, carbs: 3.0, fat: 0.0, protein: 0.5, unit: '杯', servingSize: 300, caloriesPerUnit: 15, carbsPerUnit: 3.0, fatPerUnit: 0.0, proteinPerUnit: 0.5, image: 'coffee' },
  // 拿铁咖啡（小杯）：约200ml, 100kcal, 碳水10g, 脂肪4g, 蛋白5g
  { id: 'latte_short', name: '拿铁咖啡(小杯)', category: 'drink', calories: 100, carbs: 10.0, fat: 4.0, protein: 5.0, unit: '杯', servingSize: 200, caloriesPerUnit: 100, carbsPerUnit: 10.0, fatPerUnit: 4.0, proteinPerUnit: 5.0, image: 'coffee' },
  // 拿铁咖啡（中杯）：约350ml, 150kcal
  { id: 'latte_tall', name: '拿铁咖啡(中杯)', category: 'drink', calories: 150, carbs: 15.0, fat: 6.0, protein: 8.0, unit: '杯', servingSize: 350, caloriesPerUnit: 150, carbsPerUnit: 15.0, fatPerUnit: 6.0, proteinPerUnit: 8.0, image: 'coffee' },
  // 燕麦拿铁（中杯）：约350ml, 170kcal, 碳水25g, 脂肪5g, 蛋白6g
  { id: 'oat_latte', name: '燕麦拿铁(中杯)', category: 'drink', calories: 170, carbs: 25.0, fat: 5.0, protein: 6.0, unit: '杯', servingSize: 350, caloriesPerUnit: 170, carbsPerUnit: 25.0, fatPerUnit: 5.0, proteinPerUnit: 6.0, image: 'coffee' },
  // 卡布奇诺（小杯）：约200ml, 80kcal, 碳水8g, 脂肪3g, 蛋白4g
  { id: 'cappuccino', name: '卡布奇诺(小杯)', category: 'drink', calories: 80, carbs: 8.0, fat: 3.0, protein: 4.0, unit: '杯', servingSize: 200, caloriesPerUnit: 80, carbsPerUnit: 8.0, fatPerUnit: 3.0, proteinPerUnit: 4.0, image: 'coffee' },
  // 摩卡（中杯）：约350ml, 290kcal, 碳水45g, 脂肪10g, 蛋白8g
  { id: 'mocha', name: '摩卡(中杯)', category: 'drink', calories: 290, carbs: 45.0, fat: 10.0, protein: 8.0, unit: '杯', servingSize: 350, caloriesPerUnit: 290, carbsPerUnit: 45.0, fatPerUnit: 10.0, proteinPerUnit: 8.0, image: 'coffee' },
  // 白咖啡（中杯）：约350ml, 190kcal, 碳水22g, 脂肪8g, 蛋白9g
  { id: 'flat_white', name: '馥芮白(中杯)', category: 'drink', calories: 190, carbs: 22.0, fat: 8.0, protein: 9.0, unit: '杯', servingSize: 350, caloriesPerUnit: 190, carbsPerUnit: 22.0, fatPerUnit: 8.0, proteinPerUnit: 9.0, image: 'coffee' },
  // 焦糖玛奇朵（中杯）：约350ml, 240kcal, 碳水38g, 脂肪6g, 蛋白6g
  { id: 'caramel_macchiato', name: '焦糖玛奇朵(中杯)', category: 'drink', calories: 240, carbs: 38.0, fat: 6.0, protein: 6.0, unit: '杯', servingSize: 350, caloriesPerUnit: 240, carbsPerUnit: 38.0, fatPerUnit: 6.0, proteinPerUnit: 6.0, image: 'coffee' },
  // 香草拿铁（中杯）：约350ml, 230kcal, 碳水35g, 脂肪6g, 蛋白6g
  { id: 'vanilla_latte', name: '香草拿铁(中杯)', category: 'drink', calories: 230, carbs: 35.0, fat: 6.0, protein: 6.0, unit: '杯', servingSize: 350, caloriesPerUnit: 230, carbsPerUnit: 35.0, fatPerUnit: 6.0, proteinPerUnit: 6.0, image: 'coffee' },
  // 榛果拿铁（中杯）：约350ml, 230kcal, 碳水35g, 脂肪6g, 蛋白6g
  { id: 'hazelnut_latte', name: '榛果拿铁(中杯)', category: 'drink', calories: 230, carbs: 35.0, fat: 6.0, protein: 6.0, unit: '杯', servingSize: 350, caloriesPerUnit: 230, carbsPerUnit: 35.0, fatPerUnit: 6.0, proteinPerUnit: 6.0, image: 'coffee' },
  // 低卡路里拿铁（中杯）：约350ml, 90kcal, 碳水10g, 脂肪2g, 蛋白7g
  { id: 'light_latte', name: '低卡拿铁(中杯)', category: 'drink', calories: 90, carbs: 10.0, fat: 2.0, protein: 7.0, unit: '杯', servingSize: 350, caloriesPerUnit: 90, carbsPerUnit: 10.0, fatPerUnit: 2.0, proteinPerUnit: 7.0, image: 'coffee' },
  // 冷萃咖啡（中杯）：约350ml, 80kcal, 碳水3g, 脂肪0g, 蛋白0g
  { id: 'cold_brew', name: '冷萃咖啡(中杯)', category: 'drink', calories: 80, carbs: 3.0, fat: 0.0, protein: 0.0, unit: '杯', servingSize: 350, caloriesPerUnit: 80, carbsPerUnit: 3.0, fatPerUnit: 0.0, proteinPerUnit: 0.0, image: 'coffee' },
  // 星巴克星冰乐（香草）：约350ml, 360kcal, 碳水58g, 脂肪12g, 蛋白5g
  { id: 'frappuccino_vanilla', name: '星冰乐-香草味', category: 'drink', calories: 360, carbs: 58.0, fat: 12.0, protein: 5.0, unit: '杯', servingSize: 350, caloriesPerUnit: 360, carbsPerUnit: 58.0, fatPerUnit: 12.0, proteinPerUnit: 5.0, image: 'coffee' },
  // 星巴克星冰乐（焦糖）：约350ml, 380kcal, 碳水62g, 脂肪12g, 蛋白5g
  { id: 'frappuccino_caramel', name: '星冰乐-焦糖味', category: 'drink', calories: 380, carbs: 62.0, fat: 12.0, protein: 5.0, unit: '杯', servingSize: 350, caloriesPerUnit: 380, carbsPerUnit: 62.0, fatPerUnit: 12.0, proteinPerUnit: 5.0, image: 'coffee' },
  // 星巴克星冰乐（咖啡）：约350ml, 290kcal, 碳水47g, 脂肪10g, 蛋白5g
  { id: 'frappuccino_coffee', name: '星冰乐-咖啡味', category: 'drink', calories: 290, carbs: 47.0, fat: 10.0, protein: 5.0, unit: '杯', servingSize: 350, caloriesPerUnit: 290, carbsPerUnit: 47.0, fatPerUnit: 10.0, proteinPerUnit: 5.0, image: 'coffee' },
  // 星巴克星冰乐（抹茶）：约350ml, 340kcal, 碳水56g, 脂肪11g, 蛋白5g
  { id: 'frappuccino_matcha', name: '星冰乐-抹茶味', category: 'drink', calories: 340, carbs: 56.0, fat: 11.0, protein: 5.0, unit: '杯', servingSize: 350, caloriesPerUnit: 340, carbsPerUnit: 56.0, fatPerUnit: 11.0, proteinPerUnit: 5.0, image: 'coffee' },
  
  // ========== 其他饮品 ==========
  // 奶茶：100g = 60kcal, 碳水10.0g, 脂肪1.5g, 蛋白1.0g
  { id: 'milk_tea', name: '奶茶', category: 'drink', calories: 60, carbs: 10.0, fat: 1.5, protein: 1.0, unit: '杯', servingSize: 400, caloriesPerUnit: 240, carbsPerUnit: 40.0, fatPerUnit: 6.0, proteinPerUnit: 4.0, image: 'coffee' },
  // 水果奶昔：100g = 120kcal, 碳水25.0g, 脂肪1.5g, 蛋白2.5g
  { id: 'smoothie', name: '水果奶昔', category: 'drink', calories: 120, carbs: 25.0, fat: 1.5, protein: 2.5, unit: '杯', servingSize: 300, caloriesPerUnit: 360, carbsPerUnit: 75.0, fatPerUnit: 4.5, proteinPerUnit: 7.5, image: 'coffee' },
  // 100%橙汁：100ml = 45kcal, 碳水10g, 脂肪0g, 蛋白1g
  { id: 'orange_juice', name: '100%橙汁', category: 'drink', calories: 45, carbs: 10.0, fat: 0.0, protein: 1.0, unit: '杯', servingSize: 250, caloriesPerUnit: 113, carbsPerUnit: 25.0, fatPerUnit: 0.0, proteinPerUnit: 2.5, image: 'droplet' },
  // 苹果汁：100ml = 46kcal, 碳水12g, 脂肪0g, 蛋白0g
  { id: 'apple_juice', name: '苹果汁', category: 'drink', calories: 46, carbs: 12.0, fat: 0.0, protein: 0.0, unit: '杯', servingSize: 250, caloriesPerUnit: 115, carbsPerUnit: 30.0, fatPerUnit: 0.0, proteinPerUnit: 0.0, image: 'droplet' },
  // 可乐：100ml = 42kcal, 碳水11g, 脂肪0g, 蛋白0g
  { id: 'cola', name: '可乐', category: 'drink', calories: 42, carbs: 11.0, fat: 0.0, protein: 0.0, unit: '罐', servingSize: 330, caloriesPerUnit: 139, carbsPerUnit: 36.3, fatPerUnit: 0.0, proteinPerUnit: 0.0, image: 'droplet' },
  // 无糖可乐：0kcal
  { id: 'diet_cola', name: '无糖可乐', category: 'drink', calories: 0, carbs: 0.0, fat: 0.0, protein: 0.0, unit: '罐', servingSize: 330, caloriesPerUnit: 0, carbsPerUnit: 0.0, fatPerUnit: 0.0, proteinPerUnit: 0.0, image: 'droplet' },
];

// 根据分类获取食物
export const getFoodsByCategory = (category: string): FoodItem[] => {
  return FOOD_DATABASE.filter(food => food.category === category);
};

// 搜索食物
export const searchFoods = (query: string): FoodItem[] => {
  const lowerQuery = query.toLowerCase();
  return FOOD_DATABASE.filter(food => 
    food.name.toLowerCase().includes(lowerQuery)
  );
};

// 获取所有食物
export const getAllFoods = (): FoodItem[] => {
  return FOOD_DATABASE;
};

// 根据ID获取食物
export const getFoodById = (id: string): FoodItem | undefined => {
  return FOOD_DATABASE.find(food => food.id === id);
};

export default FOOD_DATABASE;

// ========== 快餐类 ==========
const FAST_FOOD_DATABASE: FoodItem[] = [
  // 汉堡：约200g, 500kcal, 碳水45g, 脂肪25g, 蛋白25g
  { id: 'hamburger', name: '汉堡', category: 'fastfood', calories: 500, carbs: 45.0, fat: 25.0, protein: 25.0, unit: '个', servingSize: 200, caloriesPerUnit: 500, carbsPerUnit: 45.0, fatPerUnit: 25.0, proteinPerUnit: 25.0, image: 'feather' },
  // 薯条（中份）：约100g, 340kcal, 碳水43g, 脂肪17g, 蛋白4g
  { id: 'french_fries', name: '薯条(中)', category: 'fastfood', calories: 340, carbs: 43.0, fat: 17.0, protein: 4.0, unit: '份', servingSize: 100, caloriesPerUnit: 340, carbsPerUnit: 43.0, fatPerUnit: 17.0, proteinPerUnit: 4.0, image: 'feather' },
  // 炸鸡翅：约100g, 290kcal, 碳水10g, 脂肪17g, 蛋白25g
  { id: 'fried_chicken_wing', name: '炸鸡翅', category: 'fastfood', calories: 290, carbs: 10.0, fat: 17.0, protein: 25.0, unit: '个', servingSize: 100, caloriesPerUnit: 290, carbsPerUnit: 10.0, fatPerUnit: 17.0, proteinPerUnit: 25.0, image: 'feather' },
  // 披萨（意式）：约100g, 250kcal, 碳水30g, 脂肪10g, 蛋白12g
  { id: 'pizza', name: '披萨', category: 'fastfood', calories: 250, carbs: 30.0, fat: 10.0, protein: 12.0, unit: '片', servingSize: 100, caloriesPerUnit: 250, carbsPerUnit: 30.0, fatPerUnit: 10.0, proteinPerUnit: 12.0, image: 'feather' },
  // 炒饭：约300g, 450kcal, 碳水65g, 脂肪15g, 蛋白12g
  { id: 'fried_rice', name: '炒饭', category: 'fastfood', calories: 450, carbs: 65.0, fat: 15.0, protein: 12.0, unit: '份', servingSize: 300, caloriesPerUnit: 450, carbsPerUnit: 65.0, fatPerUnit: 15.0, proteinPerUnit: 12.0, image: 'feather' },
  // 炒面：约300g, 420kcal, 碳水60g, 脂肪14g, 蛋白12g
  { id: 'fried_noodles', name: '炒面', category: 'fastfood', calories: 420, carbs: 60.0, fat: 14.0, protein: 12.0, unit: '份', servingSize: 300, caloriesPerUnit: 420, carbsPerUnit: 60.0, fatPerUnit: 14.0, proteinPerUnit: 12.0, image: 'feather' },
  // 麻辣烫：约500g, 350kcal, 碳水40g, 脂肪12g, 蛋白20g
  { id: 'malatang', name: '麻辣烫', category: 'fastfood', calories: 350, carbs: 40.0, fat: 12.0, protein: 20.0, unit: '份', servingSize: 500, caloriesPerUnit: 350, carbsPerUnit: 40.0, fatPerUnit: 12.0, proteinPerUnit: 20.0, image: 'feather' },
  // 煎饼果子：约150g, 280kcal, 碳水40g, 脂肪10g, 蛋白8g
  { id: 'jianbing', name: '煎饼果子', category: 'fastfood', calories: 280, carbs: 40.0, fat: 10.0, protein: 8.0, unit: '个', servingSize: 150, caloriesPerUnit: 280, carbsPerUnit: 40.0, fatPerUnit: 10.0, proteinPerUnit: 8.0, image: 'feather' },
  // 肉夹馍：约200g, 380kcal, 碳水45g, 脂肪16g, 蛋白18g
  { id: 'roujiamo', name: '肉夹馍', category: 'fastfood', calories: 380, carbs: 45.0, fat: 16.0, protein: 18.0, unit: '个', servingSize: 200, caloriesPerUnit: 380, carbsPerUnit: 45.0, fatPerUnit: 16.0, proteinPerUnit: 18.0, image: 'feather' },
  // 沙县拌面：约200g, 320kcal, 碳水50g, 脂肪10g, 蛋白10g
  { id: 'shaxian_noodles', name: '沙县拌面', category: 'fastfood', calories: 320, carbs: 50.0, fat: 10.0, protein: 10.0, unit: '份', servingSize: 200, caloriesPerUnit: 320, carbsPerUnit: 50.0, fatPerUnit: 10.0, proteinPerUnit: 10.0, image: 'feather' },
  // 螺蛳粉：约400g, 450kcal, 碳水65g, 脂肪15g, 蛋白15g
  { id: 'luosifen', name: '螺蛳粉', category: 'fastfood', calories: 450, carbs: 65.0, fat: 15.0, protein: 15.0, unit: '份', servingSize: 400, caloriesPerUnit: 450, carbsPerUnit: 65.0, fatPerUnit: 15.0, proteinPerUnit: 15.0, image: 'feather' },
  // 热干面：约300g, 380kcal, 碳水60g, 脂肪10g, 蛋白12g
  { id: 'reganmian', name: '热干面', category: 'fastfood', calories: 380, carbs: 60.0, fat: 10.0, protein: 12.0, unit: '份', servingSize: 300, caloriesPerUnit: 380, carbsPerUnit: 60.0, fatPerUnit: 10.0, proteinPerUnit: 12.0, image: 'feather' },
  // 酸辣粉：约400g, 320kcal, 碳水55g, 脂肪6g, 蛋白8g
  { id: 'suanlafen', name: '酸辣粉', category: 'fastfood', calories: 320, carbs: 55.0, fat: 6.0, protein: 8.0, unit: '份', servingSize: 400, caloriesPerUnit: 320, carbsPerUnit: 55.0, fatPerUnit: 6.0, proteinPerUnit: 8.0, image: 'feather' },
  // 炸酱面：约300g, 380kcal, 碳水55g, 脂肪12g, 蛋白15g
  { id: 'zhajiangmian', name: '炸酱面', category: 'fastfood', calories: 380, carbs: 55.0, fat: 12.0, protein: 15.0, unit: '份', servingSize: 300, caloriesPerUnit: 380, carbsPerUnit: 55.0, fatPerUnit: 12.0, proteinPerUnit: 15.0, image: 'feather' },
  // 兰州拉面：约400g, 420kcal, 碳水60g, 脂肪12g, 蛋白20g
  { id: 'lamian', name: '兰州拉面', category: 'fastfood', calories: 420, carbs: 60.0, fat: 12.0, protein: 20.0, unit: '碗', servingSize: 400, caloriesPerUnit: 420, carbsPerUnit: 60.0, fatPerUnit: 12.0, proteinPerUnit: 20.0, image: 'feather' },
  // 馄饨：约250g, 280kcal, 碳水35g, 脂肪8g, 蛋白15g
  { id: 'wonton', name: '馄饨', category: 'fastfood', calories: 280, carbs: 35.0, fat: 8.0, protein: 15.0, unit: '碗', servingSize: 250, caloriesPerUnit: 280, carbsPerUnit: 35.0, fatPerUnit: 8.0, proteinPerUnit: 15.0, image: 'feather' },
  // 小笼包：约150g, 300kcal, 碳水35g, 脂肪12g, 蛋白14g
  { id: 'xiaolongbao', name: '小笼包', category: 'fastfood', calories: 300, carbs: 35.0, fat: 12.0, protein: 14.0, unit: '份', servingSize: 150, caloriesPerUnit: 300, carbsPerUnit: 35.0, fatPerUnit: 12.0, proteinPerUnit: 14.0, image: 'feather' },
  // 包子：约100g, 200kcal, 碳水30g, 脂肪5g, 蛋白8g
  { id: 'baozi', name: '包子', category: 'fastfood', calories: 200, carbs: 30.0, fat: 5.0, protein: 8.0, unit: '个', servingSize: 100, caloriesPerUnit: 200, carbsPerUnit: 30.0, fatPerUnit: 5.0, proteinPerUnit: 8.0, image: 'feather' },
  // 油条：约50g, 195kcal, 碳水25g, 脂肪10g, 蛋白4g
  { id: 'youtiao', name: '油条', category: 'fastfood', calories: 195, carbs: 25.0, fat: 10.0, protein: 4.0, unit: '根', servingSize: 50, caloriesPerUnit: 195, carbsPerUnit: 25.0, fatPerUnit: 10.0, proteinPerUnit: 4.0, image: 'feather' },
  // 烧饼：约100g, 280kcal, 碳水40g, 脂肪10g, 蛋白8g
  { id: 'shaobing', name: '烧饼', category: 'fastfood', calories: 280, carbs: 40.0, fat: 10.0, protein: 8.0, unit: '个', servingSize: 100, caloriesPerUnit: 280, carbsPerUnit: 40.0, fatPerUnit: 10.0, proteinPerUnit: 8.0, image: 'feather' },
];

// 合并所有食物到主数据库
export const FOOD_DATABASE_FULL = [...FOOD_DATABASE, ...FAST_FOOD_DATABASE];

// 更新搜索函数
export const searchFoodsFull = (query: string): FoodItem[] => {
  const lowerQuery = query.toLowerCase();
  return FOOD_DATABASE_FULL.filter(food => 
    food.name.toLowerCase().includes(lowerQuery)
  );
};

// 更新获取所有食物函数
export const getAllFoodsFull = (): FoodItem[] => {
  return FOOD_DATABASE_FULL;
};
