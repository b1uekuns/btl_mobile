import AsyncStorage from '@react-native-async-storage/async-storage'
import { Question, Exam, HistoryEntry } from '../types'

const KEYS = {
  QUESTIONS: '@quizmaker/questions',
  EXAMS: '@quizmaker/exams',
  HISTORY: '@quizmaker/history',
} as const

export async function loadQuestions(): Promise<Question[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.QUESTIONS)
    return raw ? (JSON.parse(raw) as Question[]) : []
  } catch {
    return []
  }
}

export async function saveQuestions(questions: Question[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.QUESTIONS, JSON.stringify(questions))
}

export async function loadExams(): Promise<Exam[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.EXAMS)
    return raw ? (JSON.parse(raw) as Exam[]) : []
  } catch {
    return []
  }
}

export async function saveExams(exams: Exam[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.EXAMS, JSON.stringify(exams))
}

export async function loadHistory(): Promise<HistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.HISTORY)
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : []
  } catch {
    return []
  }
}

export async function saveHistory(history: HistoryEntry[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.HISTORY, JSON.stringify(history))
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
