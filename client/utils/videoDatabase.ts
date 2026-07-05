/**
 * 视频/音频资源数据库
 * 包含YouTube视频、播客、健康教程等
 */

export interface VideoResource {
  id: string;
  title: string;
  description: string;
  type: 'youtube' | 'podcast' | 'tutorial' | 'interview';
  duration: string; // 时长，如 "15:30"
  thumbnail?: string;
  url: string;
  tags: string[];
  source: string; // 来源：YouTube/Spotify/官方
  category: string; // 分类：减脂/心理/营养/运动/暴食症
}

export const VIDEO_DATABASE: VideoResource[] = [
  // YouTube健身教程
  {
    id: 'yt_1',
    title: '10分钟晨间拉伸唤醒身体',
    description: '温和的晨间拉伸动作，帮助唤醒身体，提升一天的新陈代谢',
    type: 'tutorial',
    duration: '10:30',
    url: 'https://www.youtube.com/results?search_query=morning+stretch+exercise',
    tags: ['运动', '拉伸', '晨间', '入门'],
    source: 'YouTube',
    category: '运动',
  },
  {
    id: 'yt_2',
    title: '居家HIIT燃脂训练',
    description: '无需器材的高强度间歇训练，20分钟高效燃脂',
    type: 'tutorial',
    duration: '20:15',
    url: 'https://www.youtube.com/results?search_query=hiit+home+workout',
    tags: ['运动', 'HIIT', '燃脂', '居家'],
    source: 'YouTube',
    category: '运动',
  },
  {
    id: 'yt_3',
    title: '瑜伽疗愈：缓解情绪性进食',
    description: '通过瑜伽呼吸和冥想，帮助调节情绪，减少情绪性进食',
    type: 'tutorial',
    duration: '25:00',
    url: 'https://www.youtube.com/results?search_query=yoga+emotional+eating',
    tags: ['瑜伽', '心理', '情绪', '冥想'],
    source: 'YouTube',
    category: '心理',
  },
  {
    id: 'yt_4',
    title: '正念饮食指南',
    description: '学习正念饮食技巧，更好地感知饥饿和饱腹感',
    type: 'tutorial',
    duration: '18:45',
    url: 'https://www.youtube.com/results?search_query=mindful+eating+guide',
    tags: ['正念', '饮食', '技巧', '饱腹感'],
    source: 'YouTube',
    category: '营养',
  },
  {
    id: 'yt_5',
    title: '健康早餐提案合集',
    description: '一周七天不重样的健康早餐灵感',
    type: 'tutorial',
    duration: '12:30',
    url: 'https://www.youtube.com/results?search_query=healthy+breakfast+ideas',
    tags: ['早餐', '食谱', '健康'],
    source: 'YouTube',
    category: '营养',
  },
  {
    id: 'yt_6',
    title: '暴食症康复：心理专家访谈',
    description: '心理咨询师分享暴食症康复的心理学原理和方法',
    type: 'interview',
    duration: '45:20',
    url: 'https://www.youtube.com/results?search_query=binge+eating+recovery+interview',
    tags: ['暴食症', '心理', '康复', '专家'],
    source: 'YouTube',
    category: '暴食症',
  },
  {
    id: 'yt_7',
    title: '减脂期如何正确吃碳水',
    description: '营养师教你如何在减脂期科学摄入碳水化合物',
    type: 'tutorial',
    duration: '15:00',
    url: 'https://www.youtube.com/results?search_query=carbs+for+fat+loss',
    tags: ['碳水', '减脂', '营养', '科学'],
    source: 'YouTube',
    category: '营养',
  },
  {
    id: 'yt_8',
    title: '蛋白质摄入完全指南',
    description: '减脂增肌必看：每天需要多少蛋白质？如何分配？',
    type: 'tutorial',
    duration: '22:10',
    url: 'https://www.youtube.com/results?search_query=protein+guide+fitness',
    tags: ['蛋白质', '营养', '健身'],
    source: 'YouTube',
    category: '营养',
  },

  // 播客
  {
    id: 'pod_1',
    title: '心理健身房：与食物和解',
    description: '探讨如何建立与食物的健康关系，摆脱节食心态',
    type: 'podcast',
    duration: '38:00',
    url: 'https://open.spotify.com/search/食物心理',
    tags: ['心理', '食物', '和解', '节食'],
    source: 'Spotify',
    category: '心理',
  },
  {
    id: 'pod_2',
    title: '营养科学：肠道菌群与食欲',
    description: '最新研究揭示肠道菌群如何影响我们的食欲和体重',
    type: 'podcast',
    duration: '42:30',
    url: 'https://open.spotify.com/search/肠道菌群',
    tags: ['科学', '肠道', '食欲', '研究'],
    source: 'Spotify',
    category: '科学',
  },
  {
    id: 'pod_3',
    title: '运动心理：坚持运动的内在动力',
    description: '如何找到持续运动的内在动力，而不是强迫自己',
    type: 'podcast',
    duration: '35:15',
    url: 'https://open.spotify.com/search/运动心理',
    tags: ['运动', '心理', '动力', '坚持'],
    source: 'Spotify',
    category: '心理',
  },
  {
    id: 'pod_4',
    title: '暴食症康复故事分享',
    description: '真实康复者讲述自己的戒暴经历和心路历程',
    type: 'podcast',
    duration: '55:00',
    url: 'https://open.spotify.com/search/暴食症康复',
    tags: ['暴食症', '康复', '故事', '分享'],
    source: 'Spotify',
    category: '暴食症',
  },

  // 暴食症相关访谈
  {
    id: 'int_1',
    title: '进食障碍治疗专家谈康复',
    description: '专业治疗师分享进食障碍的诊断标准和治疗方案',
    type: 'interview',
    duration: '52:00',
    url: 'https://www.youtube.com/results?search_query=eating+disorder+therapy',
    tags: ['暴食症', '治疗', '专家', '方案'],
    source: 'YouTube',
    category: '暴食症',
  },
  {
    id: 'int_2',
    title: '神经性贪食症患者自述',
    description: '患者视角讲述贪食症对生活的影响和寻求帮助的过程',
    type: 'interview',
    duration: '48:30',
    url: 'https://www.youtube.com/results?search_query=bulimia+story',
    tags: ['贪食症', '患者', '自述', '经历'],
    source: 'YouTube',
    category: '暴食症',
  },
  {
    id: 'int_3',
    title: '身材焦虑与自我接纳',
    description: '心理咨询师讨论身材焦虑的根源和如何建立自我接纳',
    type: 'interview',
    duration: '40:00',
    url: 'https://www.youtube.com/results?search_query=body+acceptance+therapy',
    tags: ['身材', '焦虑', '接纳', '心理'],
    source: 'YouTube',
    category: '心理',
  },

  // 健康教程
  {
    id: 'tut_1',
    title: '基础营养学：三大营养素',
    description: '深入了解碳水、蛋白质、脂肪对身体的作用',
    type: 'tutorial',
    duration: '30:00',
    url: 'https://www.youtube.com/results?search_query=macronutrients+explained',
    tags: ['营养', '基础', '三大营养素', '科普'],
    source: 'YouTube',
    category: '营养',
  },
  {
    id: 'tut_2',
    title: '睡眠与体重管理',
    description: '睡眠质量如何影响荷尔蒙和体重',
    type: 'tutorial',
    duration: '20:00',
    url: 'https://www.youtube.com/results?search_query=sleep+weight+management',
    tags: ['睡眠', '体重', '荷尔蒙', '健康'],
    source: 'YouTube',
    category: '科学',
  },
  {
    id: 'tut_3',
    title: '压力管理与健康饮食',
    description: '如何在压力下保持健康的饮食习惯',
    type: 'tutorial',
    duration: '25:00',
    url: 'https://www.youtube.com/results?search_query=stress+eating+management',
    tags: ['压力', '饮食', '管理', '心理'],
    source: 'YouTube',
    category: '心理',
  },
  {
    id: 'tut_4',
    title: '如何阅读食品营养标签',
    description: '手把手教你读懂超市食品标签，做出健康选择',
    type: 'tutorial',
    duration: '16:00',
    url: 'https://www.youtube.com/results?search_query=reading+nutrition+labels',
    tags: ['标签', '超市', '技巧', '科普'],
    source: 'YouTube',
    category: '营养',
  },
];

