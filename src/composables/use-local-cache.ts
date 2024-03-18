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
