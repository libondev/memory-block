/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client-react" />

export { }

declare global {
  export type { FormEvent, FC, ReactNode } from 'react'

  export interface Props {
    children?: ReactNode
    [key: string]: any
  }
}
