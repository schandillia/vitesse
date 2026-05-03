export const MODES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const

export type Mode = (typeof MODES)[keyof typeof MODES]
