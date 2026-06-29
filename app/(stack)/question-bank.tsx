/**
 * Màn hình Stack – Ngân hàng câu hỏi (chọn câu cho đề thi)
 * Navigation: slide_from_right (chuẩn), header do expo-router quản lý
 */
import React, { useState, useMemo, useLayoutEffect } from 'react'
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useApp } from '../../context/AppContext'
import { Colors } from '../../constants/colors'
import DifficultyBadge from '../../components/DifficultyBadge'
import SearchFilterBar from '../../components/SearchFilterBar'
import EmptyState from '../../components/EmptyState'

export default function QuestionBankScreen(): React.ReactElement {
  const { examId } = useLocalSearchParams<{ examId: string }>()
  const { state, addQuestionsToExam } = useApp()
  const router = useRouter()
  const navigation = useNavigation()

  const exam = state.exams.find((e) => e.id === examId)

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bankTopic, setBankTopic] = useState('')
  const [bankDifficulty, setBankDifficulty] = useState('')

  const bankQuestions = useMemo(() => {
    const existing = new Set(exam?.questionIds ?? [])
    return state.questions
      .filter((q) => !existing.has(q.id))
      .filter((q) => !bankDifficulty || q.difficulty === bankDifficulty)
      .filter((q) => !bankTopic || q.topic.toLowerCase().includes(bankTopic.toLowerCase()))
  }, [state.questions, exam?.questionIds, bankDifficulty, bankTopic])

  const allSelected = bankQuestions.length > 0 && selectedIds.size === bankQuestions.length

  // Thêm nút "Chọn tất cả" vào header phải
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        bankQuestions.length > 0 ? (
          <TouchableOpacity
            onPress={handleSelectAll}
            style={{ marginRight: 4, padding: 6 }}
          >
            <Ionicons
              name={allSelected ? 'checkbox' : 'checkbox-outline'}
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        ) : null,
    })
  }, [bankQuestions.length, allSelected])

  function toggleSelect(id: string): void {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleSelectAll(): void {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(bankQuestions.map((q) => q.id)))
    }
  }

  function handleAdd(): void {
    if (selectedIds.size === 0) return
    addQuestionsToExam(examId, Array.from(selectedIds))
    router.back()
  }

  return (
    <View style={styles.container}>
      {/* Search/filter */}
      <SearchFilterBar
        topic={bankTopic}
        difficulty={bankDifficulty}
        onTopicChange={setBankTopic}
        onDifficultyChange={setBankDifficulty}
      />

      {/* Count bar */}
      <View style={styles.countBar}>
        <Text style={styles.countText}>
          <Text style={styles.countSelected}>{selectedIds.size}</Text>
          {' đã chọn'}
          {'  •  '}
          {bankQuestions.length} câu trong bộ lọc
        </Text>
        {selectedIds.size > 0 && (
          <TouchableOpacity onPress={() => setSelectedIds(new Set())}>
            <Text style={styles.clearText}>Bỏ chọn tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      <FlatList
        data={bankQuestions}
        keyExtractor={(q) => q.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="🔍"
            title={state.questions.length === 0 ? 'Ngân hàng chưa có câu hỏi' : 'Không có câu phù hợp'}
            subtitle={state.questions.length > 0 ? 'Thử thay đổi bộ lọc' : undefined}
          />
        }
        renderItem={({ item: q }) => {
          const selected = selectedIds.has(q.id)
          return (
            <TouchableOpacity
              style={[styles.item, selected && styles.itemSelected]}
              onPress={() => toggleSelect(q.id)}
              activeOpacity={0.75}
            >
              <View style={styles.itemCheck}>
                <Ionicons
                  name={selected ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={selected ? Colors.primary : Colors.border}
                />
              </View>
              <View style={styles.itemBody}>
                <Text style={styles.itemQ} numberOfLines={3}>{q.content}</Text>
                <View style={styles.itemMeta}>
                  <DifficultyBadge difficulty={q.difficulty} size="sm" />
                  <View style={styles.topicPill}>
                    <Text style={styles.topicText}>{q.topic}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )
        }}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnCancel} onPress={() => router.back()}>
          <Text style={styles.btnCancelText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnAdd, selectedIds.size === 0 && styles.btnDisabled]}
          onPress={handleAdd}
          disabled={selectedIds.size === 0}
          activeOpacity={0.85}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.btnAddText}>
            Thêm {selectedIds.size > 0 ? `${selectedIds.size} câu` : 'câu hỏi'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  // Count bar
  countBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  countText: { fontSize: 13, color: Colors.muted },
  countSelected: { color: Colors.primary, fontWeight: '700' },
  clearText: { fontSize: 13, color: Colors.danger, fontWeight: '600' },

  // List
  list: { padding: 12, paddingBottom: 100 },
  item: {
    flexDirection: 'row', gap: 10, padding: 14,
    backgroundColor: Colors.surface, borderRadius: 10,
    marginBottom: 8, borderWidth: 1, borderColor: Colors.border,
  },
  itemSelected: {
    backgroundColor: Colors.primaryLight ?? '#eff6ff',
    borderColor: Colors.primary,
  },
  itemCheck: { paddingTop: 1 },
  itemBody: { flex: 1 },
  itemQ: { fontSize: 14, color: Colors.text, lineHeight: 20, marginBottom: 8 },
  itemMeta: { flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' },
  topicPill: {
    backgroundColor: Colors.bg, paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 10, borderWidth: 1, borderColor: Colors.border,
  },
  topicText: { fontSize: 11, color: Colors.muted },

  // Footer
  footer: {
    flexDirection: 'row', gap: 12, padding: 16,
    borderTopWidth: 1, borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  btnCancel: {
    flex: 1, borderRadius: 10, padding: 15,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.bg,
  },
  btnCancelText: { color: Colors.text, fontWeight: '600', fontSize: 15 },
  btnAdd: {
    flex: 1, backgroundColor: Colors.primary, borderRadius: 10, padding: 15,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  btnAddText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnDisabled: { opacity: 0.45 },
})
