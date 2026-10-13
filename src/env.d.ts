/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module "*?raw" {
  const content: string
  export default content
}

interface ImportMetaEnv {
  /**
   * Relay endpoint that forwards consultation enquiries into the Lark Bitable.
   * Public by necessity (the browser calls it), so it must NOT be a Lark API
   * URL and must never carry credentials. See src/lib/lark/README.md.
   */
  readonly PUBLIC_LARK_CONTACT_ENDPOINT?: string

  /**
   * Dual-track deploy switch.
   * - `"true"`  → partner-preview / Staging: noindex, robots Disallow, gate, full preview UI
   * - unset / `"false"` → public production: Coming Soon blog cold-start, SEO-friendly
   */
  readonly PUBLIC_IS_STAGING?: string

  /**
   * Optional override for the partner-preview client gate (default PARTNER2026).
   * Still client-visible — only a light courtesy lock, not real auth.
   */
  readonly PUBLIC_PARTNER_PREVIEW_PASSWORD?: string

  /** Injected by Vercel when present. */
  readonly VERCEL_ENV?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
