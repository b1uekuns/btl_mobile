/**
 * Màn hình Stack – Chi tiết đề thi + thêm câu hỏi (Person 3)
 */
import React, { useMemo } from 'react'
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useApp } from '../../context/AppContext'
import { Colors } from '../../constants/colors'
import DifficultyBadge from '../../components/DifficultyBadge'
import QuestionCard from '../../components/QuestionCard'
import EmptyState from '../../components/EmptyState'

export default function ExamDetailScreen(): React.ReactElement {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { state, removeQuestionFromExam } = useApp()
  const router = useRouter()
  const exam = state.exams.find((e) => e.id === id)

  const examQuestions = useMemo(
    () => state.questions.filter((q) => exam?.questionIds.includes(q.id)),
    [state.questions, exam?.questionIds]
  )

  function handleRemove(questionId: string): void {
    Alert.alert('Xóa khỏi đề', 'Loại câu hỏi này khỏi đề thi?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => removeQuestionFromExam(id, questionId) },
    ])
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

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push({ pathname: '/(stack)/question-bank', params: { examId: id } })}
        activeOpacity={0.85}
      >
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.addBtnText}>Thêm câu hỏi</Text>
      </TouchableOpacity>
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
})
