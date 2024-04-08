import localforage from 'localforage'
import { name } from '@/../package.json'
import type { GameLevel } from '@/config/game'

localforage.config({
  name,
  storeName: 'records',
})

export interface RecordItem {
  level: GameLevel
  score: number
  durations: string
  startTime: string
  endTime: string
}

export type Language = 'zh-CN' | 'en-US' | 'ja-JP'

export const RECORD_KEY = 'record'

const HIGHEST_SCORE_KEY = 'highestScore.'

const LANGUAGE_KEY = 'memoryBlockLanguage'

// 获取最高分
export function getHighestScoreInHistory(level: GameLevel) {
  return localforage.getItem<number>(HIGHEST_SCORE_KEY + level, v => v ?? 0)
}

// 设置最高分
export function setHighestScoreInHistory(level: GameLevel, score: number) {
  localforage.setItem(HIGHEST_SCORE_KEY + level, score)
}

export function appendRecordToStore(record: RecordItem) {
  localforage.setItem(record.startTime, record)
}

export function getTargetDateRecords(date: string) {
  return localforage.getItem<RecordItem[]>(date)!
}

export async function getAllRecordsFromStore() {
  const _records = [] as RecordItem[]

  await localforage.iterate((value) => {
    _records.push(value as RecordItem)
  })

  return _records
}

// 获取语言
export const getLanguage = () => localStorage.getItem(LANGUAGE_KEY) ?? 'zh-CN'

// 设置语言
export function setLanguage(lang: Language = 'zh-CN') {
  localStorage.setItem(LANGUAGE_KEY, lang)
}
