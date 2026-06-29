import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { AppProvider } from '../context/AppContext'
import React from 'react'
import { enableScreens } from 'react-native-screens'

// Bật native screen transitions — giúp push/pop animation mượt hơn
// bằng cách dùng native UIViewController (iOS) / Fragment (Android)
enableScreens(true)

export default function RootLayout(): React.ReactElement {
  return (
    <AppProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',   // tường minh: slide ngang chuẩn iOS/Android
          gestureEnabled: true,             // vuốt từ cạnh trái để back (iOS)
          animationDuration: 300,           // 300ms — cân bằng giữa nhanh và mượt
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen
          name="(stack)/question-form"
          options={{
            animation: 'slide_from_right',
            title: 'Câu hỏi',
            headerShown: true,
            headerTintColor: '#fff',
            headerStyle: { backgroundColor: '#3b82f6' },
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="(stack)/create-exam"
          options={{
            animation: 'slide_from_right',
            headerShown: true,
            title: 'Tạo đề thi mới',
            headerTintColor: '#fff',
            headerStyle: { backgroundColor: '#3b82f6' },
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="(stack)/question-bank"
          options={{
            animation: 'slide_from_right',
            headerShown: true,
            title: 'Ngân hàng câu hỏi',
            headerTintColor: '#fff',
            headerStyle: { backgroundColor: '#3b82f6' },
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="(stack)/exam-detail"
          options={{
            animation: 'slide_from_right',
            title: 'Chi tiết đề thi',
            headerShown: true,
            headerTintColor: '#fff',
            headerStyle: { backgroundColor: '#3b82f6' },
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="(stack)/team"
          options={{
            animation: 'slide_from_right',
            title: 'Thông tin nhóm',
            headerShown: true,
            headerTintColor: '#fff',
            headerStyle: { backgroundColor: '#3b82f6' },
            gestureEnabled: true,
          }}
        />
      </Stack>
    </AppProvider>
  )
}

