import { defineConfig } from "astro/config"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import solidJs from "@astrojs/solid-js"

export default defineConfig({
  site: "https://astro-sphere-demo.vercel.app",
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
    solidJs(),
    tailwind({ applyBaseStyles: false }),
  ],
})
