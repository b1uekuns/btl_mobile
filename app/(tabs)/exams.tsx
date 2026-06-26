/**
 * Màn hình 2 – Quản lý đề thi (Person 2)
 * Chức năng: Xem danh sách, tạo mới, xóa đề thi
 */
import React, { useState } from 'react'
import {
  View, FlatList, TouchableOpacity, Text, StyleSheet,
  Alert, TextInput, ScrollView
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useApp } from '../../context/AppContext'
import { Colors, DifficultyLabels } from '../../constants/colors'
import DifficultyBadge from '../../components/DifficultyBadge'
import EmptyState from '../../components/EmptyState'
import AnimatedModal from '../../components/AnimatedModal'
import { CreateExamInput, ExamDifficulty } from '../../types'

const DIFFICULTIES: { value: ExamDifficulty; label: string }[] = [
  { value: 'easy', label: 'Dễ' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'hard', label: 'Khó' },
  { value: 'mixed', label: 'Hỗn hợp' },
]

export default function ExamsScreen(): React.ReactElement {
  const { state, addExam, deleteExam } = useApp()
  const router = useRouter()
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState<CreateExamInput>({ title: '', description: '', duration: 45, difficulty: 'mixed' })
  const [errors, setErrors] = useState<Partial<Record<keyof CreateExamInput, string>>>({})

  function validate(): boolean {
    const e: Partial<Record<keyof CreateExamInput, string>> = {}
    if (!form.title.trim()) e.title = 'Tên đề thi không được để trống'
    if (!form.duration || form.duration <= 0) e.duration = 'Thời gian phải > 0'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleCreate(): void {
    if (!validate()) return
    const exam = addExam(form)
    setShowCreate(false)
    setForm({ title: '', description: '', duration: 45, difficulty: 'mixed' })
    router.push({ pathname: '/(stack)/exam-detail', params: { id: exam.id } })
  }

  function handleDelete(id: string, title: string): void {
    Alert.alert('Xóa đề thi', `Xóa đề thi "${title}"?`, [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => deleteExam(id) },
    ])
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={state.exams}
        keyExtractor={(e) => e.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState icon="📝" title="Chưa có đề thi nào" subtitle='Nhấn + để tạo đề thi đầu tiên' />
        }
        renderItem={({ item: exam }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({ pathname: '/(stack)/exam-detail', params: { id: exam.id } })}
            activeOpacity={0.85}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle} numberOfLines={1}>{exam.title}</Text>
              <TouchableOpacity onPress={() => handleDelete(exam.id, exam.title)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="trash-outline" size={18} color={Colors.danger} />
              </TouchableOpacity>
            </View>
            {exam.description ? <Text style={styles.desc} numberOfLines={1}>{exam.description}</Text> : null}
            <View style={styles.cardMeta}>
              <DifficultyBadge difficulty={exam.difficulty} size="sm" />
              <Text style={styles.metaText}>⏱ {exam.duration} phút</Text>
              <Text style={styles.metaText}>📋 {exam.questionIds.length} câu</Text>
            </View>
            <Text style={styles.date}>{new Date(exam.createdAt).toLocaleDateString('vi-VN')}</Text>
          </TouchableOpacity>
        )}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowCreate(true)} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Modal tạo đề thi */}
      <AnimatedModal visible={showCreate} onClose={() => setShowCreate(false)}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Tạo đề thi mới</Text>
            <TouchableOpacity onPress={() => setShowCreate(false)}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody}>
            <Text style={styles.label}>Tên đề thi *</Text>
            <TextInput
              style={[styles.input, errors.title ? styles.inputError : null]}
              placeholder="Nhập tên đề thi..."
              value={form.title}
              onChangeText={(v) => setForm((f) => ({ ...f, title: v }))}
            />
            {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}

            <Text style={styles.label}>Mô tả</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Mô tả hoặc ghi chú..."
              multiline
              value={form.description}
              onChangeText={(v) => setForm((f) => ({ ...f, description: v }))}
            />

            <Text style={styles.label}>Thời gian (phút) *</Text>
            <TextInput
              style={[styles.input, errors.duration ? styles.inputError : null]}
              keyboardType="number-pad"
              placeholder="45"
              value={String(form.duration)}
              onChangeText={(v) => setForm((f) => ({ ...f, duration: parseInt(v) || 0 }))}
            />

            <Text style={styles.label}>Mức độ</Text>
            <View style={styles.diffRow}>
              {DIFFICULTIES.map((d) => (
                <TouchableOpacity
                  key={d.value}
                  style={[styles.diffChip, form.difficulty === d.value && styles.diffChipActive]}
                  onPress={() => setForm((f) => ({ ...f, difficulty: d.value }))}
                >
                  <Text style={[styles.diffText, form.difficulty === d.value && styles.diffTextActive]}>
                    {d.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.btnSecondary} onPress={() => setShowCreate(false)}>
              <Text style={styles.btnSecondaryText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary} onPress={handleCreate}>
              <Text style={styles.btnPrimaryText}>Tạo đề thi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AnimatedModal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  list: { padding: 16, paddingBottom: 90 },
  card: { backgroundColor: Colors.surface, borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, flex: 1, marginRight: 8 },
  desc: { fontSize: 13, color: Colors.muted, marginBottom: 8 },
  cardMeta: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' },
  metaText: { fontSize: 12, color: Colors.muted },
  date: { fontSize: 11, color: Colors.muted, marginTop: 6 },
  fab: {
    position: 'absolute', right: 20, bottom: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 4,
  },
  modal: { flex: 1, backgroundColor: Colors.surface },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.border },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  modalBody: { padding: 20 },
  modalFooter: { flexDirection: 'row', gap: 12, padding: 20, borderTopWidth: 1, borderTopColor: Colors.border },
  label: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: 8, padding: 10, fontSize: 14, color: Colors.text, backgroundColor: Colors.bg },
  inputError: { borderColor: Colors.danger },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
  errorText: { fontSize: 12, color: Colors.danger, marginTop: 3 },
  diffRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  diffChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.border },
  diffChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  diffText: { fontSize: 13, color: Colors.muted, fontWeight: '500' },
  diffTextActive: { color: '#fff' },
  btnPrimary: { flex: 1, backgroundColor: Colors.primary, borderRadius: 8, padding: 14, alignItems: 'center' },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnSecondary: { flex: 1, backgroundColor: Colors.bg, borderRadius: 8, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  btnSecondaryText: { color: Colors.text, fontWeight: '600', fontSize: 15 },
})
