/**
 * Màn hình Stack – Chi tiết đề thi + thêm câu hỏi (Person 3)
 */
import React, { useState, useMemo } from 'react'
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert
} from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useApp } from '../../context/AppContext'
import { Colors } from '../../constants/colors'
import DifficultyBadge from '../../components/DifficultyBadge'
import QuestionCard from '../../components/QuestionCard'
import SearchFilterBar from '../../components/SearchFilterBar'
import EmptyState from '../../components/EmptyState'
import AnimatedModal from '../../components/AnimatedModal'

export default function ExamDetailScreen(): React.ReactElement {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { state, addQuestionsToExam, removeQuestionFromExam } = useApp()
  const exam = state.exams.find((e) => e.id === id)

  const [showBank, setShowBank] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bankTopic, setBankTopic] = useState('')
  const [bankDifficulty, setBankDifficulty] = useState('')

  const examQuestions = useMemo(
    () => state.questions.filter((q) => exam?.questionIds.includes(q.id)),
    [state.questions, exam?.questionIds]
  )

  const bankQuestions = useMemo(() => {
    const existing = new Set(exam?.questionIds ?? [])
    return state.questions
      .filter((q) => !existing.has(q.id))
      .filter((q) => !bankDifficulty || q.difficulty === bankDifficulty)
      .filter((q) => !bankTopic || q.topic.toLowerCase().includes(bankTopic.toLowerCase()))
  }, [state.questions, exam?.questionIds, bankDifficulty, bankTopic])

  function toggleSelect(id: string): void {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleAdd(): void {
    if (selectedIds.size === 0) return
    addQuestionsToExam(id, Array.from(selectedIds))
    setShowBank(false)
    setSelectedIds(new Set())
  }

  function handleRemove(questionId: string): void {
    Alert.alert('Xóa khỏi đề', 'Loại câu hỏi này khỏi đề thi?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => removeQuestionFromExam(id, questionId) },
    ])
  }

  function openBank(): void {
    setSelectedIds(new Set())
    setBankTopic('')
    setBankDifficulty('')
    setShowBank(true)
  }

  if (!exam) return <EmptyState icon="❌" title="Không tìm thấy đề thi" />

  return (
    <View style={styles.container}>
      {/* Header info */}
      <View style={styles.infoCard}>
        <Text style={styles.examTitle}>{exam.title}</Text>
        {exam.description ? <Text style={styles.examDesc}>{exam.description}</Text> : null}
        <View style={styles.metaRow}>
          <DifficultyBadge difficulty={exam.difficulty} />
          <Text style={styles.metaText}>⏱ {exam.duration} phút</Text>
          <Text style={styles.metaText}>📋 {exam.questionIds.length} câu</Text>
        </View>
      </View>

      <FlatList
        data={examQuestions}
        keyExtractor={(q) => q.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState icon="📭" title="Chưa có câu hỏi trong đề" subtitle='Nhấn "Thêm câu hỏi" để bắt đầu' />
        }
        renderItem={({ item: q, index }) => (
          <QuestionCard
            question={q}
            index={index}
            showOptions
            rightAction={
              <TouchableOpacity onPress={() => handleRemove(q.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle-outline" size={20} color={Colors.danger} />
              </TouchableOpacity>
            }
          />
        )}
      />

      <TouchableOpacity style={styles.addBtn} onPress={openBank} activeOpacity={0.85}>
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.addBtnText}>Thêm câu hỏi</Text>
      </TouchableOpacity>

      {/* Modal ngân hàng */}
      <AnimatedModal visible={showBank} onClose={() => setShowBank(false)}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ngân hàng câu hỏi</Text>
            <TouchableOpacity onPress={() => setShowBank(false)}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <SearchFilterBar
            topic={bankTopic}
            difficulty={bankDifficulty}
            onTopicChange={setBankTopic}
            onDifficultyChange={setBankDifficulty}
          />

          <Text style={styles.bankCount}>
            {selectedIds.size} đã chọn / {bankQuestions.length} câu
          </Text>

          <FlatList
            data={bankQuestions}
            keyExtractor={(q) => q.id}
            contentContainerStyle={styles.bankList}
            ListEmptyComponent={
              <EmptyState
                icon="🔍"
                title={state.questions.length === 0 ? 'Ngân hàng chưa có câu hỏi' : 'Không có câu phù hợp'}
                subtitle={state.questions.length > 0 ? 'Thử thay đổi bộ lọc' : undefined}
              />
            }
            renderItem={({ item: q }) => (
              <TouchableOpacity
                style={[styles.bankItem, selectedIds.has(q.id) && styles.bankItemSelected]}
                onPress={() => toggleSelect(q.id)}
                activeOpacity={0.8}
              >
                <View style={styles.bankCheck}>
                  {selectedIds.has(q.id)
                    ? <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
                    : <Ionicons name="ellipse-outline" size={22} color={Colors.border} />
                  }
                </View>
                <View style={styles.bankContent}>
                  <Text style={styles.bankQ} numberOfLines={2}>{q.content}</Text>
                  <View style={styles.bankMeta}>
                    <DifficultyBadge difficulty={q.difficulty} size="sm" />
                    <Text style={styles.bankTopic}>{q.topic}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.btnCancel} onPress={() => setShowBank(false)}>
              <Text style={styles.btnCancelText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnAdd, selectedIds.size === 0 && styles.btnDisabled]}
              onPress={handleAdd}
              disabled={selectedIds.size === 0}
            >
              <Text style={styles.btnAddText}>Thêm {selectedIds.size} câu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AnimatedModal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  infoCard: { backgroundColor: Colors.surface, padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  examTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  examDesc: { fontSize: 13, color: Colors.muted, marginBottom: 8 },
  metaRow: { flexDirection: 'row', gap: 10, alignItems: 'center', flexWrap: 'wrap' },
  metaText: { fontSize: 13, color: Colors.muted },
  list: { padding: 16, paddingBottom: 100 },
  addBtn: {
    position: 'absolute', bottom: 20, left: 20, right: 20,
    backgroundColor: Colors.primary, borderRadius: 12, padding: 15,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4,
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  modal: { flex: 1, backgroundColor: Colors.surface },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  modalTitle: { fontSize: 17, fontWeight: '700', color: Colors.text },
  bankCount: { fontSize: 12, color: Colors.muted, paddingHorizontal: 16, paddingVertical: 6 },
  bankList: { padding: 16, paddingBottom: 100 },
  bankItem: { flexDirection: 'row', gap: 10, padding: 12, backgroundColor: Colors.bg, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  bankItemSelected: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  bankCheck: { paddingTop: 2 },
  bankContent: { flex: 1 },
  bankQ: { fontSize: 14, color: Colors.text, marginBottom: 6 },
  bankMeta: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  bankTopic: { fontSize: 12, color: Colors.muted },
  modalFooter: { flexDirection: 'row', gap: 12, padding: 16, borderTopWidth: 1, borderTopColor: Colors.border },
  btnAdd: { flex: 1, backgroundColor: Colors.primary, borderRadius: 8, padding: 14, alignItems: 'center' },
  btnAddText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnCancel: { flex: 1, backgroundColor: Colors.bg, borderRadius: 8, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  btnCancelText: { color: Colors.text, fontWeight: '600', fontSize: 15 },
  btnDisabled: { opacity: 0.5 },
})
