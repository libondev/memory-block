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
    toggleSounds,
  })
}

export function useGameSounds() {
  const { enableSounds } = inject(gameSoundsInjectionKey)!

  const [
    // chooseAudio,
    overAudio,
    errorAudio,
    successAudio,
  ] = [
    // new Audio(new URL('/choose.mp3', import.meta.url).href),
    new Audio(new URL('/over.mp3', import.meta.url).href),
    new Audio(new URL('/error.mp3', import.meta.url).href),
    new Audio(new URL('/success.mp3', import.meta.url).href),
  ]

  return {
    // choose: () => {
    //   if (!enableSounds.value) {
    //     return
    //   }

    //   audio.src = new URL('/choose.mp3', import.meta.url).href
    //   audio.play()
    // },

    success: () => {
      if (!enableSounds.value) {
        return
      }

      successAudio.play()
    },

    error: () => {
      if (!enableSounds.value) {
        return
      }

      // audio.src = new URL('/error.mp3', import.meta.url).href
      errorAudio.play()
    },

    over: () => {
      if (!enableSounds.value) {
        return
      }

      overAudio.play()
    },
  }
}
