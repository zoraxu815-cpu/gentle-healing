import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 9091;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ============ Health Check ============
app.get('/api/v1/health', (req, res) => {
  console.log('Health check success');
  res.status(200).json({ status: 'ok' });
});

// ============ In-Memory Data Store (Demo) ============
// In production, use a real database

interface User {
  id: string;
  name: string;
  avatar?: string;
  streak: number; // 连续打卡天数
  totalCheckins: number;
  badges: string[];
  createdAt: string;
}

interface CheckIn {
  id: string;
  odId: string;
  odUserId: string;
  type: 'food' | 'exercise' | 'weight';
  note?: string;
  timestamp: string;
}

interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

interface Reward {
  id: string;
  odUserId: string;
  odType: string;
  odName: string;
  odDescription: string;
  odUnlockedAt?: string;
  odProgress: number;
  odTarget: number;
  odIcon: string;
}

// Demo users
const users: Record<string, User> = {
  'user_1': {
    id: 'user_1',
    name: '我',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    streak: 7,
    totalCheckins: 45,
    badges: ['early_bird', 'streak_7', 'food_logger'],
    createdAt: '2024-01-01'
  }
};

// Demo friends (accepted)
const friends: Record<string, string[]> = {
  'user_1': ['user_2', 'user_3']
};

// Demo pending requests
const friendRequests: FriendRequest[] = [];

// Demo rewards
const rewards: Reward[] = [
  {
    id: 'reward_1',
    odUserId: 'user_1',
    odType: 'streak',
    odName: '连续7天打卡',
    odDescription: '坚持一周，给自己点赞',
    odUnlockedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    odProgress: 7,
    odTarget: 7,
    odIcon: 'flame'
  },
  {
    id: 'reward_2',
    odUserId: 'user_1',
    odType: 'streak',
    odName: '连续30天打卡',
    odDescription: '一个月坚持，你已经超越了大多数',
    odProgress: 7,
    odTarget: 30,
    odIcon: 'trophy'
  },
  {
    id: 'reward_3',
    odUserId: 'user_1',
    odType: 'meals',
    odName: '记录100餐',
    odDescription: '每一餐都是进步',
    odProgress: 45,
    odTarget: 100,
    odIcon: 'utensils'
  },
  {
    id: 'reward_4',
    odUserId: 'user_1',
    odType: 'exercise',
    odName: '运动10次',
    odDescription: '让身体动起来',
    odProgress: 5,
    odTarget: 10,
    odIcon: 'activity'
  },
  {
    id: 'reward_5',
    odUserId: 'user_1',
    odType: 'social',
    odName: '邀请3位好友',
    odDescription: '一起走得更远',
    odProgress: 2,
    odTarget: 3,
    odIcon: 'users'
  }
];

// Demo check-ins
const checkins: CheckIn[] = [
  {
    id: 'checkin_1',
    odId: 'checkin_1',
    odUserId: 'user_2',
    odType: 'food',
    note: '今天吃得很好！',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'checkin_2',
    odUserId: 'user_2',
    odType: 'exercise',
    note: '晨跑30分钟',
    timestamp: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'checkin_3',
    odUserId: 'user_3',
    odType: 'food',
    note: '健康的一餐',
    timestamp: new Date(Date.now() - 10800000).toISOString()
  }
];

