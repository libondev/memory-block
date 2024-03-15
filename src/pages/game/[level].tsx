import { useParams } from 'react-router-dom'
import { Toggle } from '@/components/Toggle'
import { Button } from '@/components/Button'

import { LEVEL_GRIDS, type Level } from '@/constants/game'
import {
  generateRandomTarget,
  matchAllCheckedResult,
  onResetAllCheckedBoxes,
} from '@/utils/grid'

export default function GameLevel() {
  let level = useParams().level!

  if (!(level in LEVEL_GRIDS))
    level = 'easy'

  const levelConfig = LEVEL_GRIDS[level as Level]

  const targetResults = generateRandomTarget(levelConfig)

  const onCheckCheckedResult = () => {
    const result = matchAllCheckedResult(targetResults)

    console.log(result)
  }

  return (
    <div className="h-full flex items-center justify-center">
      <div>
        <div className="w-max mx-auto border border-l-0 border-b-0">
          {
            Array.from({ length: levelConfig.grid }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex border-b">
                {
                  Array.from({ length: levelConfig.grid }).map((_, cellIndex) => (
                    <div key={cellIndex} className="border-l p-1">
                      <Toggle
                        className={levelConfig.size}
                        color="text-emerald-500"
                        data-row={rowIndex}
                        data-col={cellIndex}
                        defaultChecked={targetResults.has(`${rowIndex},${cellIndex}`)}
                      />
                    </div>
                  ))
                }
              </div>
            ))
          }
        </div>

        <div className="mt-8 gap-4 flex justify-center">
          <Button onClick={onResetAllCheckedBoxes}>重置</Button>
          <Button type="primary" onClick={onCheckCheckedResult}>检查</Button>
        </div>
      </div>
    </div>
  )
}
