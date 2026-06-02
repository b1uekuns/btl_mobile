import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { DifficultyColors, DifficultyLabels } from '../constants/colors'

interface Props {
  difficulty: string
  size?: 'sm' | 'md'
}

export default function DifficultyBadge({ difficulty, size = 'md' }: Props): React.ReactElement {
  const palette = DifficultyColors[difficulty] ?? { bg: '#e2e8f0', text: '#475569' }
  const label = DifficultyLabels[difficulty] ?? difficulty
  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }, size === 'sm' && styles.sm]}>
      <Text style={[styles.text, { color: palette.text }, size === 'sm' && styles.textSm]}>
        {label}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  sm: { paddingHorizontal: 7, paddingVertical: 2 },
  text: { fontSize: 12, fontWeight: '600' },
  textSm: { fontSize: 11 },
})
