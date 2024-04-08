import { useStorage, useToggle } from '@vueuse/core'
import { name } from '@/../package.json'

interface GameSounds {
  enableSounds: Ref<boolean>
  toggleSounds: () => void
  sounds: {
    fail: HTMLAudioElement
    over: HTMLAudioElement
    error: HTMLAudioElement
    // choose: HTMLAudioElement
    success: HTMLAudioElement
  }
}

export const gameSoundsInjectionKey = Symbol('gameSounds') as InjectionKey<GameSounds>

export function provideGameSounds() {
  const enableSounds = useStorage(`${name}.fe.game-sounds`, true)
  const toggleSounds = useToggle(enableSounds)

  const sounds = {
    fail: new Audio(new URL('/fail.mp3', import.meta.url).href),
    over: new Audio(new URL('/over.mp3', import.meta.url).href),
    error: new Audio(new URL('/error.mp3', import.meta.url).href),
    // choose: new Audio(new URL('/choose.mp3', import.meta.url).href),
    success: new Audio(new URL('/success.mp3', import.meta.url).href),
  }

  provide(gameSoundsInjectionKey, {
    enableSounds,
    toggleSounds,
    sounds,
  })
}

export function useGameSounds() {
  const { sounds, enableSounds } = inject(gameSoundsInjectionKey)!

  return {
    // choose: () => {
    //   if (!enableSounds.value) {
    //     return
    //   }

    //   audio.src = new URL('/choose.mp3', import.meta.url).href
    //   audio.play()
    // },

    fail: () => {
      if (!enableSounds.value) {
        return
      }

      sounds.fail.play()
    },

    success: () => {
      if (!enableSounds.value) {
        return
      }

      sounds.success.play()
    },

    error: () => {
      if (!enableSounds.value) {
        return
      }

      // audio.src = new URL('/error.mp3', import.meta.url).href
      sounds.error.play()
    },

    over: () => {
      if (!enableSounds.value) {
        return
      }

      sounds.over.play()
    },
  }
}
