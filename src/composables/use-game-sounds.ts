import { useStorage, useToggle } from '@vueuse/core'
import { name } from '../../package.json'

interface GameSounds {
  enableSounds: Ref<boolean>
  toggleSounds: () => void
}

export const gameSoundsInjectionKey = Symbol('gameSounds') as InjectionKey<GameSounds>

export function provideGameSounds() {
  const enableSounds = useStorage(`${name}.fe.game-sounds`, true)
  const toggleSounds = useToggle(enableSounds)

  provide(gameSoundsInjectionKey, {
    enableSounds,
    toggleSounds
  })
}

export function useGameSounds() {
  const { enableSounds } = inject(gameSoundsInjectionKey)!

  const audio = new Audio()

  return {
    choose: () => {
      if (!enableSounds.value) return

      audio.src = `/choose.mp3`
      audio.play()
    },

    success: () => {
      if (!enableSounds.value) return

      audio.src = `/success.mp3`
      audio.play()
    },

    error: () => {
      if (!enableSounds.value) return

      audio.src = `/error.mp3`
      audio.play()
    },

    over: () => {
      if (!enableSounds.value) return

      audio.src = `/over.mp3`
      audio.play()
    }
  }
}
