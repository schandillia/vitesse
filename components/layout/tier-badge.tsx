import { Badge } from "@/components/ui/badge"
import { TIERS } from "@/config/pricing"
import type { TierKey } from "@/db/types/payments/tier"

interface TierBadgeProps {
  tier: TierKey | string | null | undefined
}

// Free tiers — no priceId on either billing period
const freeTierKeys = new Set(
  Object.values(TIERS)
    .filter((t) => t.priceId.monthly === null && t.priceId.annual === null)
    .map((t) => t.key)
)

// Assign badge variants based on position in tier order
// First paid tier → default, second → secondary, rest → outline
const tierKeys = Object.keys(TIERS) as TierKey[]
const paidTierKeys = tierKeys.filter((k) => !freeTierKeys.has(k))

const variantOptions = ["default", "secondary", "outline"] as const
const tierVariantMap = Object.fromEntries(
  paidTierKeys.map((key, i) => [
    key,
    variantOptions[Math.min(i, variantOptions.length - 1)],
  ])
)

export function TierBadge({ tier }: TierBadgeProps) {
  if (!tier || freeTierKeys.has(tier as TierKey)) return null

  const variant = tierVariantMap[tier] ?? "outline"

  return (
    <Badge variant={variant} className="capitalize w-fit text-xs">
      {tier}
    </Badge>
  )
}
