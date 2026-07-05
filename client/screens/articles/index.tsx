/**
 * 阅读与资源页面
 * 包含学术论文 + YouTube/播客/教程视频
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { COLORS, SPACING } from '@/utils/theme';
import {
  VIDEO_DATABASE,
  getResourcesByCategory,
  getRecommendedResources,
  getAllCategories,
  VideoResource,
} from '@/utils/videoDatabase';
import { ARTICLES_DATABASE, filterArticlesByCategory } from '@/utils/articlesDatabase';

const CATEGORIES = ['All', '学术论文', '视频教程', '播客', '访谈'];

// 简化论文数据
const PAPERS = ARTICLES_DATABASE.slice(0, 6);

export default function ArticlesScreen() {
  const [activeTab, setActiveTab] = useState<'paper' | 'video'>('paper');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<VideoResource | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { width } = useWindowDimensions();

  // 根据Tab过滤内容
  const filteredItems = activeTab === 'paper' 
    ? PAPERS 
    : getResourcesByCategory(selectedCategory);

  const handleOpenLink = useCallback((url: string) => {
    Linking.openURL(url);
  }, []);

  const handleItemPress = useCallback((item: any) => {
    if (activeTab === 'video') {
      setSelectedItem(item);
      setModalVisible(true);
    } else {
      // 论文打开Google Scholar搜索
      const query = encodeURIComponent(item.title);
      Linking.openURL(`https://scholar.google.com/scholar?q=${query}`);
    }
  }, [activeTab]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'youtube': return 'youtube';
      case 'podcast': return 'headphones';
      case 'tutorial': return 'play-circle';
      case 'interview': return 'mic';
      default: return 'file-text';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'youtube': return '#FF0000';
      case 'podcast': return '#1DB954';
      case 'tutorial': return '#9146FF';
      case 'interview': return '#FF6B6B';
      default: return COLORS.textMuted;
    }
  };

  const renderVideoItem = (item: VideoResource) => (
    <TouchableOpacity
      key={item.id}
      style={styles.videoCard}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      {/* 缩略图区域 */}
      <View style={styles.thumbnail}>
        <View style={[styles.thumbnailPlaceholder, { backgroundColor: getTypeColor(item.type) + '20' }]}>
          <Feather name={getTypeIcon(item.type) as any} size={32} color={getTypeColor(item.type)} />
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
        <View style={styles.typeBadge}>
          <Text style={[styles.typeText, { color: getTypeColor(item.type) }]}>
            {item.source}
          </Text>
        </View>
      </View>

      {/* 内容 */}
      <View style={styles.videoContent}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.videoDesc} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.videoTags}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <Feather name="chevron-right" size={20} color={COLORS.textMuted} style={styles.arrow} />
    </TouchableOpacity>
  );

  const renderPaperItem = (item: any, index: number) => (
    <TouchableOpacity
      key={item.id || index}
      style={styles.paperCard}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.paperHeader}>
        <Text style={styles.paperCategory}>{item.category}</Text>
        <Text style={styles.paperYear}>{item.publishedDate}</Text>
      </View>
      <Text style={styles.paperTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.paperAuthors}>{item.authors}</Text>
      <Text style={styles.paperAbstract} numberOfLines={3}>
        {item.abstract}
      </Text>
      <View style={styles.paperFooter}>
        <Text style={styles.paperJournal}>{item.journal}</Text>
        <Feather name="external-link" size={16} color={COLORS.accent} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reading</Text>
        <Text style={styles.headerSubtitle}>学术文献 · 视频教程 · 播客访谈</Text>
      </View>

      {/* Tab切换 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'paper' && styles.tabActive]}
          onPress={() => setActiveTab('paper')}
        >
          <Text style={[styles.tabText, activeTab === 'paper' && styles.tabTextActive]}>
            学术论文
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'video' && styles.tabActive]}
          onPress={() => setActiveTab('video')}
        >
          <Text style={[styles.tabText, activeTab === 'video' && styles.tabTextActive]}>
            视频资源
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 视频分类筛选 */}
        {activeTab === 'video' && (
          <View style={styles.categoryContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* 今日推荐 */}
        {activeTab === 'video' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today&apos;s Picks</Text>
            {getRecommendedResources(2).map((item) => renderVideoItem(item as VideoResource))}
          </View>
        )}

        {/* 内容列表 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {activeTab === 'paper' ? 'Latest Research' : 'All Resources'}
          </Text>
          {activeTab === 'paper' 
            ? filteredItems.map((item, index) => renderPaperItem(item, index))
            : filteredItems.map((item) => renderVideoItem(item as VideoResource))
          }
        </View>
      </ScrollView>

      {/* 详情Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.modalClose}
              onPress={() => setModalVisible(false)}
            >
              <Feather name="x" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>

            {selectedItem && (
              <>
                <View style={[styles.modalThumbnail, { backgroundColor: getTypeColor(selectedItem.type) + '15' }]}>
                  <Feather name={getTypeIcon(selectedItem.type) as any} size={48} color={getTypeColor(selectedItem.type)} />
                </View>

                <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                <Text style={styles.modalMeta}>
                  {selectedItem.source} · {selectedItem.duration}
                </Text>
                
                <Text style={styles.modalDesc}>{selectedItem.description}</Text>

                <View style={styles.modalTags}>
                  {selectedItem.tags.map((tag, index) => (
                    <View key={index} style={styles.modalTag}>
                      <Text style={styles.modalTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.openButton}
                  onPress={() => {
                    setModalVisible(false);
                    handleOpenLink(selectedItem.url);
                  }}
                >
                  <Feather name="play-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.openButtonText}>在{selectedItem.source}中打开</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '200',
    color: COLORS.textPrimary,
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
    fontWeight: '300',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  tab: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.textPrimary,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '400',
  },
  tabTextActive: {
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
  },
  categoryContainer: {
    marginBottom: SPACING.md,
  },
  categoryScroll: {
    paddingRight: SPACING.lg,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: COLORS.textPrimary,
  },
  categoryText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '400',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: SPACING.md,
    letterSpacing: 1,
  },
  videoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  thumbnail: {
    height: 140,
    backgroundColor: '#F5F5F5',
    position: 'relative',
  },
  thumbnailPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
  },
  typeBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  videoContent: {
    padding: SPACING.md,
  },
  videoTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  videoDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
  videoTags: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  arrow: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -10,
  },
  paperCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  paperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paperCategory: {
    fontSize: 10,
    color: COLORS.accent,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  paperYear: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  paperTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textPrimary,
    lineHeight: 22,
    marginBottom: 6,
  },
  paperAuthors: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  paperAbstract: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  paperFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  paperJournal: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
    maxHeight: '80%',
  },
  modalClose: {
    position: 'absolute',
    right: SPACING.lg,
    top: SPACING.lg,
    zIndex: 1,
  },
  modalThumbnail: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.textPrimary,
    lineHeight: 28,
  },
  modalMeta: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 6,
  },
  modalDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginTop: SPACING.md,
  },
  modalTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.md,
  },
  modalTag: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  modalTagText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  openButton: {
    backgroundColor: COLORS.textPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: SPACING.lg,
  },
  openButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 8,
  },
});
