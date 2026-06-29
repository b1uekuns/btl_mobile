export type Difficulty = 'easy' | 'medium' | 'hard'
export type ExamDifficulty = Difficulty | 'mixed'

export interface QuestionOption {
  id: string
  text: string
}

export interface Question {
  id: string
  content: string
  options: QuestionOption[]
  correctOptionId: string
  difficulty: Difficulty
  topic: string
  createdAt: string
}

export interface Exam {
  id: string
  title: string
  description: string
  duration: number
  difficulty: ExamDifficulty
  questionIds: string[]
  createdAt: string
}

export interface HistoryEntry {
  id: string
  message: string
  timestamp: string
  type: 'question' | 'exam'
}

export interface CreateQuestionInput {
  content: string
  optionTexts: [string, string, string, string]
  correctOptionIndex: number
  difficulty: Difficulty
  topic: string
}

export interface CreateExamInput {
  title: string
  description: string
  duration: number
}
