/**
 * Màn hình Stack – Thông tin nhóm (Shared – n+3)
 */
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

const MEMBERS = [
  {
    name: "Lê Thanh Thảo",
    mssv: "20231631",
    role: "Người 1 – UI / Renderer",
    tasks:
      "Màn hình Ngân hàng câu hỏi, Form tạo/sửa câu hỏi, SearchFilterBar, QuestionCard component",
  },
  {
    name: "Tống Nhật Huy",
    mssv: "20231595",
    role: "Người 2 – Quản lý đề thi",
    tasks:
      "Màn hình Danh sách đề thi, Modal tạo đề, tích hợp ExamService, Context actions cho Exam",
  },
  {
    name: "Nguyễn Văn Mạnh",
    mssv: "20231609",
    role: "Người 3 – Chi tiết đề thi",
    tasks:
      "Màn hình Chi tiết đề thi, Modal ngân hàng câu hỏi, tính năng thêm/xóa câu hỏi khỏi đề",
  },
  {
    name: "Trương Văn Thái",
    mssv: "20231627",
    role: "Người 4 – Thống kê",
    tasks:
      "Màn hình Thống kê, Animation đếm số, biểu đồ phân bố độ khó, AppContext + AsyncStorage",
  },
];

export default function TeamScreen(): React.ReactElement {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.hero}>
        <Text style={styles.heroIcon}>👥</Text>
        <Text style={styles.heroTitle}>Nhóm 6</Text>
        <Text style={styles.heroSub}>Môn: Phát triển ứng dụng</Text>
        <Text style={styles.heroSub}>Đề tài: Ứng dụng Tạo Đề Trắc Nghiệm</Text>
      </View>

      {/* Tech stack */}
      <Text style={styles.sectionTitle}>⚙️ Công nghệ sử dụng</Text>
      <View style={styles.card}>
        {[
          ["Framework", "React Native + Expo SDK 52"],
          ["Ngôn ngữ", "TypeScript"],
          ["Navigation", "Expo Router (file-based)"],
          ["State", "Context API + useReducer"],
          ["Lưu trữ", "AsyncStorage (@react-native-async-storage)"],
          ["Animation", "React Native Animated API"],
        ].map(([key, val]) => (
          <View key={key} style={styles.techRow}>
            <Text style={styles.techKey}>{key}</Text>
            <Text style={styles.techVal}>{val}</Text>
          </View>
        ))}
      </View>

      {/* Members */}
      <Text style={styles.sectionTitle}>👤 Thành viên & Phân công</Text>
      {MEMBERS.map((m, i) => (
        <View key={i} style={styles.memberCard}>
          <View style={styles.memberHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{i + 1}</Text>
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{m.name}</Text>
              <Text style={styles.memberMssv}>MSSV: {m.mssv}</Text>
              <Text style={styles.memberRole}>{m.role}</Text>
              <Text style={styles.memberTasks}>{m.tasks}</Text>
            </View>
          </View>
        </View>
      ))}

      <Text style={styles.footer}>
        Dự án được phát triển cho môn học Phát triển Ứng dụng Di động. Toàn bộ
        dữ liệu lưu trữ cục bộ trên thiết bị.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 16, paddingBottom: 40 },
  hero: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.primary + "30",
  },
  heroIcon: { fontSize: 40, marginBottom: 8 },
  heroTitle: { fontSize: 20, fontWeight: "800", color: Colors.primary },
  heroSub: {
    fontSize: 13,
    color: Colors.muted,
    marginTop: 4,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 10,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  techRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  techKey: { width: 90, fontSize: 13, fontWeight: "600", color: Colors.text },
  techVal: { flex: 1, fontSize: 13, color: Colors.muted },
  memberCard: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  memberHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 15, fontWeight: "700", color: Colors.text },
  memberMssv: { fontSize: 12, color: Colors.muted },
  memberStatus: { fontSize: 12, color: "#16a34a", fontWeight: "600" },
  memberRole: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 4,
  },
  memberTasks: { fontSize: 13, color: Colors.muted, lineHeight: 20 },
  footer: {
    marginTop: 20,
    fontSize: 12,
    color: Colors.muted,
    textAlign: "center",
    lineHeight: 18,
  },
});
