# 📝 QuizMaker Mobile

> Ứng dụng quản lý ngân hàng câu hỏi và đề thi trắc nghiệm — xây dựng bằng Expo / React Native.

---

## 🗂 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Cài đặt & Chạy](#-cài-đặt--chạy)
- [Scripts](#-scripts)
- [Database](#-database)
- [Kiến trúc & State Management](#-kiến-trúc--state-management)
- [Màn hình chính](#-màn-hình-chính)
- [Thông tin nhóm](#-thông-tin-nhóm)

---

## 📌 Giới thiệu

**QuizMaker** là ứng dụng di động giúp người dùng tạo và quản lý **ngân hàng câu hỏi trắc nghiệm** cũng như **đề thi** một cách dễ dàng. Toàn bộ dữ liệu được lưu trữ cục bộ trên thiết bị thông qua SQLite, không cần kết nối mạng hay backend server.

---

## ✨ Tính năng

| Tính năng | Mô tả |
|---|---|
| 📋 Ngân hàng câu hỏi | Tạo, sửa, xóa câu hỏi trắc nghiệm 4 đáp án |
| 📁 Quản lý đề thi | Tạo đề thi, thêm / xóa câu hỏi vào đề |
| 🔍 Tìm kiếm & Lọc | Tìm theo chủ đề, lọc theo độ khó |
| 📊 Thống kê | Xem phân bổ câu hỏi, top chủ đề, trung bình câu/đề |
| 📖 Hướng dẫn | Tài liệu sử dụng nội bộ dạng accordion |
| 🕐 Lịch sử | Theo dõi 50 thao tác gần nhất |
| 📄 Xuất báo cáo | Tạo file `.docx` báo cáo tự động |

---

## 🛠 Công nghệ sử dụng

| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| Expo | ~54.0.0 | Framework chạy app |
| React Native | 0.81.5 | Nền tảng UI |
| Expo Router | ~6.0.23 | Điều hướng theo file |
| expo-sqlite | ~16.0.10 | Lưu trữ dữ liệu local |
| TypeScript | ~5.9.2 | Type-safe development |
| @expo/vector-icons | ^15.0.3 | Icon Ionicons |
| react-native-reanimated | ~4.1.1 | Animation nâng cao |
| docx | ^8.5.0 | Tạo file Word báo cáo |

---

## 📁 Cấu trúc thư mục

```
btl_mobile/
├── app/
│   ├── _layout.tsx              # Root layout, bọc AppProvider
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Bottom tab navigator (5 tab)
│   │   ├── index.tsx            # Ngân hàng câu hỏi
│   │   ├── exams.tsx            # Quản lý đề thi
│   │   ├── stats.tsx            # Thống kê
│   │   ├── guide.tsx            # Hướng dẫn sử dụng
│   │   └── history.tsx          # Lịch sử thao tác
│   └── (stack)/
│       ├── _layout.tsx          # Stack navigator
│       ├── question-form.tsx    # Tạo / Sửa câu hỏi
│       ├── exam-detail.tsx      # Chi tiết đề thi
│       └── team.tsx             # Thông tin nhóm
├── components/
│   ├── AnimatedModal.tsx        # Bottom sheet modal
│   ├── DifficultyBadge.tsx      # Badge hiển thị độ khó
│   ├── EmptyState.tsx           # Giao diện danh sách trống
│   ├── QuestionCard.tsx         # Card câu hỏi
│   └── SearchFilterBar.tsx      # Thanh tìm kiếm & lọc
├── constants/
│   └── colors.ts                # Design tokens màu sắc
├── context/
│   └── AppContext.tsx           # State management (Context + useReducer)
├── types/
│   └── index.ts                 # TypeScript models
├── utils/
│   └── storage.ts               # Thao tác SQLite
├── scripts/
│   └── generate-reports.ts      # Script tạo báo cáo .docx
├── app.json
├── package.json
├── tsconfig.json
└── babel.config.js
```

---

## 🚀 Cài đặt & Chạy

### Yêu cầu

- Node.js >= 18
- npm >= 9
- Expo Go (cài trên điện thoại) **hoặc** Android/iOS Emulator

### Bước 1 — Clone & cài dependencies

```bash
git clone <repo-url>
cd btl_mobile
npm install
```

### Bước 2 — Chạy ứng dụng

```bash
# Khởi động Expo Dev Server
npm start

# Hoặc chạy trực tiếp trên nền tảng cụ thể
npm run android   # Android
npm run ios       # iOS
npm run web       # Web
```

> **Lưu ý:** Project dùng `legacy-peer-deps=true` trong `.npmrc` để tương thích dependency. Không cần cấu hình thêm.

---

## 📜 Scripts

| Lệnh | Mô tả |
|---|---|
| `npm start` | Khởi động Expo Dev Server |
| `npm run android` | Chạy trên Android |
| `npm run ios` | Chạy trên iOS |
| `npm run web` | Chạy trên Web |
| `npm run gen-reports` | Tạo báo cáo `.docx` vào thư mục `reports/` |

---

## 🗃 Database

App sử dụng **SQLite cục bộ** (qua `expo-sqlite`), không cần backend hay kết nối internet.

### Các bảng dữ liệu

#### `questions` — Câu hỏi

| Cột | Kiểu | Mô tả |
|---|---|---|
| `id` | string | Mã định danh duy nhất |
| `content` | string | Nội dung câu hỏi |
| `correctOptionId` | string | ID đáp án đúng |
| `difficulty` | `easy` / `medium` / `hard` | Độ khó |
| `topic` | string | Chủ đề |
| `createdAt` | string (ISO) | Thời gian tạo |

#### `question_options` — Đáp án (4 đáp án / câu hỏi)

#### `exams` — Đề thi

| Cột | Kiểu | Mô tả |
|---|---|---|
| `id` | string | Mã định danh duy nhất |
| `title` | string | Tên đề thi |
| `description` | string | Mô tả / ghi chú |
| `duration` | number | Thời gian làm bài (phút) |
| `difficulty` | `easy` / `medium` / `hard` / `mixed` | Độ khó |
| `questionIds` | string[] | Danh sách ID câu hỏi |
| `createdAt` | string (ISO) | Thời gian tạo |

#### `exam_questions` — Bảng nối Exam <-> Question

#### `history` — Lịch sử (tối đa 50 mục gần nhất)

| Cột | Kiểu | Mô tả |
|---|---|---|
| `id` | string | Mã log |
| `message` | string | Nội dung thao tác |
| `timestamp` | string | Thời gian |
| `type` | `question` / `exam` | Loại thao tác |

---

## 🏗 Kiến trúc & State Management

### Context API + useReducer

Toàn bộ state được quản lý tập trung tại `context/AppContext.tsx`:

```ts
AppState {
  questions: Question[]
  exams:     Exam[]
  history:   HistoryEntry[]
  loaded:    boolean          // tránh ghi đè dữ liệu trước khi load xong
}
```

**Các action được hỗ trợ:**

- `LOAD` — Nạp dữ liệu từ SQLite khi khởi động
- `ADD_QUESTION` / `UPDATE_QUESTION` / `DELETE_QUESTION`
- `ADD_EXAM` / `DELETE_EXAM`
- `ADD_QUESTIONS_TO_EXAM` / `REMOVE_QUESTION_FROM_EXAM`
- `ADD_HISTORY`

> Khi xóa câu hỏi, reducer tự động xóa ID câu hỏi đó khỏi tất cả đề thi để tránh tham chiếu rỗng (dangling reference).

### Điều hướng — Expo Router

```
/(tabs)/        → Bottom Tab Navigator
/(stack)/       → Stack Navigator (modal & chi tiết)
```

`question-form` được mở dưới dạng **modal trượt từ dưới lên**.

---

## 📱 Màn hình chính

### Tab 1 — Ngân hàng câu hỏi (`index.tsx`)
- Danh sách câu hỏi với `FlatList`
- Tìm kiếm theo chủ đề, lọc theo độ khó
- Thêm (FAB), sửa (tap vào card), xóa (Alert xác nhận)

### Tab 2 — Đề thi (`exams.tsx`)
- Danh sách đề thi
- Tạo đề mới qua modal (tên, mô tả, thời gian, độ khó)
- Sau khi tạo → tự động chuyển sang màn chi tiết đề

### Tab 3 — Thống kê (`stats.tsx`)
- Tổng câu hỏi, tổng đề thi, trung bình câu/đề
- Phân bổ độ khó
- Top 5 chủ đề nhiều câu nhất
- Animation CountUp và slide/fade khi focus vào tab

### Tab 4 — Hướng dẫn (`guide.tsx`)
- Các section accordion có thể mở/đóng
- Animation `LayoutAnimation`

### Tab 5 — Lịch sử (`history.tsx`)
- Tổng số câu hỏi và đề thi đã lưu
- Danh sách 50 thao tác gần nhất với timestamp định dạng vi-VN

### Chi tiết đề thi (`exam-detail.tsx`)
- Xem, thêm (multi-select), xóa câu hỏi trong đề
- Lọc ngân hàng câu hỏi theo chủ đề / độ khó

---

## 👥 Thông tin nhóm

Xem màn hình **Lịch sử → Thông tin nhóm** trong app, hoặc truy cập route `/(stack)/team` để biết danh sách thành viên, MSSV, vai trò và phân công công việc.

---

## 📄 Giấy phép

Dự án bài tập lớn môn học — chỉ dùng cho mục đích học tập.
