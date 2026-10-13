import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import solidJs from "@astrojs/solid-js"

// Mirror src/lib/env.ts: explicit env wins; otherwise follow deploy-track default.
// (deploy-track is edited to "partner-preview" on that git branch.)
function resolveStaging() {
  if (process.env.PUBLIC_IS_STAGING === "true") return true
  if (process.env.PUBLIC_IS_STAGING === "false") return false
  try {
    const trackSrc = readFileSync(
      fileURLToPath(new URL("./src/lib/deploy-track.ts", import.meta.url)),
      "utf8",
    )
    return /DEPLOY_TRACK[^=]*=\s*"partner-preview"/.test(trackSrc)
  } catch {
    return false
  }
}

const isStaging = resolveStaging()

export default defineConfig({
  site: "https://astro-sphere-demo.vercel.app",
  site: 'https://junarkpreview.pages.dev',
  trailingSlash: "always",
  server: {
    host: "127.0.0.1",
    port: 4321,
  },
  i18n: {
    defaultLocale: "zh",
    locales: ["zh", "ja", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    mdx(),
    // Skip sitemap emission on partner-preview builds.
    ...(isStaging
      ? []
      : [
          sitemap({
            i18n: {
              defaultLocale: "zh",
              locales: {
                zh: "zh-CN",
                en: "en",
                ja: "ja",
              },
            },
          }),
        ]),
    solidJs(),
    tailwind({ applyBaseStyles: false }),
  ],
})
