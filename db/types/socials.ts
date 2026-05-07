export const SOCIAL_CONFIG = {
  github: { label: "GitHub", placeholder: "e.g. alberteinstein" },
  twitter: { label: "X/Twitter", placeholder: "e.g. @AlbertEinstein" },
  linkedin: { label: "LinkedIn", placeholder: "e.g. albert-einstein" },
} as const

export type SocialPlatform = keyof typeof SOCIAL_CONFIG
export type Socials = Partial<Record<SocialPlatform, string>>

export const SOCIAL_PLATFORMS = Object.keys(SOCIAL_CONFIG) as SocialPlatform[]
