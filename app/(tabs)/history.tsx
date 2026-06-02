/**
 * Màn hình 6 – Lịch sử & Thông tin (Shared – n+2, n+3)
 */
import React from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useApp } from '../../context/AppContext'
import { Colors } from '../../constants/colors'
import EmptyState from '../../components/EmptyState'

export default function HistoryScreen(): React.ReactElement {
  const { state } = useApp()
  const router = useRouter()

  function formatTime(iso: string): string {
    const d = new Date(iso)
    return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
  }

  return (
    <View style={styles.container}>
      {/* Summary cards */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNum}>{state.questions.length}</Text>
          <Text style={styles.summaryLabel}>Câu hỏi đã lưu</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNum}>{state.exams.length}</Text>
          <Text style={styles.summaryLabel}>Đề thi đã lưu</Text>
        </View>
      </View>

      {/* Button to team screen */}
      <TouchableOpacity style={styles.teamBtn} onPress={() => router.push('/(stack)/team')} activeOpacity={0.85}>
        <Ionicons name="people-outline" size={20} color={Colors.primary} />
        <Text style={styles.teamBtnText}>Xem thông tin nhóm</Text>
        <Ionicons name="chevron-forward" size={16} color={Colors.muted} />
      </TouchableOpacity>

      {/* Activity log */}
      <View style={styles.logHeader}>
        <Text style={styles.logTitle}>Hoạt động gần đây</Text>
        <Text style={styles.logCount}>{state.history.length} mục</Text>
      </View>

      <FlatList
        data={state.history}
        keyExtractor={(e) => e.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState icon="⏳" title="Chưa có hoạt động nào" subtitle="Thêm câu hỏi hoặc tạo đề thi để bắt đầu" />
        }
        renderItem={({ item: entry }) => (
          <View style={styles.entry}>
            <View style={[styles.dot, { backgroundColor: entry.type === 'question' ? Colors.primary : Colors.warning }]} />
            <View style={styles.entryBody}>
              <Text style={styles.entryMsg}>{entry.message}</Text>
              <Text style={styles.entryTime}>{formatTime(entry.timestamp)}</Text>
            </View>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  summaryRow: { flexDirection: 'row', gap: 12, padding: 16, paddingBottom: 8 },
  summaryCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: 10, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  summaryNum: { fontSize: 28, fontWeight: '800', color: Colors.primary },
  summaryLabel: { fontSize: 12, color: Colors.muted, marginTop: 4 },
  teamBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.surface, marginHorizontal: 16, borderRadius: 10, padding: 14, borderWidth: 1, borderColor: Colors.border, marginBottom: 8 },
  teamBtnText: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.text },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  logTitle: { fontSize: 13, fontWeight: '700', color: Colors.muted, textTransform: 'uppercase' },
  logCount: { fontSize: 12, color: Colors.muted },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  entry: { flexDirection: 'row', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 5, flexShrink: 0 },
  entryBody: { flex: 1 },
  entryMsg: { fontSize: 14, color: Colors.text },
  entryTime: { fontSize: 12, color: Colors.muted, marginTop: 2 },
})
