import type { LEVEL_GRIDS, Level } from '@/config/game'

export function getAllCheckedBlocks() {
  return [...document.querySelectorAll<HTMLInputElement>('input.peer:checked')]
}

export function resetAllCheckedBlocks() {
  const blocks = getAllCheckedBlocks()

  blocks.forEach(box => box.checked = false)
}

export function matchAllCheckedResult(results: Set<string>): boolean {
  const blocks = getAllCheckedBlocks()

  if (
    blocks.length < results.size
    || blocks.length > results.size
  )
    return false

  return blocks.every(box => results.has(`${box.dataset.row},${box.dataset.col}`))
}

// 生成随机目标
export function generateRandomTarget({ min, max, grid }: typeof LEVEL_GRIDS[Level]) {
  // 生成 min ~ max 之间的随机个数
  // 每个数都是字符串类型，一 0,1 0,2 的格式生成，知道 grid,grid 的个数

  const target = new Set<string>()
  const count = Math.floor(Math.random() * (max - min + 1)) + min

  while (target.size < count) {
    const row = Math.floor(Math.random() * grid)
    const col = Math.floor(Math.random() * grid)

    target.add(`${row},${col}`)
  }

  return target
}
