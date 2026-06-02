import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Colors } from '../constants/colors'

interface Props {
  icon?: string
  title: string
  subtitle?: string
}

export default function EmptyState({ icon = '📭', title, subtitle }: Props): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 24 },
  icon: { fontSize: 40, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '600', color: Colors.text, textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 13, color: Colors.muted, textAlign: 'center' },
})
