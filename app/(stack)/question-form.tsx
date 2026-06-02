/**
 * Màn hình Stack – Tạo / Sửa câu hỏi (Person 1)
 */
import React, { useState, useEffect } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert
} from 'react-native'
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router'
import { useApp } from '../../context/AppContext'
import { Colors } from '../../constants/colors'
import { CreateQuestionInput, Difficulty } from '../../types'

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Dễ' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'hard', label: 'Khó' },
]

export default function QuestionFormScreen(): React.ReactElement {
  const { id } = useLocalSearchParams<{ id?: string }>()
  const { state, addQuestion, updateQuestion } = useApp()
  const router = useRouter()
  const navigation = useNavigation()
  const existing = id ? state.questions.find((q) => q.id === id) : undefined

  const [form, setForm] = useState<CreateQuestionInput>({
    content: '',
    optionTexts: ['', '', '', ''],
    correctOptionIndex: 0,
    difficulty: 'easy',
    topic: '',
  })
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

  useEffect(() => {
    navigation.setOptions({ title: existing ? 'Sửa câu hỏi' : 'Thêm câu hỏi' })
    if (existing) {
      setForm({
        content: existing.content,
        optionTexts: existing.options.map((o) => o.text) as [string, string, string, string],
        correctOptionIndex: existing.options.findIndex((o) => o.id === existing.correctOptionId),
        difficulty: existing.difficulty,
        topic: existing.topic,
      })
    }
  }, [existing])

  function updateOption(index: number, value: string): void {
    const next = [...form.optionTexts] as [string, string, string, string]
    next[index] = value
    setForm((f) => ({ ...f, optionTexts: next }))
  }

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!form.content.trim()) e.content = 'Nội dung không được để trống'
    if (!form.topic.trim()) e.topic = 'Chủ đề không được để trống'
    form.optionTexts.forEach((t, i) => {
      if (!t.trim()) e[`opt${i}`] = 'Đáp án không được để trống'
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSave(): void {
    if (!validate()) return
    if (existing) {
      updateQuestion(existing.id, form)
    } else {
      addQuestion(form)
    }
    router.back()
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

      <Text style={styles.label}>Nội dung câu hỏi *</Text>
      <TextInput
        style={[styles.input, styles.textarea, errors.content ? styles.inputError : null]}
        placeholder="Nhập nội dung câu hỏi..."
        multiline
        value={form.content}
        onChangeText={(v) => setForm((f) => ({ ...f, content: v }))}
      />
      {errors.content ? <Text style={styles.error}>{errors.content}</Text> : null}

      <Text style={styles.label}>Các đáp án * (chọn radio = đáp án đúng)</Text>
      {([0, 1, 2, 3] as const).map((i) => (
        <View key={i} style={styles.optRow}>
          <TouchableOpacity
            style={[styles.radio, form.correctOptionIndex === i && styles.radioActive]}
            onPress={() => setForm((f) => ({ ...f, correctOptionIndex: i }))}
          >
            {form.correctOptionIndex === i && <View style={styles.radioDot} />}
          </TouchableOpacity>
          <TextInput
            style={[styles.input, styles.optInput, errors[`opt${i}`] ? styles.inputError : null]}
            placeholder={`Đáp án ${String.fromCharCode(65 + i)}`}
            value={form.optionTexts[i]}
            onChangeText={(v) => updateOption(i, v)}
          />
        </View>
      ))}

      <Text style={styles.label}>Độ khó *</Text>
      <View style={styles.chipRow}>
        {DIFFICULTIES.map((d) => (
          <TouchableOpacity
            key={d.value}
            style={[styles.chip, form.difficulty === d.value && styles.chipActive]}
            onPress={() => setForm((f) => ({ ...f, difficulty: d.value }))}
          >
            <Text style={[styles.chipText, form.difficulty === d.value && styles.chipTextActive]}>
              {d.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Chủ đề *</Text>
      <TextInput
        style={[styles.input, errors.topic ? styles.inputError : null]}
        placeholder="Ví dụ: Toán học, Vật lý, Lịch sử..."
        value={form.topic}
        onChangeText={(v) => setForm((f) => ({ ...f, topic: v }))}
      />
      {errors.topic ? <Text style={styles.error}>{errors.topic}</Text> : null}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnCancel} onPress={() => router.back()}>
          <Text style={styles.btnCancelText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
          <Text style={styles.btnSaveText}>💾  Lưu câu hỏi</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 20, paddingBottom: 60 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 6, marginTop: 16 },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: 8, padding: 10, fontSize: 14, color: Colors.text, backgroundColor: Colors.surface },
  textarea: { minHeight: 90, textAlignVertical: 'top' },
  inputError: { borderColor: Colors.danger },
  error: { fontSize: 12, color: Colors.danger, marginTop: 3 },
  optRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: Colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  optInput: { flex: 1 },
  chipRow: { flexDirection: 'row', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.muted, fontWeight: '500' },
  chipTextActive: { color: '#fff' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 28 },
  btnSave: { flex: 1, backgroundColor: Colors.primary, borderRadius: 10, padding: 15, alignItems: 'center' },
  btnSaveText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnCancel: { flex: 1, backgroundColor: Colors.surface, borderRadius: 10, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  btnCancelText: { color: Colors.text, fontWeight: '600', fontSize: 15 },
})
