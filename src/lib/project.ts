import type { CollectionEntry } from "astro:content"
import type { Locale } from "@i18n/config"

const extraBodies = {
  ...import.meta.glob("../i18n/project-bodies/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
  }),
  ...import.meta.glob("../i18n/blog-bodies/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
  }),
} as Record<string, string>

type LocalizedFields = {
  title: string
  summary: string
  titleJa?: string
  titleEn?: string
  summaryJa?: string
  summaryEn?: string
}

export function localizedCopy(data: LocalizedFields, locale: Locale) {
  if (locale === "ja") {
    return {
      title: data.titleJa ?? data.title,
      summary: data.summaryJa ?? data.summary,
    }
  }
  if (locale === "en") {
    return {
      title: data.titleEn ?? data.title,
      summary: data.summaryEn ?? data.summary,
    }
  }
  return { title: data.title, summary: data.summary }
}

export function localizedProjectCopy(
  data: CollectionEntry<"projects">["data"],
  locale: Locale,
) {
  return localizedCopy(data, locale)
}

export function localizedEntryCopy(
  entry: CollectionEntry<"projects"> | CollectionEntry<"blog">,
  locale: Locale,
) {
  return localizedCopy(entry.data, locale)
}

export function localizedEntryTitle(
  entry: CollectionEntry<"projects"> | CollectionEntry<"blog">,
  locale: Locale,
) {
  return localizedCopy(entry.data, locale).title
}

export function localizedEntryBody(
  collection: "blog" | "projects",
  slug: string,
  locale: Locale,
  fallback: string,
) {
  if (locale === "zh") return fallback
  const folder = collection === "blog" ? "blog-bodies" : "project-bodies"
  const match = Object.entries(extraBodies).find(([path]) =>
    path.endsWith(`${folder}/${slug}.${locale}.md`),
  )
  return match?.[1] ?? fallback
}

export function localizedProjectBody(slug: string, locale: Locale, fallback: string) {
  return localizedEntryBody("projects", slug, locale, fallback)
}

function inlineMarkdown(text: string) {
  return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
}

function headingText(line: string, marker: string) {
  return inlineMarkdown(line.slice(marker.length).replace(/<br>\s*$/i, "").trim())
}

/** Loose markdown for project translations: headings, bold, existing HTML. */
export function markdownToHtml(source: string) {
  const html: string[] = []
  let para: string[] = []

  const flush = () => {
    const text = para.join("\n").trim()
    para = []
    if (!text) return
    html.push(`<p>${inlineMarkdown(text).replace(/\n/g, "<br>\n")}</p>`)
  }

  for (const line of source.replace(/\r\n/g, "\n").split("\n")) {
    if (line.startsWith("### ")) {
      flush()
      html.push(`<h3>${headingText(line, "### ")}</h3>`)
      continue
    }
    if (line.startsWith("## ")) {
      flush()
      html.push(`<h2>${headingText(line, "## ")}</h2>`)
      continue
    }
    if (!line.trim()) {
      flush()
      continue
    }
    para.push(line)
  }
  flush()
  return html.join("\n")
}
