import { Button } from '@/components/Button'

export default function Home() {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h1 className="text-center text-3xl text-medium font-mono">
        Memory Block
        <br />
        记忆方块
      </h1>

      <div className="mt-10">
        <Button type="primary" as={Link} to="/about">开始游戏</Button>
      </div>

    </div>
  )
}
