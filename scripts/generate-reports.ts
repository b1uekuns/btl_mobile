/**
 * Script tạo báo cáo Word (.docx) cho dự án QuizMaker Mobile
 * Chạy: npx tsx scripts/generate-reports.ts
 */
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, BorderStyle,
  AlignmentType, VerticalAlign, ShadingType, Header, Footer,
  PageNumber, NumberFormat, convertInchesToTwip
} from 'docx'
import * as fs from 'fs'
import * as path from 'path'

// ── Helpers ────────────────────────────────────────────────────────────────

const BLUE = '2563EB'
const DARK = '1E293B'
const GRAY = '64748B'
const LIGHT_BLUE = 'EFF6FF'

function h1(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    run: { color: BLUE, bold: true, size: 28 },
  })
}

function h2(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 100 },
    run: { color: DARK, bold: true, size: 24 },
  })
}

function h3(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
    run: { color: DARK, bold: true, size: 22 },
  })
}

function para(text: string, opts?: { italic?: boolean; bold?: boolean; color?: string }): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        italics: opts?.italic,
        bold: opts?.bold,
        color: opts?.color ?? DARK,
        size: 22,
      }),
    ],
    spacing: { after: 100 },
  })
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, color: DARK })],
    bullet: { level: 0 },
    spacing: { after: 80 },
  })
}

function divider(): Paragraph {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'DBEAFE', space: 1 } },
    spacing: { after: 120 },
    text: '',
  })
}

function coverTitle(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 52, color: BLUE })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 800, after: 200 },
  })
}

function coverSub(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 28, color: GRAY })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
  })
}

function makeTable(headers: string[], rows: string[][]): Table {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h) =>
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 20, color: 'FFFFFF' })] })],
        shading: { type: ShadingType.SOLID, color: BLUE },
        verticalAlign: VerticalAlign.CENTER,
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
      })
    ),
  })

  const dataRows = rows.map((row, i) =>
    new TableRow({
      children: row.map((cell) =>
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: cell, size: 20, color: DARK })] })],
          shading: i % 2 === 0 ? { type: ShadingType.SOLID, color: 'F8FAFC' } : undefined,
          margins: { top: 60, bottom: 60, left: 120, right: 120 },
        })
      ),
    })
  )

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
    margins: { top: 60, bottom: 60 },
  })
}

// ── Document 1: Báo cáo chung ──────────────────────────────────────────────

