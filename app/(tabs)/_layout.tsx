import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constants/colors'

type IconName = React.ComponentProps<typeof Ionicons>['name']

function TabIcon({ name, color, size }: { name: IconName; color: string; size: number }): React.ReactElement {
  return <Ionicons name={name} size={size} color={color} />
}

export default function TabLayout(): React.ReactElement {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.muted,
        tabBarStyle: { borderTopColor: Colors.border, backgroundColor: Colors.surface },
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Câu hỏi',
          tabBarIcon: ({ color, size }) => <TabIcon name="help-circle-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="exams"
        options={{
          title: 'Đề thi',
          tabBarIcon: ({ color, size }) => <TabIcon name="document-text-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Thống kê',
          tabBarIcon: ({ color, size }) => <TabIcon name="bar-chart-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          title: 'Hướng dẫn',
          tabBarIcon: ({ color, size }) => <TabIcon name="book-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Lịch sử',
          tabBarIcon: ({ color, size }) => <TabIcon name="time-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  )
}
