type AaguidEntry = {
  name: string
  icon_dark?: string
  icon_light?: string
}

type AaguidRegistry = Record<string, AaguidEntry>

export async function getAaguidInfo(
  aaguid: string | null | undefined
): Promise<AaguidEntry | null> {
  if (!aaguid) return null

  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/passkeydeveloper/passkey-authenticator-aaguids/main/aaguid.json",
      { next: { revalidate: 86400 } }
    )

    const registry: AaguidRegistry = await res.json()

    if (Object.keys(registry).length === 0) return null

    return registry[aaguid.toLowerCase()] ?? null
  } catch {
    return null
  }
}

export function getAaguidIcon(
  authenticator: AaguidEntry | null | undefined,
  theme?: string
) {
  if (!authenticator) return null

  return theme === "dark"
    ? (authenticator.icon_dark ?? authenticator.icon_light ?? null)
    : (authenticator.icon_light ?? authenticator.icon_dark ?? null)
}
