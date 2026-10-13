import type { Locale } from "@i18n/config"

/**
 * Three homepage / blog cover cards.
 * Visual chrome stays fixed; copy is title + TBD + an October 2026 edit date.
 */
export type CornerstoneAsset = {
  id: string
  title: Record<Locale, string>
  summary: Record<Locale, string>
  /** Editorial date, month precision, already in the active language. */
  edited: Record<Locale, string>
}

export const CORNERSTONE_ASSETS: readonly CornerstoneAsset[] = [
  {
    id: "cases",
    title: {
      zh: "案例",
      ja: "事例",
      en: "Cases",
    },
    summary: {
      zh: "TBD",
      ja: "TBD",
      en: "TBD",
    },
    edited: {
      zh: "2026年10月",
      ja: "2026年10月",
      en: "October 2026",
    },
  },
  {
    id: "insights",
    title: {
      zh: "洞见",
      ja: "洞察",
      en: "Insights",
    },
    summary: {
      zh: "TBD",
      ja: "TBD",
      en: "TBD",
    },
    edited: {
      zh: "2026年10月",
      ja: "2026年10月",
      en: "October 2026",
    },
  },
  {
    id: "cocreation",
    title: {
      zh: "共创",
      ja: "共創",
      en: "Co-creation",
    },
    summary: {
      zh: "TBD",
      ja: "TBD",
      en: "TBD",
    },
    edited: {
      zh: "2026年10月",
      ja: "2026年10月",
      en: "October 2026",
    },
  },
] as const
