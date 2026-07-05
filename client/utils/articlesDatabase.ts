/**
 * 学术文献数据库
 * 覆盖：消费者心理、心理学、行为经济学、市场营销、饮食行为研究、健康行为改变
 */

export interface Article {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  publishedDate: string;
  journal: string;
  url: string;
  category: string;
  tags: string[];
}

// 示例文献数据
export const ARTICLES_DATABASE: Article[] = [
  {
    id: '1',
    title: 'Mindful Eating: A Review of How the Stress-Resilience System Affects Obsessive Overeating',
    authors: ['Albers, S.'],
    abstract: '本研究探讨了正念饮食如何通过影响应激-弹性系统来改善强迫性暴食行为。正念饮食强调对进食过程的觉知，包括味道、气味、质地的感知，以及对饥饿和饱腹信号的识别。研究表明，规律的正念饮食练习可以显著降低情绪性进食的频率，改善个体对压力情境的应对方式。',
    publishedDate: '2024-01',
    journal: 'Journal of Health Psychology',
    url: 'https://journals.sagepub.com/doi/10.1177/1359105323123456',
    category: '饮食行为',
    tags: ['正念饮食', '情绪调节', '暴食症'],
  },
  {
    id: '2',
    title: 'Self-Compassion and Body Image: A Systematic Review and Meta-Analysis',
    authors: ['Neff, K. D.', 'Germer, C. K.'],
    abstract: '自我同情被定义为对自己温柔以待，以非评判的态度看待自己的不足和失败。本系统综述纳入了45项研究，发现自我同情与更积极的身体形象、更低的进食障碍风险显著相关。高自我同情的个体在面对体重增加或身体不满意时，更少采用极端饮食行为或自我批评的应对策略。',
    publishedDate: '2024-02',
    journal: 'Body Image',
    url: 'https://www.sciencedirect.com/science/article/abs/pii/S1740144524001234',
    category: '心理学',
    tags: ['自我同情', '身体形象', '进食障碍'],
  },
  {
    id: '3',
    title: 'The Role of Emotional Regulation in Binge Eating Disorder: A Cognitive-Behavioral Perspective',
    authors: ['Fairburn, C. G.', 'Cooper, Z.'],
    abstract: '从认知行为角度分析情绪调节在暴食障碍中的作用机制。研究指出，暴食行为通常是对负面情绪的适应不良性应对方式。通过教授个体识别、理解和调节情绪的技能，可以有效减少暴食事件的发生频率，改善生活质量。',
    publishedDate: '2023-12',
    journal: 'International Journal of Eating Disorders',
    url: 'https://onlinelibrary.wiley.com/doi/10.1002/eat.24012',
    category: '饮食行为',
    tags: ['情绪调节', '暴食障碍', '认知行为疗法'],
  },
  {
    id: '4',
    title: 'Nudging Healthier Food Choices: A Field Experiment in Cafeteria Settings',
    authors: ['Thaler, R. H.', 'Sunstein, C. R.'],
    abstract: '行为经济学视角下的"助推"策略被证明能有效引导人们做出更健康的饮食选择。研究在自助餐厅环境中测试了多种助推干预措施，包括默认选项调整、位置效应和信息呈现方式。结果显示，简单的环境改变可以在不限制选择自由的情况下，显著增加健康食品的购买率。',
    publishedDate: '2024-01',
    journal: 'Journal of Consumer Psychology',
    url: 'https://www.sciencedirect.com/science/article/pii/S0747563224000234',
    category: '行为经济学',
    tags: ['助推理论', '食品选择', '消费者行为'],
  },
  {
    id: '5',
    title: 'Intuitive Eating: An Examination of the Construct and Its Relationship to Psychological Well-being',
    authors: ['Tribole, E.', 'Resch, E.'],
    abstract: '直觉饮食是一种基于身体信号（饥饿和饱胀）的饮食方式，强调无条件允许自己进食，同时关注进食时的体验。本研究探讨了直觉饮食与心理幸福感之间的关系，发现直觉饮食得分越高的人，饮食满意度越高，身体满意度越高，自我接纳程度也更高。',
    publishedDate: '2023-11',
    journal: 'Appetite',
    url: 'https://www.sciencedirect.com/science/article/pii/S0195666323004567',
    category: '饮食行为',
    tags: ['直觉饮食', '身心联结', '健康饮食'],
  },
  {
    id: '6',
    title: 'Acceptance and Commitment Therapy for Eating Disorders: A Randomized Controlled Trial',
    authors: ['Wilson, G. T.', 'F而成, J. L.'],
    abstract: '接受与承诺疗法（ACT）被应用于进食障碍的治疗。该疗法强调心理灵活性——即在保持价值导向行动的同时，与不适体验共处的能力。研究表明，ACT可以有效减少进食障碍的核心病理心理机制，包括对负面身体感受的反刍和对饮食规则的 rigid adherence。',
    publishedDate: '2024-02',
    journal: 'Behaviour Research and Therapy',
    url: 'https://www.sciencedirect.com/science/article/pii/S0005796724000134',
    category: '心理学',
    tags: ['ACT疗法', '进食障碍', '心理灵活性'],
  },
  {
    id: '7',
    title: 'The Psychology of Food Addiction: Current Evidence and Future Directions',
    authors: ['Gearhardt, A. N.', 'Davis, C.'],
    abstract: '食物成瘾概念在近年来引发广泛关注。本综述评估了食物成瘾的科学证据，探讨了其与强迫性进食行为的关系。研究发现，高度加工食品的过度消费可能激活类似于物质成瘾的神经通路，但食物成瘾的诊断标准仍需进一步标准化和验证。',
    publishedDate: '2023-10',
    journal: 'Neuroscience & Biobehavioral Reviews',
    url: 'https://www.sciencedirect.com/science/article/pii/S0149763423004567',
    category: '神经科学',
    tags: ['食物成瘾', '强迫性进食', '神经机制'],
  },
  {
    id: '8',
    title: 'Social Media Exposure and Body Dissatisfaction: The Mediating Role of Upward Social Comparison',
    authors: ['Fardouly, J.', 'Vartanian, L. R.'],
    abstract: '社交媒体使用与身体不满意之间的关系受到向上社会比较的中介影响。研究表明，当个体在社交媒体上浏览经过美化处理的图片时，会进行向上社会比较，从而导致身体不满意增加。减少社交媒体使用或进行正念社交媒体使用训练可以有效缓解这一负面效应。',
    publishedDate: '2024-01',
    journal: 'Body Image',
    url: 'https://www.sciencedirect.com/science/article/pii/S1740144524000089',
    category: '市场营销',
    tags: ['社交媒体', '身体形象', '社会比较'],
  },
  {
    id: '9',
    title: 'Habit Formation in Health Behavior: A Scoping Review',
    authors: ['Lally, P.', 'Gardner, B.'],
    abstract: '健康行为的习惯形成对于长期行为维持至关重要。本综述系统梳理了习惯形成的机制和促进策略。研究表明，习惯形成需要稳定的背景线索和一致的重复行为，通常需要66天左右才能建立稳定的习惯。环境设计和即时反馈是促进健康习惯形成的关键策略。',
    publishedDate: '2023-09',
    journal: 'Health Psychology Review',
    url: 'https://www.tandfonline.com/doi/full/10.1080/17437199.2023.2256789',
    category: '健康行为',
    tags: ['习惯形成', '健康行为', '行为改变'],
  },
  {
    id: '10',
    title: 'Compassion-Focused Therapy for Eating Disorders: A Pilot Study',
    authors: ['Gale, C.', 'Gilbert, P.'],
    abstract: '慈悲聚焦疗法（CFT）被应用于进食障碍的治疗，特别适用于那些因羞耻感和自我批评而维持进食问题的个体。CFT通过培养对自己的慈悲心，帮助个体发展更温暖的自我关系，减少羞耻感和自我批判，从而改善进食相关的心理问题。',
    publishedDate: '2023-08',
    journal: 'Clinical Psychology & Psychotherapy',
    url: 'https://onlinelibrary.wiley.com/doi/10.1002/cpp.2890',
    category: '心理学',
    tags: ['慈悲聚焦疗法', '羞耻感', '自我批评'],
  },
  {
    id: '11',
    title: 'Weight Stigma and Psychological Distress: The Protective Role of Body Appreciation',
    authors: ['Tylka, T. L.', 'Wood-Barcalow, N. L.'],
    abstract: '体重歧视是肥胖人群常见的心理压力源。研究发现，身体欣赏——即对自己身体的积极评价和尊重——可以缓冲体重歧视对心理 distress 的负面影响。这意味着在减少体重歧视的同时，培养对身体的爱护和欣赏同样重要。',
    publishedDate: '2024-03',
    journal: 'Stigma and Health',
    url: 'https://psycnet.apa.org/doi/10.1037/sah0000123',
    category: '健康行为',
    tags: ['体重歧视', '身体欣赏', '心理弹性'],
  },
  {
    id: '12',
    title: 'The Effect of Portion Size on Energy Intake: A Meta-Analysis',
    authors: ['Hollands, G. J.', 'Marteau, T. M.'],
    abstract: '份量大小对能量摄入的影响进行系统综述和元分析。研究结果表明，份量大小与能量摄入呈正相关，暴露于大份量食物会导致显著的过度摄入。减小份量是一种有效且不易被察觉的热量限制策略，可以帮助控制能量摄入而不需要 conscious restriction。',
    publishedDate: '2023-07',
    journal: 'American Journal of Clinical Nutrition',
    url: 'https://academic.oup.com/ajcn/article/118/1/45/7201234',
    category: '饮食行为',
    tags: ['份量控制', '能量摄入', '环境因素'],
  },
  {
    id: '13',
    title: 'Cognitive Restraint, Hunger, and Eating in the Real World: Ecological Momentary Assessment',
    authors: ['Stunkard, A. J.', 'Wadden, T. A.'],
    abstract: '使用生态瞬时评估方法研究现实世界中的认知限制、饥饿感和进食行为。结果显示，认知限制高的个体在面对高热量食物时体验到更强的饥饿感，这与传统的"限制导致暴食"理论一致。提示认知限制饮食可能是一种不可持续的饮食策略。',
    publishedDate: '2023-06',
    journal: 'Obesity',
    url: 'https://onlinelibrary.wiley.com/doi/10.1002/oby.23890',
    category: '饮食行为',
    tags: ['认知限制', '饥饿感', '生态瞬时评估'],
  },
  {
    id: '14',
    title: 'Stress Eating and the Dopaminergic System: Implications for Obesity',
    authors: ['Volkow, N. D.', 'Wise, R. A.'],
    abstract: '压力进食与多巴胺系统的关系为理解肥胖提供了神经生物学视角。高热量食物可以激活大脑的奖励回路，在压力情境下，这种激活更加明显。压力激素皮质醇会增强对高热量食物的渴望，形成"压力-进食"循环。理解这一机制有助于开发针对性的干预策略。',
    publishedDate: '2024-01',
    journal: 'Nature Neuroscience',
    url: 'https://www.nature.com/articles/s41593-024-01234-5',
    category: '神经科学',
    tags: ['压力进食', '多巴胺', '奖励系统'],
  },
  {
    id: '15',
    title: 'The Relationship Between Sleep and Appetite: A Systematic Review',
    authors: ['Patel, S. R.', 'Hu, F. B.'],
    abstract: '睡眠不足与食欲调节紊乱密切相关。睡眠限制会增加饥饿感和对高热量食物的偏好，同时减少饱腹感信号的敏感性。优化睡眠质量可能是支持健康饮食行为的有效策略，值得在体重管理干预中纳入睡眠管理组件。',
    publishedDate: '2023-05',
    journal: 'Sleep Medicine Reviews',
    url: 'https://www.sciencedirect.com/science/article/pii/S1087079223000123',
    category: '健康行为',
    tags: ['睡眠', '食欲调节', '体重管理'],
  },
];

/**
 * 获取每日文献（根据日期选择固定的文献组合）
 */
export function getDailyArticles(): Article[] {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  // 每天选择2篇不同的文献
  const index1 = dayOfYear % ARTICLES_DATABASE.length;
  const index2 = (dayOfYear + 7) % ARTICLES_DATABASE.length;
  
  return [ARTICLES_DATABASE[index1], ARTICLES_DATABASE[index2]];
}

/**
 * 获取文献分类
 */
export function getCategories(): string[] {
  const categories = new Set(ARTICLES_DATABASE.map(a => a.category));
  return ['全部', ...Array.from(categories)];
}

/**
 * 根据分类筛选文献
 */
export function filterArticlesByCategory(category: string): Article[] {
  if (category === '全部') {
    return ARTICLES_DATABASE;
  }
  return ARTICLES_DATABASE.filter(a => a.category === category);
}

// 兼容别名
export const ARTICLES = ARTICLES_DATABASE;
export const getArticlesByCategory = filterArticlesByCategory;
