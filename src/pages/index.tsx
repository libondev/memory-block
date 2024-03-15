import { Button } from '@/components/Button'
import { LEVEL_BUTTONS } from '@/constants/game'

export default function Home() {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h1 className="text-center text-3xl text-medium font-mono">
        Memory Block
        <br />
        记忆方块
      </h1>

      <div className="mt-14 flex flex-col gap-1.5">
        {
          LEVEL_BUTTONS.map(button => (
            <Button key={button.path} type={button.type} as={Link} to={button.path}>
              {button.zh}
            </Button>
          ))
        }
      </div>
    </div>
  )
}
