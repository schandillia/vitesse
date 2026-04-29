/**
 * Standardized image sizes for Next.js <Image> components.
 * These map directly to our Tailwind breakpoints (md: 768px, lg: 1200px)
 */
export const imageSizes = {
  /** Takes up the full width of the screen on all devices */
  hero: "100vw",

  /** Full width on mobile, half width on desktop */
  half: "(max-width: 768px) 100vw, 50vw",

  /** 1 column on mobile, 2 on tablet, 3 on desktop (Blog Cards) */
  card: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",

  /** For avatars or small icons */
  thumbnail: "(max-width: 768px) 33vw, 15vw",
} as const
