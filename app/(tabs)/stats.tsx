/**
 * Màn hình 3 – Thống kê (Person 4)
 * Chức năng: Tổng quan, phân bố độ khó, animation đếm số
 */
import React, { useRef, useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { useApp } from '../../context/AppContext'
import { Colors, DifficultyColors, DifficultyLabels } from '../../constants/colors'

/**
 * Đếm số từ 0 → `to` trong 1000ms mỗi khi màn hình được focus.
 * Dùng addListener để convert Animated.Value → integer hiển thị.
 */
function CountUp({ to, style }: { to: number; style?: object }): React.ReactElement {
  const animVal = useRef(new Animated.Value(0)).current
  const [display, setDisplay] = React.useState(0)

  useFocusEffect(
    React.useCallback(() => {
      animVal.setValue(0)
      setDisplay(0)
      const anim = Animated.timing(animVal, { toValue: to, duration: 1000, useNativeDriver: false })
      const id = animVal.addListener(({ value }) => setDisplay(Math.round(value)))
      anim.start()
      return () => { animVal.removeListener(id); anim.stop() }
    }, [to, animVal])
  )

  return <Text style={style}>{display}</Text>
}

export default function StatsScreen(): React.ReactElement {
  const { state } = useApp()

  const slideAnim = useRef(new Animated.Value(40)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  // Slide-in (translateY 40→0) + Fade-in (opacity 0→1) khi màn hình focus
  // useNativeDriver: true → chạy trên native thread, không block JS
  useFocusEffect(
    React.useCallback(() => {
      slideAnim.setValue(40)
      opacityAnim.setValue(0)
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start()
    }, [slideAnim, opacityAnim])
  )

  const diffStats = useMemo(() => {
    const counts = { easy: 0, medium: 0, hard: 0 }
    state.questions.forEach((q) => { counts[q.difficulty] = (counts[q.difficulty] ?? 0) + 1 })
    return counts
  }, [state.questions])

  const totalQ = state.questions.length
  const totalE = state.exams.length
  const avgQPerExam = totalE > 0
    ? Math.round(state.exams.reduce((s, e) => s + e.questionIds.length, 0) / totalE)
    : 0

  const topics = useMemo(() => {
    const map = new Map<string, number>()
    state.questions.forEach((q) => map.set(q.topic, (map.get(q.topic) ?? 0) + 1))
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [state.questions])

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View style={{ transform: [{ translateY: slideAnim }], opacity: opacityAnim }}>

        {/* Tổng quan */}
        <Text style={styles.section}>Tổng quan</Text>
        <View style={styles.row}>
          <View style={[styles.statCard, { backgroundColor: Colors.primaryLight }]}>
            <CountUp to={totalQ} style={[styles.statNum, { color: Colors.primary }]} />
            <Text style={styles.statLabel}>Câu hỏi</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#fef9c3' }]}>
            <CountUp to={totalE} style={[styles.statNum, { color: '#ca8a04' }]} />
            <Text style={styles.statLabel}>Đề thi</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: Colors.successLight }]}>
            <CountUp to={avgQPerExam} style={[styles.statNum, { color: '#16a34a' }]} />
            <Text style={styles.statLabel}>TB câu/đề</Text>
          </View>
        </View>

        {/* Phân bố độ khó */}
        <Text style={styles.section}>Phân bố độ khó</Text>
        <View style={styles.card}>
          {(['easy', 'medium', 'hard'] as const).map((d) => {
            const count = diffStats[d]
            const pct = totalQ > 0 ? Math.round((count / totalQ) * 100) : 0
            const palette = DifficultyColors[d]
            return (
              <View key={d} style={styles.barRow}>
                <Text style={styles.barLabel}>{DifficultyLabels[d]}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: palette.text }]} />
                </View>
                <Text style={styles.barCount}>{count} ({pct}%)</Text>
              </View>
            )
          })}
          {totalQ === 0 && <Text style={styles.noData}>Chưa có dữ liệu</Text>}
        </View>

        {/* Top chủ đề */}
        <Text style={styles.section}>Chủ đề nhiều câu nhất</Text>
        <View style={styles.card}>
          {topics.length === 0
            ? <Text style={styles.noData}>Chưa có dữ liệu</Text>
            : topics.map(([topic, count], i) => (
              <View key={topic} style={styles.topicRow}>
                <Text style={styles.topicRank}>#{i + 1}</Text>
                <Text style={styles.topicName} numberOfLines={1}>{topic}</Text>
                <Text style={styles.topicCount}>{count} câu</Text>
              </View>
            ))
          }
        </View>

      </Animated.View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 16, paddingBottom: 40 },
  section: { fontSize: 13, fontWeight: '700', color: Colors.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 20, marginBottom: 10 },
  row: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, borderRadius: 12, padding: 16, alignItems: 'center' },
  statNum: { fontSize: 32, fontWeight: '800' },
  statLabel: { fontSize: 12, color: Colors.muted, marginTop: 4 },
  card: { backgroundColor: Colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: Colors.border, gap: 12 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barLabel: { width: 70, fontSize: 13, color: Colors.text, fontWeight: '500' },
  barTrack: { flex: 1, height: 10, backgroundColor: Colors.border, borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5, minWidth: 4 },
  barCount: { width: 70, fontSize: 12, color: Colors.muted, textAlign: 'right' },
  noData: { fontSize: 13, color: Colors.muted, textAlign: 'center', paddingVertical: 8 },
  topicRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  topicRank: { fontSize: 13, fontWeight: '700', color: Colors.primary, width: 24 },
  topicName: { flex: 1, fontSize: 14, color: Colors.text },
  topicCount: { fontSize: 13, color: Colors.muted },
})
