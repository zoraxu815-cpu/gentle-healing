import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import Toast from 'react-native-toast-message';
import { Provider } from '@/components/Provider';

import '../global.css';

LogBox.ignoreLogs([
  "TurboModuleRegistry.getEnforcing(...): 'RNMapsAirModule' could not be found",
]);

export default function RootLayout() {
  return (
    <Provider>
      <Stack
        screenOptions={{
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          headerShown: false
        }}
      >
        {/* 开屏动画页面 */}
        <Stack.Screen name="splash" options={{ title: "" }} />
        {/* Tab 导航 */}
        <Stack.Screen name="(tabs)" options={{ title: "" }} />
        {/* 其他页面 */}
        <Stack.Screen name="articles" options={{ title: "每日文献" }} />
        <Stack.Screen name="profile-setup" options={{ title: "身体信息" }} />
      </Stack>
      <Toast />
    </Provider>
  );
}
