import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { AppProvider } from '../context/AppContext'

export default function RootLayout(): React.ReactElement {
  return (
    <AppProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(stack)/question-form"
          options={{ presentation: 'modal', title: 'Câu hỏi', headerShown: true, headerTintColor: '#fff', headerStyle: { backgroundColor: '#3b82f6' } }}
        />
        <Stack.Screen
          name="(stack)/exam-detail"
          options={{ title: 'Chi tiết đề thi', headerShown: true, headerTintColor: '#fff', headerStyle: { backgroundColor: '#3b82f6' } }}
        />
        <Stack.Screen
          name="(stack)/team"
          options={{ title: 'Thông tin nhóm', headerShown: true, headerTintColor: '#fff', headerStyle: { backgroundColor: '#3b82f6' } }}
        />
      </Stack>
    </AppProvider>
  )
}

import React from 'react'