// ============ User Profile API ============
app.get('/api/v1/user/profile', (req, res) => {
  const userId = req.query.userId as string || 'user_1';
  const user = users[userId];
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

// ============ Friends API ============
app.get('/api/v1/friends', (req, res) => {
  const userId = req.query.userId as string || 'user_1';
  const friendIds = friends[userId] || [];
  
  const friendList = friendIds.map(id => {
    const friend = users[id];
    if (!friend) return null;
    
    // Get friend's recent check-ins
    const recentCheckins = checkins
      .filter(c => c.odUserId === id)
      .slice(0, 3)
      .map(c => ({
        ...c,
        timeAgo: getTimeAgo(c.timestamp)
      }));
    
    return {
      ...friend,
      recentCheckins
    };
  }).filter(Boolean);
  
  res.json(friendList);
});

app.get('/api/v1/friends/requests', (req, res) => {
  const userId = req.query.userId as string || 'user_1';
  const pendingRequests = friendRequests.filter(r => r.odToUserId === userId && r.status === 'pending');
  res.json(pendingRequests);
});

app.post('/api/v1/friends/request', (req, res) => {
  const { fromUserId, toUserId, fromUserName } = req.body;
  
  const request: FriendRequest = {
    id: `request_${Date.now()}`,
    fromUserId,
    fromUserName,
    toUserId,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  friendRequests.push(request);
  res.json(request);
});

app.post('/api/v1/friends/accept', (req, res) => {
  const { requestId } = req.body;
  const request = friendRequests.find(r => r.id === requestId);
  
  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }
  
  request.status = 'accepted';
  
  // Add to friends list
  if (!friends[request.odToUserId]) friends[request.odToUserId] = [];
  if (!friends[request.fromUserId]) friends[request.fromUserId] = [];
  
  if (!friends[request.odToUserId].includes(request.fromUserId)) {
    friends[request.odToUserId].push(request.fromUserId);
  }
  if (!friends[request.fromUserId].includes(request.odToUserId)) {
    friends[request.fromUserId].push(request.odToUserId);
  }
  
  res.json(request);
});

app.post('/api/v1/friends/reject', (req, res) => {
  const { requestId } = req.body;
  const request = friendRequests.find(r => r.id === requestId);
  
  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }
  
  request.status = 'rejected';
  res.json(request);
});

// ============ Check-in API ============
app.get('/api/v1/checkins', (req, res) => {
  const userId = req.query.userId as string;
  const friendIds = userId ? friends[userId] || [] : Object.keys(users);
  
  const allCheckins = checkins
    .filter(c => friendIds.includes(c.odUserId) || !userId)
    .map(c => {
      const user = users[c.odUserId];
      return {
        ...c,
        userName: user?.name || 'Unknown',
        userAvatar: user?.avatar,
        timeAgo: getTimeAgo(c.timestamp)
      };
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  res.json(allCheckins);
});

app.post('/api/v1/checkins', (req, res) => {
  const { userId, type, note } = req.body;
  
  const checkin: CheckIn = {
    id: `checkin_${Date.now()}`,
    odId: `checkin_${Date.now()}`,
    odUserId: userId || 'user_1',
    odType: type,
    note,
    timestamp: new Date().toISOString()
  };
  
  checkins.push(checkin);
  
  // Update user stats
  const user = users[checkin.odUserId];
  if (user) {
    user.totalCheckins += 1;
    user.streak += 1;
    
    // Check for new badges
    if (user.totalCheckins >= 10 && !user.badges.includes('food_logger')) {
      user.badges.push('food_logger');
    }
  }
  
  res.json(checkin);
});

// ============ Rewards API ============
app.get('/api/v1/rewards', (req, res) => {
  const userId = req.query.userId as string || 'user_1';
  
  const userRewards = rewards.filter(r => r.odUserId === userId);
  
  // Calculate progress percentage
  const rewardsWithProgress = userRewards.map(r => ({
    ...r,
    percentage: Math.min(100, Math.round((r.odProgress / r.odTarget) * 100)),
    isCompleted: r.odProgress >= r.odTarget
  }));
  
  res.json(rewardsWithProgress);
});

app.get('/api/v1/rewards/unlocked', (req, res) => {
  const userId = req.query.userId as string || 'user_1';
  
  const unlockedRewards = rewards.filter(r => 
    r.odUserId === userId && r.odUnlockedAt
  );
  
  res.json(unlockedRewards);
});

// ============ Leaderboard API ============
app.get('/api/v1/leaderboard', (req, res) => {
  const allUsers = Object.values(users).map(u => ({
    id: u.id,
    name: u.name,
    avatar: u.avatar,
    streak: u.streak,
    totalCheckins: u.totalCheckins
  }));
  
  // Sort by streak
  allUsers.sort((a, b) => b.streak - a.streak);
  
  res.json(allUsers);
});

// ============ Helper Functions ============
function getTimeAgo(timestamp: string): string {
  const now = Date.now();
  const time = new Date(timestamp).getTime();
  const diff = now - time;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  return `${days}天前`;
}

// ============ Static Files (Production) ============
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from client/dist
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

// ============ Start Server ============
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}/`);
});
