import type { JSX } from "react"

export interface Tool {
  id: string
  name: string
  path: string
  icon: JSX.Element
  description: string
}
