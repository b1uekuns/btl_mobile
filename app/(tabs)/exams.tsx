/**
 * Màn hình 2 – Quản lý đề thi (Person 2)
 * Chức năng: Xem danh sách, tạo mới, xóa đề thi
 */
import React, { useState, useMemo } from 'react'
import {
  View, FlatList, TouchableOpacity, Text, StyleSheet, Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useApp } from '../../context/AppContext'
import { Colors } from '../../constants/colors'
import DifficultyBadge from '../../components/DifficultyBadge'
import EmptyState from '../../components/EmptyState'
import SearchFilterBar from '../../components/SearchFilterBar'
import SortDropdown, { SortOption } from '../../components/SortDropdown'

type ExamSort = 'newest' | 'oldest' | 'most_q' | 'least_q' | 'longest' | 'shortest'

const SORT_OPTIONS: SortOption[] = [
  { value: 'newest',   label: 'Mới nhất' },
  { value: 'oldest',   label: 'Cũ nhất' },
  { value: 'most_q',   label: 'Nhiều câu nhất' },
  { value: 'least_q',  label: 'Ít câu nhất' },
  { value: 'longest',  label: 'Thời gian dài nhất' },
  { value: 'shortest', label: 'Thời gian ngắn nhất' },
]

export default function ExamsScreen(): React.ReactElement {
  const { state, deleteExam } = useApp()
  const router = useRouter()

  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [sort, setSort] = useState<ExamSort>('newest')

  const filtered = useMemo(() => {
    let list = state.exams
      .filter((e) => !difficulty || e.difficulty === difficulty)
      .filter((e) => !search || e.title.toLowerCase().includes(search.toLowerCase()))

    switch (sort) {
      case 'newest':   list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break
      case 'oldest':   list = [...list].sort((a, b) => a.createdAt.localeCompare(b.createdAt)); break
      case 'most_q':   list = [...list].sort((a, b) => b.questionIds.length - a.questionIds.length); break
      case 'least_q':  list = [...list].sort((a, b) => a.questionIds.length - b.questionIds.length); break
      case 'longest':  list = [...list].sort((a, b) => b.duration - a.duration); break
      case 'shortest': list = [...list].sort((a, b) => a.duration - b.duration); break
    }
    return list
  }, [state.exams, difficulty, search, sort])

  function handleDelete(id: string, title: string): void {
    Alert.alert('Xóa đề thi', `Xóa đề thi "${title}"?`, [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => deleteExam(id) },
    ])
  }

  return (
    <View style={styles.container}>
      <SearchFilterBar
        topic={search}
        difficulty={difficulty}
        onTopicChange={setSearch}
        onDifficultyChange={setDifficulty}
        searchLabel="🔍  Tìm theo tên đề thi..."
        examMode
      />
      <SortDropdown options={SORT_OPTIONS} value={sort} onChange={(v) => setSort(v as ExamSort)} />

      <FlatList
        data={filtered}
        keyExtractor={(e) => e.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          state.exams.length === 0
            ? <EmptyState icon="📝" title="Chưa có đề thi nào" subtitle='Nhấn + để tạo đề thi đầu tiên' />
            : <EmptyState icon="🔍" title="Không tìm thấy đề thi" subtitle="Thử thay đổi bộ lọc" />
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
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(stack)/create-exam')}
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
})
