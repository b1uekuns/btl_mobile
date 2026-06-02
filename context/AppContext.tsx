import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { Question, Exam, HistoryEntry, CreateQuestionInput, CreateExamInput } from '../types'
import {
  loadQuestions, saveQuestions,
  loadExams, saveExams,
  loadHistory, saveHistory,
  generateId
} from '../utils/storage'

// ── State ──────────────────────────────────────────────────────────────────
interface AppState {
  questions: Question[]
  exams: Exam[]
  history: HistoryEntry[]
  loaded: boolean
}

// ── Actions ────────────────────────────────────────────────────────────────
type Action =
  | { type: 'LOAD'; questions: Question[]; exams: Exam[]; history: HistoryEntry[] }
  | { type: 'ADD_QUESTION'; question: Question }
  | { type: 'UPDATE_QUESTION'; question: Question }
  | { type: 'DELETE_QUESTION'; id: string }
  | { type: 'ADD_EXAM'; exam: Exam }
  | { type: 'DELETE_EXAM'; id: string }
  | { type: 'ADD_QUESTIONS_TO_EXAM'; examId: string; questionIds: string[] }
  | { type: 'REMOVE_QUESTION_FROM_EXAM'; examId: string; questionId: string }
  | { type: 'ADD_HISTORY'; entry: HistoryEntry }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD':
      return { ...state, questions: action.questions, exams: action.exams, history: action.history, loaded: true }
    case 'ADD_QUESTION':
      return { ...state, questions: [action.question, ...state.questions] }
    case 'UPDATE_QUESTION':
      return { ...state, questions: state.questions.map(q => q.id === action.question.id ? action.question : q) }
    case 'DELETE_QUESTION': {
      const exams = state.exams.map(e => ({
        ...e, questionIds: e.questionIds.filter(id => id !== action.id)
      }))
      return { ...state, questions: state.questions.filter(q => q.id !== action.id), exams }
    }
    case 'ADD_EXAM':
      return { ...state, exams: [action.exam, ...state.exams] }
    case 'DELETE_EXAM':
      return { ...state, exams: state.exams.filter(e => e.id !== action.id) }
    case 'ADD_QUESTIONS_TO_EXAM':
      return {
        ...state,
        exams: state.exams.map(e =>
          e.id === action.examId
            ? { ...e, questionIds: [...new Set([...e.questionIds, ...action.questionIds])] }
            : e
        )
      }
    case 'REMOVE_QUESTION_FROM_EXAM':
      return {
        ...state,
        exams: state.exams.map(e =>
          e.id === action.examId
            ? { ...e, questionIds: e.questionIds.filter(id => id !== action.questionId) }
            : e
        )
      }
    case 'ADD_HISTORY':
      return { ...state, history: [action.entry, ...state.history].slice(0, 50) }
    default:
      return state
  }
}

// ── Context ────────────────────────────────────────────────────────────────
interface AppContextValue {
  state: AppState
  addQuestion: (input: CreateQuestionInput) => void
  updateQuestion: (id: string, input: CreateQuestionInput) => void
  deleteQuestion: (id: string) => void
  addExam: (input: CreateExamInput) => Exam
  deleteExam: (id: string) => void
  addQuestionsToExam: (examId: string, questionIds: string[]) => void
  removeQuestionFromExam: (examId: string, questionId: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [state, dispatch] = useReducer(reducer, {
    questions: [], exams: [], history: [], loaded: false
  })

  // Load from AsyncStorage on mount
  useEffect(() => {
    Promise.all([loadQuestions(), loadExams(), loadHistory()]).then(
      ([questions, exams, history]) => dispatch({ type: 'LOAD', questions, exams, history })
    )
  }, [])

  // Persist whenever data changes (skip before first load)
  useEffect(() => {
    if (!state.loaded) return
    saveQuestions(state.questions)
    saveExams(state.exams)
    saveHistory(state.history)
  }, [state.questions, state.exams, state.history, state.loaded])

  const addHistory = useCallback((message: string, type: 'question' | 'exam') => {
    dispatch({ type: 'ADD_HISTORY', entry: { id: generateId(), message, type, timestamp: new Date().toISOString() } })
  }, [])

  const addQuestion = useCallback((input: CreateQuestionInput) => {
    const options = input.optionTexts.map((text, i) => ({ id: generateId(), text }))
    const question: Question = {
      id: generateId(),
      content: input.content.trim(),
      options,
      correctOptionId: options[input.correctOptionIndex].id,
      difficulty: input.difficulty,
      topic: input.topic.trim(),
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_QUESTION', question })
    addHistory(`Đã thêm câu hỏi: "${question.content.substring(0, 40)}..."`, 'question')
  }, [addHistory])

  const updateQuestion = useCallback((id: string, input: CreateQuestionInput) => {
    const options = input.optionTexts.map((text, i) => ({ id: generateId(), text }))
    const question: Question = {
      id,
      content: input.content.trim(),
      options,
      correctOptionId: options[input.correctOptionIndex].id,
      difficulty: input.difficulty,
      topic: input.topic.trim(),
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: 'UPDATE_QUESTION', question })
    addHistory(`Đã cập nhật câu hỏi: "${question.content.substring(0, 40)}..."`, 'question')
  }, [addHistory])

  const deleteQuestion = useCallback((id: string) => {
    dispatch({ type: 'DELETE_QUESTION', id })
    addHistory('Đã xóa 1 câu hỏi', 'question')
  }, [addHistory])

  const addExam = useCallback((input: CreateExamInput): Exam => {
    const exam: Exam = {
      id: generateId(),
      title: input.title.trim(),
      description: input.description.trim(),
      duration: input.duration,
      difficulty: input.difficulty,
      questionIds: [],
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_EXAM', exam })
    addHistory(`Đã tạo đề thi: "${exam.title}"`, 'exam')
    return exam
  }, [addHistory])

  const deleteExam = useCallback((id: string) => {
    dispatch({ type: 'DELETE_EXAM', id })
    addHistory('Đã xóa 1 đề thi', 'exam')
  }, [addHistory])

  const addQuestionsToExam = useCallback((examId: string, questionIds: string[]) => {
    dispatch({ type: 'ADD_QUESTIONS_TO_EXAM', examId, questionIds })
    addHistory(`Đã thêm ${questionIds.length} câu hỏi vào đề thi`, 'exam')
  }, [addHistory])

  const removeQuestionFromExam = useCallback((examId: string, questionId: string) => {
    dispatch({ type: 'REMOVE_QUESTION_FROM_EXAM', examId, questionId })
    addHistory('Đã xóa 1 câu hỏi khỏi đề thi', 'exam')
  }, [addHistory])

  return (
    <AppContext.Provider value={{
      state, addQuestion, updateQuestion, deleteQuestion,
      addExam, deleteExam, addQuestionsToExam, removeQuestionFromExam
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