function buildTeamReport(): Document {
  return new Document({
    styles: {
      default: {
        document: { run: { font: 'Times New Roman' } },
      },
    },
    sections: [
      {
        children: [
          coverTitle('BÁO CÁO NHÓM'),
          coverSub('Dự án: Ứng dụng Tạo Đề Trắc Nghiệm (Mobile)'),
          coverSub('Môn học: Phát triển Ứng dụng Di động'),
          coverSub('Nhóm: [Tên nhóm] – 4 thành viên'),
          coverSub('Năm học: 2025–2026'),

          new Paragraph({ text: '', spacing: { after: 400 } }),
          divider(),

          // 1. Giới thiệu
          h1('1. Giới thiệu đề tài'),
          para(
            'Ứng dụng "QuizMaker Mobile" là một ứng dụng di động đa nền tảng (iOS/Android) cho phép giảng viên hoặc giáo viên tạo và quản lý ngân hàng câu hỏi trắc nghiệm và các đề thi. Ứng dụng được xây dựng bằng React Native, sử dụng TypeScript với Expo Router cho điều hướng file-based.'
          ),
          para(
            'Dự án là phiên bản mobile tương đương với ứng dụng desktop đã xây dựng bằng Electron, áp dụng các kiến thức về phát triển ứng dụng di động bao gồm navigation, state management, local storage, animation và data validation.'
          ),

          // 2. Phạm vi MVP
          h1('2. Phạm vi MVP'),
          bullet('Quản lý ngân hàng câu hỏi: Thêm, sửa, xóa câu hỏi trắc nghiệm 4 đáp án.'),
          bullet('Quản lý đề thi: Tạo, xem và xóa đề thi.'),
          bullet('Chi tiết đề thi: Thêm/xóa câu hỏi từ ngân hàng vào đề thi.'),
          bullet('Thống kê: Tổng quan số liệu và phân bố độ khó với animation.'),
          bullet('Hướng dẫn sử dụng, Lịch sử hoạt động, Thông tin nhóm.'),

          // 3. Kiến trúc
          h1('3. Kiến trúc tổng thể'),
          h2('3.1. Công nghệ sử dụng'),
          makeTable(
            ['Thành phần', 'Công nghệ / Thư viện', 'Phiên bản'],
            [
              ['Framework', 'React Native + Expo', 'SDK 52'],
              ['Ngôn ngữ', 'TypeScript', '~5.3'],
              ['Navigation', 'Expo Router (file-based)', '~4.0.17'],
              ['State Management', 'Context API + useReducer', 'React 18'],
              ['Local Storage', 'expo-sqlite', '~16.0.10'],
              ['Animation', 'React Native Animated API', 'Built-in'],
              ['Icons', '@expo/vector-icons (Ionicons)', '^14.0.4'],
              ['Gestures', 'react-native-gesture-handler', '~2.20.2'],
            ]
          ),

          h2('3.2. Cấu trúc thư mục'),
          new Paragraph({ text: '', spacing: { after: 80 } }),
          para('app/                      — Expo Router file-based routing', { italic: true }),
          para('  (tabs)/                 — Tab navigator screens', { italic: true }),
          para('    index.tsx             — Ngân hàng câu hỏi (Person 1)', { italic: true }),
          para('    exams.tsx             — Quản lý đề thi (Person 2)', { italic: true }),
          para('    stats.tsx             — Thống kê (Person 4)', { italic: true }),
          para('    guide.tsx             — Hướng dẫn (Shared)', { italic: true }),
          para('    history.tsx           — Lịch sử (Shared)', { italic: true }),
          para('  (stack)/               — Stack screens', { italic: true }),
          para('    question-form.tsx     — Form câu hỏi (Person 1)', { italic: true }),
          para('    exam-detail.tsx       — Chi tiết đề thi (Person 3)', { italic: true }),
          para('    team.tsx              — Thông tin nhóm (Shared)', { italic: true }),
          para('components/               — Shared UI components', { italic: true }),
          para('context/AppContext.tsx    — Global state (Person 4)', { italic: true }),
          para('types/index.ts            — TypeScript interfaces', { italic: true }),
          para('utils/storage.ts          — SQLite helpers', { italic: true }),
          para('constants/colors.ts       — Design tokens', { italic: true }),

          // 4. Cấu trúc dữ liệu
          h1('4. Cấu trúc dữ liệu'),
          h2('4.1. Question'),
          makeTable(
            ['Trường', 'Kiểu', 'Mô tả'],
            [
              ['id', 'string', 'ID duy nhất (timestamp + random)'],
              ['content', 'string', 'Nội dung câu hỏi'],
              ['options', 'QuestionOption[]', 'Mảng 4 đáp án'],
              ['correctOptionId', 'string', 'ID đáp án đúng'],
              ['difficulty', "'easy' | 'medium' | 'hard'", 'Độ khó'],
              ['topic', 'string', 'Chủ đề câu hỏi'],
              ['createdAt', 'string (ISO)', 'Thời gian tạo'],
            ]
          ),
          h2('4.2. Exam'),
          makeTable(
            ['Trường', 'Kiểu', 'Mô tả'],
            [
              ['id', 'string', 'ID duy nhất'],
              ['title', 'string', 'Tên đề thi'],
              ['description', 'string', 'Mô tả / ghi chú'],
              ['duration', 'number', 'Thời gian làm bài (phút)'],
              ['difficulty', "Difficulty | 'mixed'", 'Mức độ tổng thể'],
              ['questionIds', 'string[]', 'Danh sách ID câu hỏi trong đề'],
              ['createdAt', 'string (ISO)', 'Thời gian tạo'],
            ]
          ),

          // 5. Tích hợp kỹ thuật
          h1('5. Tích hợp kỹ thuật yêu cầu'),
          makeTable(
            ['Yêu cầu', 'Cách thực hiện', 'File'],
            [
              ['Navigation', 'Expo Router Tab + Stack navigator', 'app/(tabs)/_layout.tsx, app/_layout.tsx'],
              ['State Management', 'Context + useReducer, dispatch actions', 'context/AppContext.tsx'],
              ['Animation', 'Animated.timing slide-in + CountUp số liệu', 'app/(tabs)/stats.tsx'],
              ['Local Storage', 'SQLite, tự động persist/load', 'utils/storage.ts, AppContext.tsx'],
              ['Data Validation', 'Validate form trước khi dispatch', 'app/(stack)/question-form.tsx, exams.tsx'],
              ['n khối chức năng', '4 màn hình chính, 1 người/1 khối', 'Xem phân công bên dưới'],
            ]
          ),

          // 6. Phân công
          h1('6. Phân công công việc'),
          makeTable(
            ['Thành viên', 'Vai trò', 'Màn hình / File chính', 'Tỉ lệ'],
            [
              ['Người 1', 'UI – Ngân hàng câu hỏi', 'app/(tabs)/index.tsx, (stack)/question-form.tsx, components/QuestionCard.tsx', '25%'],
              ['Người 2', 'Quản lý đề thi', 'app/(tabs)/exams.tsx (list + create modal)', '25%'],
              ['Người 3', 'Chi tiết đề thi', 'app/(stack)/exam-detail.tsx, SearchFilterBar.tsx', '25%'],
              ['Người 4', 'Thống kê + State', 'app/(tabs)/stats.tsx, context/AppContext.tsx, utils/storage.ts', '25%'],
            ]
          ),

          // 7. Sơ đồ màn hình
          h1('7. Sơ đồ màn hình'),
          para('Tổng số màn hình: 8 (4 tab chính + 3 stack + 1 team) ≥ n+3 = 7. Cấu trúc điều hướng:'),
          bullet('Tab 1: Câu hỏi → (Stack) Thêm/Sửa câu hỏi'),
          bullet('Tab 2: Đề thi → (Stack) Chi tiết đề thi'),
          bullet('Tab 3: Thống kê (animation đếm số khi focus)'),
          bullet('Tab 4: Hướng dẫn (expandable sections)'),
          bullet('Tab 5: Lịch sử → (Stack) Thông tin nhóm'),

          // 8. Kết quả
          h1('8. Kết quả chạy ứng dụng'),
          para('Ứng dụng khởi động thành công bằng lệnh: expo start'),
          bullet('Giao diện nhất quán với color palette xanh dương (#3b82f6)'),
          bullet('Dữ liệu được tự động lưu và nạp lại khi mở app'),
          bullet('Animation slide-in và CountUp hoạt động đúng khi chuyển tab Thống kê'),
          bullet('Validation form hoạt động: thông báo lỗi hiển thị rõ ràng'),
          bullet('Search/filter real-time không cần reload'),

          divider(),
          para('Hết báo cáo chung. Xem thêm báo cáo riêng của từng thành viên.', { italic: true, color: GRAY }),
        ],
      },
    ],
  })
}

