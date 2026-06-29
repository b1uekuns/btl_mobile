import React from 'react'
import { Stack } from 'expo-router'

export default function StackLayout(): React.ReactElement {
  return (
    <Stack
      screenOptions={{
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: '#3b82f6' },
      }}
    >
      <Stack.Screen
        name="question-form"
        options={{ presentation: 'modal', title: 'Câu hỏi' }}
      />
      <Stack.Screen
        name="exam-detail"
        options={{ title: 'Chi tiết đề thi' }}
      />
      <Stack.Screen
        name="team"
        options={{ title: 'Thông tin nhóm' }}
      />
    </Stack>
  )
}
