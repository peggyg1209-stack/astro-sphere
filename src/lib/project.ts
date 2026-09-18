import type { CollectionEntry } from "astro:content"
import type { Locale } from "@i18n/config"

export function localizedProjectCopy(
  data: CollectionEntry<"projects">["data"],
  locale: Locale,
) {
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

export function localizedEntryTitle(
  entry: CollectionEntry<"projects"> | CollectionEntry<"blog">,
  locale: Locale,
) {
  if (entry.collection === "projects") {
    return localizedProjectCopy(entry.data, locale).title
  }
  return entry.data.title
}