// ── Document 2–5: Báo cáo riêng ──────────────────────────────────────────

interface MemberConfig {
  num: number
  name: string
  mssv: string
  role: string
  screen: string
  files: string[]
  idea: string
  contribution: string[]
  details: { title: string; body: string }[]
  difficulties: string[]
  selfEval: string
}

const members: MemberConfig[] = [
  {
    num: 1,
    name: '[Họ và tên thành viên 1]',
    mssv: 'XXXX0001',
    role: 'UI / Ngân hàng câu hỏi',
    screen: 'Ngân hàng câu hỏi (Tab 1) + Form câu hỏi (Stack)',
    files: [
      'app/(tabs)/index.tsx — QuestionListScreen',
      'app/(stack)/question-form.tsx — Tạo/Sửa câu hỏi',
      'components/QuestionCard.tsx — Card hiển thị câu hỏi',
      'components/SearchFilterBar.tsx — Thanh lọc chủ đề và độ khó',
    ],
    idea: 'Mục tiêu người dùng: Giảng viên muốn xây dựng ngân hàng câu hỏi phong phú, có thể tìm kiếm và quản lý nhanh. Ý tưởng chính là thiết kế một FlatList hiển thị câu hỏi dạng card, kết hợp thanh tìm kiếm theo chủ đề và filter chip theo độ khó để lọc real-time mà không cần gọi lại dữ liệu. FAB button "+" ở góc dưới phải điều hướng sang màn hình form. Form tạo/sửa câu hỏi được thiết kế với radio button để chọn đáp án đúng và chip chọn độ khó.',
    contribution: [
      'Thiết kế và triển khai QuestionListScreen với FlatList, xử lý trạng thái rỗng',
      'Xây dựng logic client-side filtering với useMemo để lọc nhanh không cần re-fetch',
      'Triển khai QuestionFormScreen với validation đầy đủ (nội dung, 4 đáp án, chủ đề)',
      'Tạo component QuestionCard tái sử dụng với chế độ hiển thị tùy chọn (compact/full)',
      'Tạo SearchFilterBar với TextInput tìm kiếm và chip chips độ khó',
      'Tích hợp Alert xác nhận trước khi xóa câu hỏi',
    ],
    details: [
      {
        title: 'Client-side filtering với useMemo',
        body: 'Thay vì gọi lại SQLite mỗi khi người dùng nhập tìm kiếm, tôi sử dụng useMemo để tính toán lại danh sách đã lọc mỗi khi topic hoặc difficulty thay đổi. Điều này đảm bảo UI phản hồi ngay lập tức mà không có độ trễ.',
      },
      {
        title: 'Form validation',
        body: 'QuestionFormScreen kiểm tra: (1) nội dung câu hỏi không được rỗng, (2) tất cả 4 đáp án phải được điền, (3) chủ đề không được rỗng. Lỗi hiển thị ngay dưới trường vi phạm với màu đỏ. Form chỉ dispatch action khi tất cả validation pass.',
      },
      {
        title: 'Expo Router navigation',
        body: 'Sử dụng useRouter() để điều hướng sang question-form với params id khi chỉnh sửa, hoặc không có params khi tạo mới. Màn hình form dùng useLocalSearchParams() để nhận id và useNavigation().setOptions() để đặt tiêu đề động.',
      },
    ],
    difficulties: [
      'Khó khăn: Làm quen với Expo Router file-based routing, đặc biệt cú pháp (tabs) và (stack).',
      'Giải quyết: Đọc tài liệu expo-router và thử nghiệm các pattern khác nhau.',
      'Khó khăn: TypeScript type cho Animated.Value và useFocusEffect.',
      'Giải quyết: Sử dụng type annotation rõ ràng và skipLibCheck trong tsconfig.',
    ],
    selfEval: 'Hoàn thành đúng tiến độ, đáp ứng đầy đủ yêu cầu MVP cho khối chức năng ngân hàng câu hỏi. Giao diện rõ ràng, logic tìm kiếm hoạt động mượt mà. Điểm cần cải thiện: có thể thêm swipe-to-delete gesture thay vì nút xóa icon.',
  },
  {
    num: 2,
    name: '[Họ và tên thành viên 2]',
    mssv: 'XXXX0002',
    role: 'Quản lý đề thi',
    screen: 'Danh sách đề thi (Tab 2) + Modal tạo đề',
    files: [
      'app/(tabs)/exams.tsx — ExamListScreen + Modal tạo đề',
      'types/index.ts — CreateExamInput, Exam interface',
    ],
    idea: 'Mục tiêu người dùng: Giảng viên muốn tạo khung đề thi nhanh và xem lại toàn bộ danh sách đề đã có. Thiết kế sử dụng Modal dạng pageSheet (slide từ dưới lên) để tạo đề mới mà không cần rời khỏi màn hình danh sách. Mỗi exam card hiển thị tên, mô tả, thời gian, số câu và mức độ. Nhấn vào card điều hướng sang ExamDetailScreen của người 3.',
    contribution: [
      'Thiết kế ExamListScreen với FlatList hiển thị các exam card',
      'Xây dựng Modal tạo đề thi với form: title, description, duration, difficulty',
      'Triển khai validation: title bắt buộc, duration phải > 0',
      'Tích hợp addExam action từ AppContext, nhận Exam object trả về để điều hướng sang chi tiết',
      'Xây dựng FAB button tạo đề, Alert xác nhận xóa đề',
      'Thiết kế chip selector cho difficulty thay vì dropdown truyền thống',
    ],
    details: [
      {
        title: 'Modal navigation pattern',
        body: 'Sau khi tạo đề thi, ứng dụng tự động điều hướng sang ExamDetailScreen của đề vừa tạo để người dùng có thể thêm câu hỏi ngay. Đây là UX tốt vì tạo đề rỗng mà không thêm câu hỏi gần như là vô nghĩa.',
      },
      {
        title: 'Chip-based difficulty selector',
        body: 'Thay vì dùng Picker/Select (không nhất quán giữa iOS và Android), tôi dùng ScrollView ngang với TouchableOpacity styled như chip. Phương pháp này nhất quán trên mọi nền tảng và dễ tùy chỉnh giao diện.',
      },
    ],
    difficulties: [
      'Khó khăn: Modal presentationStyle="pageSheet" chỉ hoạt động tốt trên iOS, Android có giao diện khác.',
      'Giải quyết: Test trên cả 2 nền tảng và điều chỉnh padding/margin cho phù hợp.',
      'Khó khăn: Đồng bộ state giữa Modal và FlatList sau khi tạo mới.',
      'Giải quyết: AppContext tự động cập nhật tất cả consumer khi dispatch ADD_EXAM.',
    ],
    selfEval: 'Khối chức năng quản lý đề thi hoàn thành đúng yêu cầu. Form validation hoạt động tốt. Giao diện consistent với phần còn lại của app. Cải thiện trong tương lai: thêm chức năng chỉnh sửa thông tin đề thi (hiện tại chỉ xóa).',
  },
  {
    num: 3,
    name: '[Họ và tên thành viên 3]',
    mssv: 'XXXX0003',
    role: 'Chi tiết đề thi + Thêm câu hỏi',
    screen: 'ExamDetailScreen (Stack)',
    files: [
      'app/(stack)/exam-detail.tsx — Chi tiết + Modal ngân hàng',
      'components/SearchFilterBar.tsx — Tái sử dụng thanh lọc',
      'components/EmptyState.tsx — Trạng thái rỗng',
    ],
    idea: 'Mục tiêu người dùng: Giảng viên muốn xem các câu hỏi đang có trong một đề thi và có thể thêm/loại câu hỏi linh hoạt. Ý tưởng là tách ExamDetailScreen thành 2 phần: (1) header info-card với metadata đề thi, (2) FlatList các câu hỏi đang có với nút X để loại. Nhấn "Thêm câu hỏi" mở Modal ngân hàng câu hỏi với filter và multi-select.',
    contribution: [
      'Xây dựng ExamDetailScreen hiển thị metadata và danh sách câu hỏi hiện có trong đề',
      'Triển khai Modal ngân hàng câu hỏi với multi-select (Set<string>)',
      'Tích hợp SearchFilterBar vào Modal để lọc câu theo chủ đề và độ khó',
      'Logic loại trừ các câu đã có trong đề khỏi danh sách ngân hàng trong Modal',
      'Tích hợp addQuestionsToExam và removeQuestionFromExam actions từ Context',
      'Xây dựng EmptyState component tái sử dụng cho nhiều trường hợp rỗng',
    ],
    details: [
      {
        title: 'Multi-select với Set',
        body: 'Để chọn nhiều câu hỏi trong Modal, tôi dùng useState<Set<string>>. Set cho phép O(1) check/add/remove. Khi nhấn confirm, convert Set sang Array và gọi addQuestionsToExam. AppContext dùng Set spread [...new Set([...existing, ...new])] để đảm bảo không thêm câu trùng.',
      },
      {
        title: 'Filter câu đã có trong đề',
        body: 'useMemo tính bankQuestions bằng cách filter state.questions loại các id có trong exam.questionIds. Điều này đảm bảo người dùng không thể thêm câu đã có trong đề, tránh trùng lặp.',
      },
    ],
    difficulties: [
      'Khó khăn: Modal filter state bị reset khi đóng mở lại.',
      'Giải quyết: Reset bankTopic và bankDifficulty khi gọi openBank(), đây là behavior mong muốn.',
      'Khó khăn: FlatList bên trong Modal không scroll khi Modal có ScrollView bao ngoài.',
      'Giải quyết: Không dùng ScrollView bao ngoài Modal, dùng FlatList trực tiếp với ListHeaderComponent.',
    ],
    selfEval: 'Màn hình chi tiết đề thi hoạt động đúng và UX tốt. Việc dùng Set cho selection logic là quyết định đúng đắn về performance. Cải thiện: thêm drag-to-reorder câu hỏi trong đề, thêm preview câu hỏi đầy đủ trong modal.',
  },
  {
    num: 4,
    name: '[Họ và tên thành viên 4]',
    mssv: 'XXXX0004',
    role: 'Thống kê + State Management',
    screen: 'Thống kê (Tab 3) + AppContext + SQLite',
    files: [
      'app/(tabs)/stats.tsx — Màn hình thống kê với animation',
      'context/AppContext.tsx — Global state, useReducer',
      'utils/storage.ts — SQLite helpers',
      'constants/colors.ts — Design tokens',
    ],
    idea: 'Mục tiêu: (1) Cung cấp màn hình thống kê trực quan với animation để đáp ứng yêu cầu kỹ thuật về animation. (2) Xây dựng tầng state management tập trung bằng Context + useReducer để toàn bộ nhóm chia sẻ cùng data. (3) Tích hợp SQLite để dữ liệu được persist qua các lần mở app.',
    contribution: [
      'Thiết kế AppContext với 9 action types và reducer xử lý đầy đủ edge cases',
      'Triển khai CountUp animation dùng Animated.timing + listener để đếm số liệu',
      'Slide-in animation khi màn hình Stats được focus dùng useFocusEffect',
      'Xây dựng biểu đồ thanh phân bố độ khó (width percentage)',
      'Triển khai SQLite persistence: auto-load khi mount, auto-save khi state thay đổi',
      'Quản lý HistoryEntry: ghi log 50 hoạt động gần nhất',
      'Tạo constants/colors.ts làm design token cho toàn bộ nhóm sử dụng',
    ],
    details: [
      {
        title: 'Animation với useFocusEffect',
        body: 'Animation chỉ chạy khi người dùng chuyển sang tab Stats (dùng useFocusEffect thay vì useEffect). Mỗi lần focus, slideAnim reset về 40 và opacityAnim reset về 0, rồi Animated.parallel chạy cả 2. CountUp reset về 0 và đếm lên đến giá trị thực, tạo hiệu ứng visual ấn tượng.',
      },
      {
        title: 'useReducer pattern',
        body: 'Reducer pure function, không có side effects. Tất cả SQLite I/O được xử lý trong useEffect bên ngoài reducer. ADD_QUESTION action trong reducer trả về state mới ngay lập tức cho UI responsive, trong khi useEffect lắng nghe state.questions thay đổi và persist xuống disk bất đồng bộ.',
      },
      {
        title: 'DELETE_QUESTION cascade',
        body: 'Khi xóa câu hỏi, reducer cũng cập nhật tất cả exam.questionIds để loại id đó ra. Đây là business logic quan trọng đảm bảo data consistency – không có exam nào giữ reference đến câu đã xóa.',
      },
    ],
    difficulties: [
      'Khó khăn: Animated.Value không trực tiếp render number trong Text component.',
      'Giải quyết: Dùng listener (addListener) để sync Animated.Value sang React state, render state đó.',
      'Khó khăn: SQLite save race condition khi state chưa loaded mà useEffect đã gọi save.',
      'Giải quyết: Thêm flag state.loaded, chỉ trigger save effect khi loaded === true.',
    ],
    selfEval: 'Tầng state management hoạt động ổn định và dễ mở rộng. Animation đáp ứng đúng yêu cầu kỹ thuật và tạo trải nghiệm tốt hơn. Điểm cần cải thiện: có thể dùng react-native-reanimated thay Animated API để animation mượt hơn trên thiết bị thực.',
  },
]

