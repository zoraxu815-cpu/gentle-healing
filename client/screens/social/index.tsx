import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  Linking,
  TextInput,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, FONT_SIZES } from '../../utils/theme';

const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL || 'http://localhost:9091';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  streak: number;
  todayCompleted: boolean;
  totalCheckins: number;
}

interface CheckIn {
  id: string;
  userId: string;
  userName: string;
  type: 'food' | 'exercise' | 'weight';
  note: string;
  createdAt: string;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  type: 'streak' | 'milestone';
  requirement: number;
  icon: string;
  claimed: boolean;
}

export default function SocialScreen() {
  const [activeTab, setActiveTab] = useState<'friends' | 'rewards'>('friends');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  const loadData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (!storedUserId) {
        const newUserId = 'user_' + Date.now();
        await AsyncStorage.setItem('userId', newUserId);
        setUserId(newUserId);
      } else {
        setUserId(storedUserId);
      }

      // 模拟好友数据
      setFriends([
        { id: '1', name: '小明', avatar: 'A', streak: 7, todayCompleted: true, totalCheckins: 45 },
        { id: '2', name: '小红', avatar: 'B', streak: 14, todayCompleted: false, totalCheckins: 89 },
        { id: '3', name: '小华', avatar: 'C', streak: 3, todayCompleted: true, totalCheckins: 23 },
      ]);

      // 模拟打卡数据
      setCheckIns([
        { id: '1', userId: '1', userName: '小明', type: 'food', note: '今天吃得很健康', createdAt: new Date().toISOString() },
        { id: '2', userId: '2', userName: '小红', type: 'exercise', note: '跑了3公里', createdAt: new Date().toISOString() },
        { id: '3', userId: '1', userName: '小明', type: 'weight', note: '早起称重', createdAt: new Date(Date.now() - 86400000).toISOString() },
      ]);

      // 激励奖励
      setRewards([
        { id: '1', title: '初次打卡', description: '完成你的第一次打卡', type: 'milestone', requirement: 1, icon: 'award', claimed: true },
        { id: '2', title: '连续3天', description: '连续打卡3天', type: 'streak', requirement: 3, icon: 'zap', claimed: true },
        { id: '3', title: '连续7天', description: '连续打卡7天', type: 'streak', requirement: 7, icon: 'fire', claimed: false },
        { id: '4', title: '连续14天', description: '连续打卡14天', type: 'streak', requirement: 14, icon: 'star', claimed: false },
        { id: '5', title: '连续30天', description: '连续打卡30天', type: 'streak', requirement: 30, icon: 'crown', claimed: false },
        { id: '6', title: '打卡满50次', description: '累计打卡50次', type: 'milestone', requirement: 50, icon: 'target', claimed: false },
      ]);
    } catch (error) {
      console.error('Error loading social data:', error);
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

  const handleCheckIn = async (type: 'food' | 'exercise' | 'weight') => {
    try {
      Alert.alert(
        '确认打卡',
        `确定要记录今日${type === 'food' ? '饮食' : type === 'exercise' ? '运动' : '体重'}吗？`,
        [
          { text: '取消', style: 'cancel' },
          {
            text: '确认',
            onPress: async () => {
              Alert.alert('打卡成功', '你的打卡已同步给好友');
              await loadData();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error creating checkin:', error);
    }
  };

  const handleInvite = async () => {
    const code = 'HEALTH_' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setInviteCode(code);
    setInviteModalVisible(true);
  };

  const handleShareInvite = async () => {
    try {
      await Linking.openURL(`mailto:?subject=邀请你加入健康打卡&body=使用我的邀请码 ${inviteCode} 加入我们一起健康打卡吧！`);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'food': return 'coffee';
      case 'exercise': return 'activity';
      case 'weight': return 'trending-up';
      default: return 'check';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'food': return '饮食';
      case 'exercise': return '运动';
      case 'weight': return '体重';
      default: return '打卡';
    }
  };

  const todayCheckins = checkIns.filter(c => {
    const checkDate = new Date(c.createdAt).toDateString();
    const today = new Date().toDateString();
    return checkDate === today;
  });

  const myTodayCompleted = friends.some(f => f.id === '1' && f.todayCompleted) || todayCheckins.length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header */}
      <View style={{ paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl, paddingBottom: SPACING.md }}>
        <Text style={{ fontSize: FONT_SIZES.xxxl, fontWeight: '300', color: COLORS.textPrimary, letterSpacing: 2 }}>
          SOCIAL
        </Text>
        <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: SPACING.xs }}>
          与好友一起，互相监督，共同进步
        </Text>
      </View>

      {/* Tab Switcher */}
      <View style={{ paddingHorizontal: SPACING.lg, marginBottom: SPACING.md }}>
        <View style={{ flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 8, padding: 4 }}>
          <TouchableOpacity
            style={{ flex: 1, paddingVertical: SPACING.sm, alignItems: 'center', backgroundColor: activeTab === 'friends' ? COLORS.textPrimary : 'transparent', borderRadius: 6 }}
            onPress={() => setActiveTab('friends')}
          >
            <Text style={{ fontSize: FONT_SIZES.sm, color: activeTab === 'friends' ? COLORS.background : COLORS.textSecondary, fontWeight: '500' }}>
              好友
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, paddingVertical: SPACING.sm, alignItems: 'center', backgroundColor: activeTab === 'rewards' ? COLORS.textPrimary : 'transparent', borderRadius: 6 }}
            onPress={() => setActiveTab('rewards')}
          >
            <Text style={{ fontSize: FONT_SIZES.sm, color: activeTab === 'rewards' ? COLORS.background : COLORS.textSecondary, fontWeight: '500' }}>
              激励
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.textSecondary} />}
      >
        {activeTab === 'friends' ? (
          <>
            {/* My Check-in Card */}
            <View style={{ marginHorizontal: SPACING.lg, marginBottom: SPACING.lg }}>
              <View style={{ backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.lg }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md }}>
                  <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.textPrimary }}>
                    今日打卡
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: myTodayCompleted ? COLORS.success : COLORS.textMuted, marginRight: 6 }} />
                    <Text style={{ fontSize: FONT_SIZES.sm, color: myTodayCompleted ? COLORS.success : COLORS.textMuted }}>
                      {myTodayCompleted ? '已完成' : '未完成'}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: myTodayCompleted ? COLORS.background : COLORS.textPrimary, borderRadius: 8, padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}
                    onPress={() => handleCheckIn('food')}
                  >
                    <Feather name="coffee" size={20} color={myTodayCompleted ? COLORS.textMuted : COLORS.background} />
                    <Text style={{ fontSize: FONT_SIZES.xs, color: myTodayCompleted ? COLORS.textMuted : COLORS.background, marginTop: 4 }}>饮食</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: myTodayCompleted ? COLORS.background : COLORS.textPrimary, borderRadius: 8, padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}
                    onPress={() => handleCheckIn('exercise')}
                  >
                    <Feather name="activity" size={20} color={myTodayCompleted ? COLORS.textMuted : COLORS.background} />
                    <Text style={{ fontSize: FONT_SIZES.xs, color: myTodayCompleted ? COLORS.textMuted : COLORS.background, marginTop: 4 }}>运动</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: myTodayCompleted ? COLORS.background : COLORS.textPrimary, borderRadius: 8, padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}
                    onPress={() => handleCheckIn('weight')}
                  >
                    <Feather name="trending-up" size={20} color={myTodayCompleted ? COLORS.textMuted : COLORS.background} />
                    <Text style={{ fontSize: FONT_SIZES.xs, color: myTodayCompleted ? COLORS.textMuted : COLORS.background, marginTop: 4 }}>体重</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Friends List */}
            <View style={{ paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg }}>
              <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.textPrimary, marginBottom: SPACING.md }}>
                好友动态
              </Text>
              {friends.map(friend => (
                <View key={friend.id} style={{ backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.sm }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md }}>
                      <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.textPrimary }}>{friend.avatar}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.textPrimary }}>{friend.name}</Text>
                        <View style={{ marginLeft: SPACING.sm, flexDirection: 'row', alignItems: 'center', backgroundColor: friend.streak >= 7 ? COLORS.success + '20' : COLORS.accent + '20', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
                          <Feather name="zap" size={12} color={friend.streak >= 7 ? COLORS.success : COLORS.accent} />
                          <Text style={{ fontSize: FONT_SIZES.xs, color: friend.streak >= 7 ? COLORS.success : COLORS.accent, marginLeft: 2 }}>{friend.streak}天</Text>
                        </View>
                      </View>
                      <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 }}>
                        累计 {friend.totalCheckins} 次打卡 · {friend.todayCompleted ? '今日已完成' : '今日未打卡'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Recent Activity */}
            <View style={{ paddingHorizontal: SPACING.lg }}>
              <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.textPrimary, marginBottom: SPACING.md }}>
                最近动态
              </Text>
              {todayCheckins.length > 0 ? todayCheckins.map(checkin => (
                <View key={checkin.id} style={{ backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.sm }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm }}>
                      <Feather name={getIconForType(checkin.type) as any} size={16} color={COLORS.textPrimary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: FONT_SIZES.sm, fontWeight: '600', color: COLORS.textPrimary }}>{checkin.userName}</Text>
                      <Text style={{ fontSize: FONT_SIZES.xs, color: COLORS.textSecondary }}>{getTypeLabel(checkin.type)} · {checkin.note}</Text>
                    </View>
                    <Text style={{ fontSize: FONT_SIZES.xs, color: COLORS.textMuted }}>
                      {new Date(checkin.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>
              )) : (
                <View style={{ backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.xl, alignItems: 'center' }}>
                  <Feather name="users" size={32} color={COLORS.textMuted} />
                  <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: SPACING.sm }}>
                    暂无打卡动态
                  </Text>
                </View>
              )}
            </View>

            {/* Invite Button */}
            <View style={{ paddingHorizontal: SPACING.lg, marginTop: SPACING.xl }}>
              <TouchableOpacity
                style={{ backgroundColor: COLORS.textPrimary, borderRadius: 8, padding: SPACING.md, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
                onPress={handleInvite}
              >
                <Feather name="user-plus" size={18} color={COLORS.background} />
                <Text style={{ fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.background, marginLeft: SPACING.sm }}>
                  邀请好友加入
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Rewards Header */}
            <View style={{ paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg }}>
              <View style={{ backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.lg }}>
                <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.textPrimary }}>
                  你的成就
                </Text>
                <View style={{ flexDirection: 'row', marginTop: SPACING.md }}>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: FONT_SIZES.xxl, fontWeight: '600', color: COLORS.textPrimary }}>
                      {rewards.filter(r => r.claimed).length}
                    </Text>
                    <Text style={{ fontSize: FONT_SIZES.xs, color: COLORS.textSecondary }}>已获得</Text>
                  </View>
                  <View style={{ width: 1, backgroundColor: COLORS.border }} />
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: FONT_SIZES.xxl, fontWeight: '600', color: COLORS.textPrimary }}>
                      {rewards.filter(r => !r.claimed).length}
                    </Text>
                    <Text style={{ fontSize: FONT_SIZES.xs, color: COLORS.textSecondary }}>可领取</Text>
                  </View>
                  <View style={{ width: 1, backgroundColor: COLORS.border }} />
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ fontSize: FONT_SIZES.xxl, fontWeight: '600', color: COLORS.textPrimary }}>
                      {Math.max(...friends.map(f => f.streak), 0)}
                    </Text>
                    <Text style={{ fontSize: FONT_SIZES.xs, color: COLORS.textSecondary }}>最长连续</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Rewards List */}
            <View style={{ paddingHorizontal: SPACING.lg }}>
              <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.textPrimary, marginBottom: SPACING.md }}>
                激励奖励
              </Text>
              {rewards.map(reward => (
                <View key={reward.id} style={{ backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.sm }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: reward.claimed ? COLORS.success + '20' : COLORS.background, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md }}>
                      <Feather name={reward.icon as any} size={24} color={reward.claimed ? COLORS.success : COLORS.textMuted} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: FONT_SIZES.md, fontWeight: '600', color: reward.claimed ? COLORS.textPrimary : COLORS.textSecondary }}>
                          {reward.title}
                        </Text>
                        {reward.claimed && (
                          <View style={{ marginLeft: SPACING.sm, backgroundColor: COLORS.success + '20', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
                            <Text style={{ fontSize: FONT_SIZES.xs, color: COLORS.success }}>已获得</Text>
                          </View>
                        )}
                      </View>
                      <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 }}>
                        {reward.description}
                      </Text>
                    </View>
                    {!reward.claimed && (
                      <TouchableOpacity
                        style={{ backgroundColor: COLORS.textMuted + '30', borderRadius: 6, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm }}
                        onPress={() => Alert.alert('提示', `需要${reward.requirement}天连续打卡才能获得此奖励`)}
                      >
                        <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary }}>
                          {reward.type === 'streak' ? `${reward.requirement}天` : `${reward.requirement}次`}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>

            {/* Encouragement */}
            <View style={{ paddingHorizontal: SPACING.lg, marginTop: SPACING.xl }}>
              <View style={{ backgroundColor: COLORS.accent + '15', borderRadius: 12, padding: SPACING.lg, borderLeftWidth: 3, borderLeftColor: COLORS.accent }}>
                <Text style={{ fontSize: FONT_SIZES.md, fontWeight: '500', color: COLORS.textPrimary }}>
                  每一步都是进步
                </Text>
                <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: SPACING.xs }}>
                  和好友一起互相监督，让健康成为习惯。连续打卡不仅是数字，更是对自己的承诺。
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Invite Modal */}
      <Modal
        visible={inviteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInviteModalVisible(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: SPACING.lg }}
          activeOpacity={1}
          onPress={() => setInviteModalVisible(false)}
        >
          <View style={{ backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.xl, width: '100%', maxWidth: 340 }}>
            <View style={{ alignItems: 'center', marginBottom: SPACING.lg }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.accent + '20', justifyContent: 'center', alignItems: 'center' }}>
                <Feather name="users" size={32} color={COLORS.accent} />
              </View>
              <Text style={{ fontSize: FONT_SIZES.xl, fontWeight: '600', color: COLORS.textPrimary, marginTop: SPACING.md }}>
                邀请好友
              </Text>
              <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.xs }}>
                分享你的邀请码，好友加入后可互相监督打卡
              </Text>
            </View>
            <View style={{ backgroundColor: COLORS.background, borderRadius: 8, padding: SPACING.md, alignItems: 'center', marginBottom: SPACING.lg }}>
              <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.textPrimary, letterSpacing: 2 }}>
                {inviteCode}
              </Text>
            </View>
            <TouchableOpacity
              style={{ backgroundColor: COLORS.textPrimary, borderRadius: 8, padding: SPACING.md, alignItems: 'center' }}
              onPress={handleShareInvite}
            >
              <Text style={{ fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.background }}>
                分享邀请链接
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
