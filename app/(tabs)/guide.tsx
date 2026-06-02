/**
 * Màn hình 5 – Hướng dẫn sử dụng (Shared – n+1)
 */
import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, LayoutAnimation } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constants/colors'

const SECTIONS = [
  {
    title: '📋  Ngân hàng câu hỏi',
    content: `Tab "Câu hỏi" cho phép bạn quản lý toàn bộ câu hỏi trắc nghiệm.\n\n• Nhấn nút (+) để thêm câu hỏi mới.\n• Điền nội dung câu hỏi, 4 đáp án A-D và chọn đáp án đúng.\n• Chọn độ khó (Dễ / Trung bình / Khó) và chủ đề.\n• Nhấn vào câu hỏi để chỉnh sửa, nhấn biểu tượng thùng rác để xóa.\n• Sử dụng ô tìm kiếm để lọc câu hỏi theo chủ đề hoặc chọn chip độ khó.`,
  },
  {
    title: '📝  Quản lý đề thi',
    content: `Tab "Đề thi" giúp bạn tạo và quản lý các đề kiểm tra.\n\n• Nhấn (+) để tạo đề thi mới: điền tên, mô tả, thời gian và mức độ.\n• Sau khi tạo, ứng dụng sẽ mở ngay màn hình chi tiết đề.\n• Nhấn vào tên đề thi để xem chi tiết, nhấn thùng rác để xóa.`,
  },
  {
    title: '🔍  Chi tiết đề thi',
    content: `Màn hình chi tiết đề thi cho phép thêm câu hỏi từ ngân hàng vào đề.\n\n• Nhấn "Thêm câu hỏi" để mở modal ngân hàng câu hỏi.\n• Tick chọn các câu muốn đưa vào đề, hỗ trợ lọc theo chủ đề và độ khó.\n• Nhấn vào dấu (X) bên cạnh câu hỏi trong đề để loại bỏ.\n• Thông tin đề (tên, thời gian, số câu) được hiển thị ở đầu màn hình.`,
  },
  {
    title: '📊  Thống kê',
    content: `Tab "Thống kê" hiển thị tổng quan dữ liệu:\n\n• Tổng số câu hỏi, đề thi và số câu trung bình mỗi đề.\n• Biểu đồ thanh phân bố câu hỏi theo 3 mức độ khó.\n• Top 5 chủ đề có nhiều câu hỏi nhất.\n• Các con số được animate đếm lên khi chuyển đến tab này.`,
  },
  {
    title: '💾  Lưu trữ dữ liệu',
    content: `Tất cả dữ liệu được lưu cục bộ trên thiết bị bằng AsyncStorage.\n\n• Dữ liệu tự động được lưu sau mỗi thao tác.\n• Dữ liệu được nạp lại khi mở lại ứng dụng.\n• Tab "Lịch sử" ghi lại 50 thao tác gần nhất.`,
  },
]

interface SectionProps {
  title: string
  content: string
}

function Section({ title, content }: SectionProps): React.ReactElement {
  const [open, setOpen] = useState(false)

  function toggle(): void {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setOpen((v) => !v)
  }

  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.sectionHeader} onPress={toggle} activeOpacity={0.8}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.muted} />
      </TouchableOpacity>
      {open && <Text style={styles.sectionContent}>{content}</Text>}
    </View>
  )
}

export default function GuideScreen(): React.ReactElement {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroIcon}>🎓</Text>
        <Text style={styles.heroTitle}>Hướng dẫn sử dụng</Text>
        <Text style={styles.heroSub}>Ứng dụng Tạo Đề Trắc Nghiệm</Text>
      </View>

      {SECTIONS.map((s) => (
        <Section key={s.title} title={s.title} content={s.content} />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 16, paddingBottom: 40 },
  hero: { alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 14, padding: 24, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  heroIcon: { fontSize: 44, marginBottom: 8 },
  heroTitle: { fontSize: 20, fontWeight: '800', color: Colors.text },
  heroSub: { fontSize: 13, color: Colors.muted, marginTop: 4 },
  section: { backgroundColor: Colors.surface, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: Colors.text, flex: 1 },
  sectionContent: { paddingHorizontal: 16, paddingBottom: 16, fontSize: 14, color: Colors.muted, lineHeight: 22 },
})
