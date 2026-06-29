/**
 * Màn hình 1 – Ngân hàng câu hỏi (Person 1)
 * Chức năng: Xem, tìm kiếm, thêm, sửa, xóa câu hỏi
 */
import React, { useMemo, useState } from 'react'
import {
  View, FlatList, TouchableOpacity, StyleSheet, Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useApp } from '../../context/AppContext'
import { Colors } from '../../constants/colors'
import QuestionCard from '../../components/QuestionCard'
import SearchFilterBar from '../../components/SearchFilterBar'
import SortDropdown, { SortOption } from '../../components/SortDropdown'
import EmptyState from '../../components/EmptyState'

type QuestionSort = 'newest' | 'oldest' | 'topic_asc' | 'topic_desc'

const SORT_OPTIONS: SortOption[] = [
  { value: 'newest',     label: 'Mới nhất' },
  { value: 'oldest',     label: 'Cũ nhất' },
  { value: 'topic_asc',  label: 'Chủ đề A→Z' },
  { value: 'topic_desc', label: 'Chủ đề Z→A' },
]

export default function QuestionsScreen(): React.ReactElement {
  const { state, deleteQuestion } = useApp()
  const router = useRouter()
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [sort, setSort] = useState<QuestionSort>('newest')

  const filtered = useMemo(() => {
    let list = state.questions.filter((q) => {
      if (difficulty && q.difficulty !== difficulty) return false
      if (topic && !q.topic.toLowerCase().includes(topic.toLowerCase())) return false
      return true
    })

    switch (sort) {
      case 'newest':     list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break
      case 'oldest':     list = [...list].sort((a, b) => a.createdAt.localeCompare(b.createdAt)); break
      case 'topic_asc':  list = [...list].sort((a, b) => a.topic.localeCompare(b.topic, 'vi')); break
      case 'topic_desc': list = [...list].sort((a, b) => b.topic.localeCompare(a.topic, 'vi')); break
    }
    return list
  }, [state.questions, difficulty, topic, sort])

  function handleDelete(id: string, content: string): void {
    Alert.alert('Xóa câu hỏi', `Xóa câu hỏi:\n"${content.substring(0, 60)}..."?`, [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => deleteQuestion(id) },
    ])
  }

  return (
    <View style={styles.container}>
      <SearchFilterBar
        topic={topic}
        difficulty={difficulty}
        onTopicChange={setTopic}
        onDifficultyChange={setDifficulty}
      />
      <SortDropdown options={SORT_OPTIONS} value={sort} onChange={(v) => setSort(v as QuestionSort)} />

      <FlatList
        data={filtered}
        keyExtractor={(q) => q.id}
        contentContainerStyle={styles.list}
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
            onPress={() => router.push({ pathname: '/(stack)/question-form', params: { id: q.id } })}
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
