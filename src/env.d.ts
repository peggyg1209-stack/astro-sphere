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
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
