import { useParams } from 'react-router-dom'
import { Toaster, toast } from 'sonner'
import { Toggle } from '@/components/Toggle'
import { Button } from '@/components/Button'

import { LEVEL_GRIDS, type Level } from '@/constants/game'
import {
  generateRandomTarget,
  getAllCheckedToggle,
  matchAllCheckedResult,
  onResetAllCheckedBlocks,
} from '@/utils/grid'

function Grid({
  config,
  results,
  preview,
}: {
  preview: boolean
  results: Set<string>
  config: typeof LEVEL_GRIDS[Level]
}) {
  return (
    <div className="w-max mx-auto border dark:border-gray-600 border-l-0 border-b-0">
      {
        Array.from({ length: config.grid }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex border-inherit border-b">
            {
              Array.from({ length: config.grid }).map((_, cellIndex) => (
                <div key={cellIndex} className="border-inherit border-l p-1">
                  <Toggle
                    className={config.size}
                    color="text-emerald-500"
                    data-row={rowIndex}
                    data-col={cellIndex}
                    defaultChecked={results.has(`${rowIndex},${cellIndex}`) && preview}
                  >
                    <span className="text-black">{ `${results.has(`${rowIndex},${cellIndex}`)}` }</span>
                  </Toggle>
                </div>
              ))
            }
          </div>
        ))
      }
    </div>
  )
}

export default function Game() {
  let level = useParams().level!

  if (!(level in LEVEL_GRIDS))
    level = 'easy'

  const timeoutId = useRef(-1)

  const [gameScope, setGameScope] = useState(0)
  const [isGameOver, setGameOver] = useState(false)
  const [previewMode, setPreviewMode] = useState(true)

  const levelConfig = LEVEL_GRIDS[level as Level]

  const [targetBlocks, setTargetBlocks] = useState<Set<string>>(
    generateRandomTarget(levelConfig),
  )

  // 检查是否通关
  const onCheckCheckedResult = () => {
    const blocks = getAllCheckedToggle()

    if (!blocks.length) {
      toast('还没有勾选格子')

      return
    }

    const result = matchAllCheckedResult(targetBlocks)

    if (result) {
      setGameScope(gameScope + blocks.length * 10)
      setPreviewMode(true)

      return
    }

    setGameOver(true)
    blocks.forEach((box) => {
      const el = box.nextSibling as HTMLElement

      if (!targetBlocks.has(`${box.dataset.row},${box.dataset.col}`))
        el.className += ' !text-red-500 i-carbon-close'
    })
  }

  // 重新开始游戏
  const onResetBlocksOrRestartGame = () => {
    // 游戏结束, 重新开始游戏
    if (isGameOver) {
      // 重置分数
      setGameScope(0)
      // 设置游戏结束的状态为 false
      setGameOver(false)
      // 重新开始速记模式
      setPreviewMode(true)
      // 重置之前选中的 block
      // onResetAllCheckedBlocks()
      // 设置新的 block
      setTargetBlocks(generateRandomTarget(levelConfig))

      // 找到所有选错的 block, 并清除它们的标记状态
      const errorBlocks = document.querySelectorAll('i.i-carbon-close')
      errorBlocks.forEach((el) => {
        el.classList.remove('!text-red-500', 'i-carbon-close')
      })

      return
    }

    onResetAllCheckedBlocks()
  }

  useEffect(() => {
    if (previewMode) {
      timeoutId.current = window.setTimeout(() => {
        setPreviewMode(false)
        onResetAllCheckedBlocks()
      // }, levelConfig.internal * 1000)
      }, levelConfig.internal * 500)
    }

    return () => clearTimeout(timeoutId.current)
  }, [previewMode, levelConfig.internal])

  return (
    <div className="h-full flex items-center justify-center">
      <div>
        <p className="w-full text-center text-2xl">{gameScope}</p>

        <h2 className="w-full text-xl text-center mb-6">{ previewMode ? '请记住以下方块位置' : '游戏开始' }</h2>

        <div className={previewMode || isGameOver ? 'pointer-events-none' : ''}>
          { targetBlocks }
          <Grid config={levelConfig} results={targetBlocks} preview={previewMode} />
        </div>

        <div className="mt-8 gap-4 flex justify-center">
          <Button disabled={previewMode} onClick={onResetBlocksOrRestartGame}>{ isGameOver ? '再来一次' : '清空' }</Button>
          <Button disabled={previewMode || isGameOver} type="primary" onClick={onCheckCheckedResult}>检查</Button>

        </div>
      </div>

      <Toaster
        richColors
        closeButton
        theme="system"
        // position="top-center"
        toastOptions={{ duration: 3000 }}
      />
    </div>
  )
}
