import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Question } from '../types'
import { Colors } from '../constants/colors'
import DifficultyBadge from './DifficultyBadge'

interface Props {
  question: Question
  index?: number
  onPress?: () => void
  rightAction?: React.ReactNode
  showOptions?: boolean
}

export default function QuestionCard({
  question: q,
  index,
  onPress,
  rightAction,
  showOptions = false,
}: Props): React.ReactElement {
  const Wrapper = onPress ? TouchableOpacity : View

  return (
    <Wrapper style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {index !== undefined && (
            <Text style={styles.num}>Câu {index + 1}.</Text>
          )}
          <Text style={styles.content} numberOfLines={showOptions ? undefined : 2}>
            {q.content}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <DifficultyBadge difficulty={q.difficulty} size="sm" />
          {rightAction}
        </View>
      </View>

      <View style={styles.topicRow}>
        <Text style={styles.topic}>📂 {q.topic}</Text>
      </View>

      {showOptions && (
        <View style={styles.options}>
          {q.options.map((opt) => {
            const correct = opt.id === q.correctOptionId
            return (
              <View key={opt.id} style={[styles.optionRow, correct && styles.correctRow]}>
                <Text style={[styles.optionText, correct && styles.correctText]}>
                  {correct ? '✓ ' : '○ '}{opt.text}
                </Text>
              </View>
            )
          })}
        </View>
      )}
    </Wrapper>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  headerLeft: { flex: 1, flexDirection: 'row', gap: 4 },
  headerRight: { alignItems: 'flex-end', gap: 6 },
  num: { fontWeight: '700', color: Colors.primary, minWidth: 30 },
  content: { flex: 1, fontSize: 14, fontWeight: '500', color: Colors.text },
  topicRow: { marginTop: 6 },
  topic: { fontSize: 12, color: Colors.muted },
  options: { marginTop: 10, gap: 4 },
  optionRow: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6 },
  correctRow: { backgroundColor: Colors.successLight },
  optionText: { fontSize: 13, color: Colors.muted },
  correctText: { color: '#16a34a', fontWeight: '600' },
})
