/**
 * Git-branch deploy track.
 *
 * - `production`      → public Coming Soon + SEO (main / JUNARK)
 * - `partner-preview` → full partner staging UI + noindex (partner-preview branch)
 *
 * `PUBLIC_IS_STAGING=true|false` always wins when set explicitly on the host.
 */
export const DEPLOY_TRACK: "production" | "partner-preview" = "production"
