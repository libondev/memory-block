import { Button } from '@/components/Button'
import { Toggle } from '@/components/Toggle'

export default function Home() {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div>
        <Toggle color="bg-red-500" />

        <Button type="primary" onClick={console.log}>开始游戏</Button>
      </div>

    </div>
  )
}