/**
 * 根据分类筛选资源
 */
export const getResourcesByCategory = (category: string): VideoResource[] => {
  if (category === 'All') return VIDEO_DATABASE;
  return VIDEO_DATABASE.filter(r => r.tags.includes(category));
};

/**
 * 根据类型筛选资源
 */
export const getResourcesByType = (type: string): VideoResource[] => {
  if (type === 'all') return VIDEO_DATABASE;
  return VIDEO_DATABASE.filter(r => r.type === type);
};

/**
 * 根据关键词搜索资源
 */
export const searchResources = (query: string): VideoResource[] => {
  const lowerQuery = query.toLowerCase();
  return VIDEO_DATABASE.filter(r => 
    r.title.toLowerCase().includes(lowerQuery) ||
    r.description.toLowerCase().includes(lowerQuery) ||
    r.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

/**
 * 获取所有标签
 */
export const getAllTags = (): string[] => {
  const tags = new Set<string>();
  VIDEO_DATABASE.forEach(r => r.tags.forEach(tag => tags.add(tag)));
  return Array.from(tags).sort();
};

/**
 * 获取所有分类
 */
export const getAllCategories = (): string[] => {
  const categories = new Set<string>();
  VIDEO_DATABASE.forEach(r => categories.add(r.category));
  return ['All', ...Array.from(categories)];
};

/**
 * 获取随机推荐
 */
export const getRecommendedResources = (count: number = 3): VideoResource[] => {
  const shuffled = [...VIDEO_DATABASE].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
