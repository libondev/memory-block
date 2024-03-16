import LRUCache from '@/utils/lru-cache'

export default function (capacity: number = 10) {
  return new LRUCache(capacity)
}
