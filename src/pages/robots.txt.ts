import type { APIRoute } from "astro"
import { isStaging } from "@lib/env"

export const GET: APIRoute = () => {
  const staging = isStaging()

  const robotsTxt = staging
    ? ["User-agent: *", "Disallow: /"].join("\n")
    : [
        "User-agent: *",
        "Allow: /",
        "",
        `Sitemap: ${new URL("sitemap-index.xml", import.meta.env.SITE).href}`,
      ].join("\n")

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": staging ? "no-store" : "public, max-age=3600",
    },
  })
}
