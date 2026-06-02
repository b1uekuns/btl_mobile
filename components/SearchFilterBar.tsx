import React from 'react'
import { View, TextInput, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Colors } from '../constants/colors'

const DIFFICULTIES = [
  { value: '', label: 'Tất cả' },
  { value: 'easy', label: 'Dễ' },
  { value: 'medium', label: 'TB' },
  { value: 'hard', label: 'Khó' },
]

interface Props {
  topic: string
  difficulty: string
  onTopicChange: (v: string) => void
  onDifficultyChange: (v: string) => void
}

export default function SearchFilterBar({ topic, difficulty, onTopicChange, onDifficultyChange }: Props): React.ReactElement {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="🔍  Tìm theo chủ đề..."
        placeholderTextColor={Colors.muted}
        value={topic}
        onChangeText={onTopicChange}
        clearButtonMode="while-editing"
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        {DIFFICULTIES.map((d) => (
          <TouchableOpacity
            key={d.value}
            style={[styles.chip, difficulty === d.value && styles.chipActive]}
            onPress={() => onDifficultyChange(d.value)}
          >
            <Text style={[styles.chipText, difficulty === d.value && styles.chipTextActive]}>
              {d.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.surface, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  input: { backgroundColor: Colors.bg, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, color: Colors.text, marginBottom: 8 },
  chips: { flexDirection: 'row' },
  chip: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, backgroundColor: Colors.bg, marginRight: 8, borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.muted, fontWeight: '500' },
  chipTextActive: { color: '#fff' },
})
