/**
 * 电影风开屏动画
 * 8秒沉浸式电影感启动动画
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { COLORS } from '@/utils/theme';

const { width, height } = Dimensions.get('window');

// 电影风格语录
const MOVIE_QUOTES = [
  { text: '"The secret of getting ahead is getting started."', movie: '— Mark Twain' },
  { text: '"Take care of your body. It\'s the only place you have to live."', movie: '— Jim Rohn' },
  { text: '"Health is not a destination. It\'s a way of living."', movie: '— Anonymous' },
  { text: '"The body achieves what the mind believes."', movie: '— Napoleon Hill' },
  { text: '"Your body hears everything your mind says. Stay positive."', movie: '— Anonymous' },
];

// 阳光渐变色系
const SUNRISE_GRADIENTS = [
  ['#FF6B6B', '#FFA07A', '#FFD93D'],
  ['#667EEA', '#764BA2', '#F093FB'],
  ['#4FACFE', '#00F2FE', '#43E97B'],
  ['#FA709A', '#FEE140', '#FA709A'],
  ['#30CFD0', '#330867'],
];

export default function SplashScreen() {
  // 选择语录
  const quoteIndex = 0;
  const quote = MOVIE_QUOTES[quoteIndex];
  const gradient = SUNRISE_GRADIENTS[0];
  
  // 动画值
  const sunScale = useSharedValue(0);
  const sunOpacity = useSharedValue(0);
  const line1Opacity = useSharedValue(0);
  const line2Opacity = useSharedValue(0);
  const quoteOpacity = useSharedValue(0);
  const quoteTranslateY = useSharedValue(30);
  const movieOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const overlayOpacity = useSharedValue(1);
  const glowScale = useSharedValue(1);

  useEffect(() => {
    // 太阳升起动画 (0-2s)
    sunOpacity.value = withDelay(300, withTiming(1, { duration: 1200, easing: Easing.out(Easing.cubic) }));
    sunScale.value = withDelay(300, withTiming(1, { duration: 1500, easing: Easing.out(Easing.cubic) }));

    // 光晕脉冲动画
    glowScale.value = withDelay(1500, withSequence(
      withTiming(1.2, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
    ));

    // 上线条 (1.5s)
    line1Opacity.value = withDelay(1500, withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }));

    // 语录文字 (2.5s)
    quoteOpacity.value = withDelay(2500, withTiming(1, { duration: 1000, easing: Easing.out(Easing.cubic) }));
    quoteTranslateY.value = withDelay(2500, withTiming(0, { duration: 1000, easing: Easing.out(Easing.cubic) }));

    // 电影来源 (3.5s)
    movieOpacity.value = withDelay(3500, withTiming(1, { duration: 800 }));

    // 下方内容 (5s)
    contentOpacity.value = withDelay(5000, withTiming(1, { duration: 1000 }));

    // 淡出并跳转 (7s)
    overlayOpacity.value = withDelay(7000, withTiming(0, { duration: 1000 }));
    
    const timeout = setTimeout(() => {
      router.replace('/(tabs)');
    }, 8000);

    return () => clearTimeout(timeout);
  }, []);

  // 太阳动画
  const sunStyle = useAnimatedStyle(() => ({
    opacity: sunOpacity.value,
    transform: [
      { scale: sunScale.value * sunScale.value },
    ],
  }));

  // 光晕动画
  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(sunOpacity.value, [0, 1], [0, 0.3]),
    transform: [{ scale: glowScale.value }],
  }));

  // 上线条动画
  const line1Style = useAnimatedStyle(() => ({
    opacity: line1Opacity.value,
  }));

  // 语录动画
  const quoteStyle = useAnimatedStyle(() => ({
    opacity: quoteOpacity.value,
    transform: [{ translateY: quoteTranslateY.value }],
  }));

  // 电影来源动画
  const movieStyle = useAnimatedStyle(() => ({
    opacity: movieOpacity.value,
  }));

  // 内容动画
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  // 屏幕动画
  const screenStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, screenStyle]}>
      <StatusBar barStyle="light-content" />
      
      {/* 背景渐变 */}
      <LinearGradient
        colors={gradient as any}
        style={styles.background}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
      />

      {/* 太阳光晕 */}
      <Animated.View style={[styles.sunGlow, glowStyle]}>
        <View style={styles.sunGlowInner} />
      </Animated.View>

      {/* 太阳 */}
      <Animated.View style={[styles.sunContainer, sunStyle]}>
        <View style={styles.sun}>
          <View style={styles.sunInner} />
        </View>
      </Animated.View>

      {/* 内容层 */}
      <View style={styles.content}>
        {/* 上线条 */}
        <Animated.View style={[styles.topLine, line1Style]}>
          <View style={styles.line} />
          <Text style={styles.topLabel}>BALANCE</Text>
          <View style={styles.line} />
        </Animated.View>

        {/* 语录区域 */}
        <View style={styles.quoteContainer}>
          <Animated.Text style={[styles.quote, quoteStyle]}>
            {quote.text}
          </Animated.Text>
          <Animated.Text style={[styles.movie, movieStyle]}>
            {quote.movie}
          </Animated.Text>
        </View>

        {/* 品牌 */}
        <Animated.View style={[styles.brandContainer, contentStyle]}>
          <View style={styles.brandLine} />
          <Text style={styles.brandText}>MINDFUL</Text>
          <Text style={styles.brandSubtext}>EATING</Text>
          <View style={styles.brandLine} />
        </Animated.View>

        {/* 底部 */}
        <Animated.View style={[styles.bottomContainer, contentStyle]}>
          <Text style={styles.versionText}>v1.0</Text>
        </Animated.View>
      </View>

      {/* 底部渐变遮罩 */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.4)'] as any}
        style={styles.bottomGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  sunGlow: {
    position: 'absolute',
    bottom: height * 0.35,
    alignSelf: 'center',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width,
    backgroundColor: 'rgba(255, 200, 100, 0.3)',
  },
  sunGlowInner: {
    width: '100%',
    height: '100%',
    borderRadius: width,
  },
  sunContainer: {
    position: 'absolute',
    bottom: height * 0.3,
    alignSelf: 'center',
    width: 120,
    height: 120,
  },
  sun: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    backgroundColor: '#FFD700',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 10,
  },
  sunInner: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    backgroundColor: '#FFF5E0',
    opacity: 0.6,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: height * 0.15,
    paddingBottom: height * 0.08,
    paddingHorizontal: 32,
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  topLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '300',
    letterSpacing: 8,
    marginHorizontal: 16,
  },
  quoteContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  quote: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '300',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 34,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  movie: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '300',
    marginTop: 20,
    letterSpacing: 2,
  },
  brandContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  brandLine: {
    width: 60,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginVertical: 12,
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '200',
    letterSpacing: 12,
  },
  brandSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '300',
    letterSpacing: 6,
    marginTop: 4,
  },
  bottomContainer: {
    alignItems: 'center',
  },
  versionText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '300',
    letterSpacing: 2,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.3,
  },
});
