import * as SQLite from 'expo-sqlite'
import { Exam, HistoryEntry, Question } from '../types'

const DB_NAME = 'quizmaker.db'

interface QuestionRow {
  id: string
  content: string
  correctOptionId: string
  difficulty: Question['difficulty']
  topic: string
  createdAt: string
}

interface QuestionOptionRow {
  id: string
  questionId: string
  text: string
  sortOrder: number
}

interface ExamRow {
  id: string
  title: string
  description: string
  duration: number
  difficulty: Exam['difficulty']
  createdAt: string
}

interface ExamQuestionRow {
  examId: string
  questionId: string
  sortOrder: number
}

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME).then(async (db) => {
      await initDb(db)
      return db
    })
  }
  return dbPromise
}

async function initDb(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY NOT NULL,
      content TEXT NOT NULL,
      correctOptionId TEXT NOT NULL,
      difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
      topic TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS question_options (
      id TEXT PRIMARY KEY NOT NULL,
      questionId TEXT NOT NULL,
      text TEXT NOT NULL,
      sortOrder INTEGER NOT NULL,
      FOREIGN KEY (questionId) REFERENCES questions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS exams (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      duration INTEGER NOT NULL,
      difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'mixed')),
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS exam_questions (
      examId TEXT NOT NULL,
      questionId TEXT NOT NULL,
      sortOrder INTEGER NOT NULL,
      PRIMARY KEY (examId, questionId),
      FOREIGN KEY (examId) REFERENCES exams(id) ON DELETE CASCADE,
      FOREIGN KEY (questionId) REFERENCES questions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS history (
      id TEXT PRIMARY KEY NOT NULL,
      message TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('question', 'exam'))
    );

    CREATE INDEX IF NOT EXISTS idx_question_options_question_id ON question_options(questionId);
    CREATE INDEX IF NOT EXISTS idx_exam_questions_exam_id ON exam_questions(examId);
    CREATE INDEX IF NOT EXISTS idx_history_timestamp ON history(timestamp);
  `)
}

export async function loadQuestions(): Promise<Question[]> {
  try {
    const db = await getDb()
    const rows = await db.getAllAsync<QuestionRow>('SELECT * FROM questions ORDER BY createdAt DESC')
    const optionRows = await db.getAllAsync<QuestionOptionRow>(
      'SELECT * FROM question_options ORDER BY questionId, sortOrder ASC'
    )

    const optionsByQuestion = new Map<string, QuestionOptionRow[]>()
    optionRows.forEach((option) => {
      const existing = optionsByQuestion.get(option.questionId) ?? []
      existing.push(option)
      optionsByQuestion.set(option.questionId, existing)
    })

    return rows.map((row) => ({
      id: row.id,
      content: row.content,
      options: (optionsByQuestion.get(row.id) ?? []).map((option) => ({
        id: option.id,
        text: option.text,
      })),
      correctOptionId: row.correctOptionId,
      difficulty: row.difficulty,
      topic: row.topic,
      createdAt: row.createdAt,
    }))
  } catch (error) {
    console.warn('Failed to load questions from SQLite', error)
    return []
  }
}

export async function loadExams(): Promise<Exam[]> {
  try {
    const db = await getDb()
    const rows = await db.getAllAsync<ExamRow>('SELECT * FROM exams ORDER BY createdAt DESC')
    const linkRows = await db.getAllAsync<ExamQuestionRow>(
      'SELECT * FROM exam_questions ORDER BY examId, sortOrder ASC'
    )

    const questionIdsByExam = new Map<string, string[]>()
    linkRows.forEach((link) => {
      const existing = questionIdsByExam.get(link.examId) ?? []
      existing.push(link.questionId)
      questionIdsByExam.set(link.examId, existing)
    })

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      duration: row.duration,
      difficulty: row.difficulty,
      questionIds: questionIdsByExam.get(row.id) ?? [],
      createdAt: row.createdAt,
    }))
  } catch (error) {
    console.warn('Failed to load exams from SQLite', error)
    return []
  }
}

export async function loadHistory(): Promise<HistoryEntry[]> {
  try {
    const db = await getDb()
    return await db.getAllAsync<HistoryEntry>('SELECT * FROM history ORDER BY timestamp DESC LIMIT 50')
  } catch (error) {
    console.warn('Failed to load history from SQLite', error)
    return []
  }
}

let saveQueue = Promise.resolve()

export function saveAllData(
  questions: Question[],
  exams: Exam[],
  history: HistoryEntry[]
): Promise<void> {
  saveQueue = saveQueue
    .catch(() => undefined)
    .then(() => replaceAllData(questions, exams, history))
  return saveQueue
}

async function replaceAllData(
  questions: Question[],
  exams: Exam[],
  history: HistoryEntry[]
): Promise<void> {
  const db = await getDb()
  const validQuestionIds = new Set(questions.map((question) => question.id))

  await db.withTransactionAsync(async () => {
    await db.execAsync(`
      PRAGMA foreign_keys = ON;
      DELETE FROM exam_questions;
      DELETE FROM question_options;
      DELETE FROM history;
      DELETE FROM exams;
      DELETE FROM questions;
    `)

    for (const question of questions) {
      await db.runAsync(
        `INSERT INTO questions (id, content, correctOptionId, difficulty, topic, createdAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        question.id,
        question.content,
        question.correctOptionId,
        question.difficulty,
        question.topic,
        question.createdAt
      )

      for (const [index, option] of question.options.entries()) {
        await db.runAsync(
          `INSERT INTO question_options (id, questionId, text, sortOrder)
           VALUES (?, ?, ?, ?)`,
          option.id,
          question.id,
          option.text,
          index
        )
      }
    }

    for (const exam of exams) {
      await db.runAsync(
        `INSERT INTO exams (id, title, description, duration, difficulty, createdAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        exam.id,
        exam.title,
        exam.description,
        exam.duration,
        exam.difficulty,
        exam.createdAt
      )

      const persistedQuestionIds = exam.questionIds.filter((questionId) => validQuestionIds.has(questionId))
      for (const [index, questionId] of persistedQuestionIds.entries()) {
        await db.runAsync(
          `INSERT INTO exam_questions (examId, questionId, sortOrder)
           VALUES (?, ?, ?)`,
          exam.id,
          questionId,
          index
        )
      }
    }

    for (const entry of history.slice(0, 50)) {
      await db.runAsync(
        `INSERT INTO history (id, message, timestamp, type)
         VALUES (?, ?, ?, ?)`,
        entry.id,
        entry.message,
        entry.timestamp,
        entry.type
      )
    }
  })
}

export async function saveQuestions(questions: Question[]): Promise<void> {
  await saveAllData(questions, await loadExams(), await loadHistory())
}

export async function saveExams(exams: Exam[]): Promise<void> {
  await saveAllData(await loadQuestions(), exams, await loadHistory())
}

export async function saveHistory(history: HistoryEntry[]): Promise<void> {
  await saveAllData(await loadQuestions(), await loadExams(), history)
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}
