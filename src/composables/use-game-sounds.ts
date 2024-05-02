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

// 因为 Symbol 每次热更新的时候都会变, 导致开发环境下用这个会导致热更新以后inject错误
export const gameSoundsInjectionKey = import.meta.env.PROD
  ? Symbol('gameSounds') as InjectionKey<GameSounds>
  : 'gameSounds'

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
    toggleSounds,
    enableSounds,
    sounds,
  })
}

export function useGameSounds() {
  const { sounds, enableSounds } = inject(gameSoundsInjectionKey)!

  // 确保每次都能正常播放(如果之前正在播放则暂停并重置进度)
  function ensurePlay(audio: HTMLAudioElement) {
    return () => {
      if (!enableSounds.value) {
        return
      }

      audio.pause()
      audio.currentTime = 0
      audio.play()
    }
  }

  return {
    // choose: ensurePlay(sounds.choose),

    fail: ensurePlay(sounds.fail),
    success: ensurePlay(sounds.success),
    error: ensurePlay(sounds.error),
    over: ensurePlay(sounds.over),
  }
}
