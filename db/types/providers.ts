export const PROVIDERS = {
  GOOGLE: "google",
  GITHUB: "github",
  MAGIC_LINK: "magic-link",
} as const

export type Provider = (typeof PROVIDERS)[keyof typeof PROVIDERS]

export const PROVIDER_LABELS: Record<string, string> = {
  [PROVIDERS.GOOGLE]: "Google",
  [PROVIDERS.GITHUB]: "GitHub",
  [PROVIDERS.MAGIC_LINK]: "Magic Link",
}