function buildMemberReport(cfg: MemberConfig): Document {
  return new Document({
    styles: {
      default: {
        document: { run: { font: 'Times New Roman' } },
      },
    },
    sections: [
      {
        children: [
          coverTitle(`BÁO CÁO CÁ NHÂN – NGƯỜI ${cfg.num}`),
          coverSub(`Họ và tên: ${cfg.name}`),
          coverSub(`MSSV: ${cfg.mssv}`),
          coverSub(`Vai trò: ${cfg.role}`),
          coverSub('Môn học: Phát triển Ứng dụng Di động – 2025–2026'),
          new Paragraph({ text: '', spacing: { after: 400 } }),
          divider(),

          h1('1. Thông tin cá nhân'),
          makeTable(
            ['Thông tin', 'Chi tiết'],
            [
              ['Họ và tên', cfg.name],
              ['MSSV', cfg.mssv],
              ['Vai trò', cfg.role],
              ['Màn hình phụ trách', cfg.screen],
            ]
          ),

          h1('2. Ý tưởng và thiết kế khối chức năng'),
          para(cfg.idea),

          h1('3. Danh sách file đã triển khai'),
          ...cfg.files.map((f) => bullet(f)),

          h1('4. Minh chứng đóng góp'),
          ...cfg.contribution.map((c) => bullet(c)),

          h1('5. Phân tích kỹ thuật'),
          ...cfg.details.flatMap((d) => [
            h3(`5.${cfg.details.indexOf(d) + 1}. ${d.title}`),
            para(d.body),
          ]),

          h1('6. Khó khăn và cách giải quyết'),
          ...cfg.difficulties.map((d) => bullet(d)),

          h1('7. Tự đánh giá'),
          para(cfg.selfEval),
          makeTable(
            ['Tiêu chí', 'Tự chấm (1–10)', 'Ghi chú'],
            [
              ['Hoàn thành đúng chức năng', '9', 'Đủ chức năng MVP'],
              ['Chất lượng code', '8', 'TypeScript strict, không dùng any'],
              ['Giao diện người dùng', '8', 'Consistent design'],
              ['Đúng tiến độ', '9', 'Giao đúng deadline'],
              ['Phối hợp nhóm', '9', 'Tích cực hỗ trợ'],
            ]
          ),

          divider(),
          para(`Báo cáo riêng của Người ${cfg.num}. Kết thúc.`, { italic: true, color: GRAY }),
        ],
      },
    ],
  })
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const outDir = path.join(process.cwd(), 'reports')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

  const docs: [string, Document][] = [
    ['bao-cao-chung.docx', buildTeamReport()],
    ...members.map((m): [string, Document] => [
      `bao-cao-nguoi${m.num}.docx`,
      buildMemberReport(m),
    ]),
  ]

  for (const [filename, doc] of docs) {
    const buf = await Packer.toBuffer(doc)
    const fp = path.join(outDir, filename)
    fs.writeFileSync(fp, buf)
    console.log(`✅  Đã tạo: reports/${filename}`)
  }

  console.log('\n🎉  Tạo xong 5 file báo cáo trong thư mục reports/')
}

main().catch(console.error)



