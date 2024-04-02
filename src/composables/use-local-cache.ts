import localforage from 'localforage'
import { name } from '../../package.json'
import type { Level } from '@/config/game'

localforage.config({
  name,
  storeName: 'records',
})

export interface RecordItem {
  level: Level
  score: number
  durations: string
  startTime: string
  endTime: string
}

export const RECORD_KEY = 'record'

const HIGHEST_SCORE_KEY = 'highestScore.'

// 获取最高分
export function getHighestScoreInHistory(level: Level) {
  return localforage.getItem<number>(HIGHEST_SCORE_KEY + level, v => v ?? 0)
}

// 设置最高分
export function setHighestScoreInHistory(level: Level, scope: number) {
  localforage.setItem(HIGHEST_SCORE_KEY + level, scope)
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
