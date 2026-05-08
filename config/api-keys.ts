/**
 * API key configuration for Oolway.
 *
 * This is the single place where you define the scopes available to your
 * users' API keys. Edit this file to match your product's access model —
 * the UI, database, and validation all derive from what you define here.
 *
 * Example scopes for a typical SaaS:
 *   read    — read-only access to resources
 *   write   — create and update resources
 *   delete  — delete resources
 *   admin   — full access including sensitive operations
 */

import { BRANDNAME } from "@/config/constants"

export const API_KEY_SCOPES = ["read", "write", "delete", "admin"] as const

export type ApiKeyScope = (typeof API_KEY_SCOPES)[number]

export const API_KEY_SCOPE_DESCRIPTIONS: Record<ApiKeyScope, string> = {
  read: "Read-only access to resources",
  write: "Create and update resources",
  delete: "Delete resources",
  admin: "Full access including sensitive operations",
}

/**
 * Maximum number of API keys a single user can hold at once.
 * Adjust to match your abuse-prevention or plan-gating needs.
 */
export const API_KEY_MAX_PER_USER = 2

/**
 * Available expiry options shown in the create key dialog.
 * null means the key never expires.
 */
export const API_KEY_EXPIRY_OPTIONS = [
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
  { label: "1 year", days: 365 },
  { label: "Never", days: null },
] as const

/**
 * Prefix added to the start of every generated API key.
 * Change this to match your brand (e.g. "stripe_", "gh_", "myapp_").
 */
export const API_KEY_PREFIX = BRANDNAME.toLowerCase() + "_"
