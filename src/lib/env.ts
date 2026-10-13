import { DEPLOY_TRACK } from "@lib/deploy-track"

/**
 * Dual-track deploy flag.
 *
 * Resolution order:
 * 1. PUBLIC_IS_STAGING === "true" | "false" (explicit host env wins)
 * 2. DEPLOY_TRACK from src/lib/deploy-track.ts (branch default)
 *
 * Production (public): unset env + DEPLOY_TRACK "production"
 * Partner preview:     PUBLIC_IS_STAGING=true  OR  DEPLOY_TRACK "partner-preview"
 */
export function isStaging(): boolean {
  const flag = import.meta.env.PUBLIC_IS_STAGING
  if (flag === "true") return true
  if (flag === "false") return false
  return DEPLOY_TRACK === "partner-preview"
}

export function robotsMetaContent(): "index, follow" | "noindex, nofollow" {
  return isStaging() ? "noindex, nofollow" : "index, follow"
}
