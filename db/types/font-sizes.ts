export const FONT_SIZES = ["14", "15", "16", "18", "20"] as const
export type FontSize = (typeof FONT_SIZES)[number]
