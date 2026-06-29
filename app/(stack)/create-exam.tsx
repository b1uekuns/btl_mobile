/**
 * Màn hình Stack – Tạo đề thi mới
 * Navigation: slide_from_right (chuẩn), header do expo-router quản lý
 * Không có chọn mức độ — tự động tính khi thêm câu hỏi vào
 */
import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useApp } from '../../context/AppContext'
import { Colors } from '../../constants/colors'
import { CreateExamInput } from '../../types'

export default function CreateExamScreen(): React.ReactElement {
  const { addExam } = useApp()
  const router = useRouter()

  const [form, setForm] = useState<CreateExamInput>({
    title: '',
    description: '',
    duration: 45,
  })
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
    // Thay thế màn hình tạo bằng exam-detail (không quay lại trang tạo)
    router.replace({ pathname: '/(stack)/exam-detail', params: { id: exam.id } })
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Tên đề thi */}
        <Text style={styles.label}>
          Tên đề thi <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, errors.title ? styles.inputError : null]}
          placeholder="Nhập tên đề thi..."
          placeholderTextColor={Colors.muted}
          value={form.title}
          onChangeText={(v) => setForm((f) => ({ ...f, title: v }))}
          autoFocus
          returnKeyType="next"
        />
        {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}

        {/* Mô tả */}
        <Text style={styles.label}>Mô tả</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Mô tả hoặc ghi chú về đề thi..."
          placeholderTextColor={Colors.muted}
          multiline
          value={form.description}
          onChangeText={(v) => setForm((f) => ({ ...f, description: v }))}
        />

        {/* Thời gian */}
        <Text style={styles.label}>
          Thời gian (phút) <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.durationRow}>
          <TouchableOpacity
            style={styles.durationBtn}
            onPress={() => setForm((f) => ({ ...f, duration: Math.max(1, (f.duration || 0) - 5) }))}
          >
            <Ionicons name="remove" size={22} color={Colors.text} />
          </TouchableOpacity>
          <TextInput
            style={[styles.durationInput, errors.duration ? styles.inputError : null]}
            keyboardType="number-pad"
            value={String(form.duration)}
            onChangeText={(v) => setForm((f) => ({ ...f, duration: parseInt(v) || 0 }))}
            textAlign="center"
          />
          <TouchableOpacity
            style={styles.durationBtn}
            onPress={() => setForm((f) => ({ ...f, duration: (f.duration || 0) + 5 }))}
          >
            <Ionicons name="add" size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>
        {errors.duration ? <Text style={styles.errorText}>{errors.duration}</Text> : null}

        {/* Quick picks */}
        <View style={styles.quickRow}>
          {[15, 30, 45, 60, 90].map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.quickChip, form.duration === t && styles.quickChipActive]}
              onPress={() => setForm((f) => ({ ...f, duration: t }))}
            >
              <Text style={[styles.quickText, form.duration === t && styles.quickTextActive]}>
                {t}'
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Ghi chú mức độ tự động */}
        <View style={styles.autoNote}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.primary} />
          <Text style={styles.autoNoteText}>
            Mức độ đề thi sẽ tự động tính theo câu hỏi được thêm vào
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnCancel} onPress={() => router.back()}>
          <Text style={styles.btnCancelText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnCreate} onPress={handleCreate} activeOpacity={0.85}>
          <Ionicons name="checkmark" size={20} color="#fff" />
          <Text style={styles.btnCreateText}>Tạo đề thi</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { padding: 20 },

  label: { fontSize: 13, fontWeight: '600', color: Colors.text, marginBottom: 8, marginTop: 20 },
  required: { color: Colors.danger },

  input: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    padding: 12, fontSize: 14, color: Colors.text,
    backgroundColor: Colors.surface,
  },
  inputError: { borderColor: Colors.danger },
  textarea: { minHeight: 90, textAlignVertical: 'top' },
  errorText: { fontSize: 12, color: Colors.danger, marginTop: 4 },

  // Duration
  durationRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  durationBtn: {
    width: 44, height: 44, borderRadius: 10,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  durationInput: {
    flex: 1, borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    padding: 10, fontSize: 22, fontWeight: '700', color: Colors.text,
    backgroundColor: Colors.surface,
  },
  quickRow: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  quickChip: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
  },
  quickChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  quickText: { fontSize: 13, color: Colors.muted, fontWeight: '500' },
  quickTextActive: { color: '#fff' },

  // Auto note
  autoNote: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 28, padding: 14, borderRadius: 10,
    backgroundColor: Colors.primaryLight ?? '#eff6ff',
    borderWidth: 1, borderColor: Colors.primary + '40',
  },
  autoNoteText: { flex: 1, fontSize: 13, color: Colors.primary, lineHeight: 18 },

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
  btnCreate: {
    flex: 1, backgroundColor: Colors.primary, borderRadius: 10, padding: 15,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  btnCreateText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
