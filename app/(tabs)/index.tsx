/**
 * Màn hình 1 – Ngân hàng câu hỏi (Person 1)
 * Chức năng: Xem, tìm kiếm, thêm, sửa, xóa câu hỏi
 */
import React, { useMemo, useState } from 'react'
import {
  View, FlatList, TouchableOpacity, Text, StyleSheet,
  Alert, Animated
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useApp } from '../../context/AppContext'
import { Colors } from '../../constants/colors'
import QuestionCard from '../../components/QuestionCard'
import SearchFilterBar from '../../components/SearchFilterBar'
import EmptyState from '../../components/EmptyState'

export default function QuestionsScreen(): React.ReactElement {
  const { state, deleteQuestion } = useApp()
  const router = useRouter()
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('')

  const filtered = useMemo(() =>
    state.questions.filter((q) => {
      if (difficulty && q.difficulty !== difficulty) return false
      if (topic && !q.topic.toLowerCase().includes(topic.toLowerCase())) return false
      return true
    }),
    [state.questions, difficulty, topic]
  )

  function handleDelete(id: string, content: string): void {
    Alert.alert('Xóa câu hỏi', `Xóa câu hỏi:\n"${content.substring(0, 60)}..."?`, [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => deleteQuestion(id) },
    ])
  }

  function handleEdit(id: string): void {
    router.push({ pathname: '/(stack)/question-form', params: { id } })
  }

  return (
    <View style={styles.container}>
      <SearchFilterBar
        topic={topic}
        difficulty={difficulty}
        onTopicChange={setTopic}
        onDifficultyChange={setDifficulty}
      />

      <FlatList
        data={filtered}
        keyExtractor={(q) => q.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.count}>
            {filtered.length}/{state.questions.length} câu hỏi
          </Text>
        }
        ListEmptyComponent={
          <EmptyState
            icon="📋"
            title={state.questions.length === 0 ? 'Chưa có câu hỏi nào' : 'Không tìm thấy'}
            subtitle={state.questions.length === 0 ? 'Nhấn + để thêm câu hỏi đầu tiên' : 'Thử thay đổi bộ lọc'}
          />
        }
        renderItem={({ item: q }) => (
          <QuestionCard
            question={q}
            onPress={() => handleEdit(q.id)}
            rightAction={
              <TouchableOpacity onPress={() => handleDelete(q.id, q.content)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="trash-outline" size={18} color={Colors.danger} />
              </TouchableOpacity>
            }
          />
        )}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(stack)/question-form')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  list: { padding: 16, paddingBottom: 90 },
  count: { fontSize: 12, color: Colors.muted, marginBottom: 10 },
  fab: {
    position: 'absolute', right: 20, bottom: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2, shadowRadius: 4,
  },
})
