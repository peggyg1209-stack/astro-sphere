export const LOCALES = ["zh", "ja", "en"] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "zh"
export const PREFIXED_LOCALES = ["ja", "en"] as const
export type PrefixedLocale = (typeof PREFIXED_LOCALES)[number]

/** BCP 47 values used in hreflang and html[lang] */
export const HREFLANG: Record<Locale, string> = {
  zh: "zh-CN",
  ja: "ja",
  en: "en",
}

export const OG_LOCALE: Record<Locale, string> = {
  zh: "zh_CN",
  ja: "ja_JP",
  en: "en_US",
}

export const LOCALE_LABEL: Record<Locale, string> = {
  zh: "中",
  ja: "JA",
  en: "EN",
}
