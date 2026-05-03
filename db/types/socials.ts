export const SOCIAL_PLATFORMS = [
  "github",
  "twitter",
  "linkedin",
  "instagram",
  "youtube",
] as const
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]
export type Socials = Partial<Record<SocialPlatform, string>>
