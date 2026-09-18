import {
  DEFAULT_LOCALE,
  HREFLANG,
  LOCALES,
  PREFIXED_LOCALES,
  type Locale,
  type PrefixedLocale,
} from "./config"

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

export function isPrefixedLocale(value: string): value is PrefixedLocale {
  return (PREFIXED_LOCALES as readonly string[]).includes(value)
}

export function getLocaleFromUrl(url: URL | string): Locale {
  const pathname = typeof url === "string" ? url : url.pathname
  const first = pathname.split("/").filter(Boolean)[0]
  if (first && isPrefixedLocale(first)) return first
  return DEFAULT_LOCALE
}

/** Path without locale prefix, always starting with `/`. */
export function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean)
  if (segments[0] && isPrefixedLocale(segments[0])) {
    const rest = segments.slice(1).join("/")
    return rest ? `/${rest}` : "/"
  }
  return pathname.startsWith("/") ? pathname || "/" : `/${pathname}`
}

export function withTrailingSlash(path: string): string {
  if (path === "/") return "/"
  const [pathname, hash] = path.split("#")
  const clean = pathname.endsWith("/") ? pathname : `${pathname}/`
  return hash ? `${clean}#${hash}` : clean
}

export function localizePath(path: string, locale: Locale): string {
  const stripped = stripLocalePrefix(path)
  const normalized = stripped === "/" ? "/" : withTrailingSlash(stripped)
  if (locale === DEFAULT_LOCALE) return normalized
  if (normalized === "/") return `/${locale}/`
  return `/${locale}${normalized}`
}

export function getAlternateUrls(pathname: string, site: URL | string): Record<Locale, string> {
  const origin = typeof site === "string" ? site : site.href
  const base = origin.endsWith("/") ? origin.slice(0, -1) : origin
  const stripped = stripLocalePrefix(pathname)

  return LOCALES.reduce(
    (acc, locale) => {
      acc[locale] = `${base}${localizePath(stripped, locale)}`
      return acc
    },
    {} as Record<Locale, string>,
  )
}

export function getCanonicalUrl(pathname: string, site: URL | string, locale?: Locale): string {
  const current = locale ?? getLocaleFromUrl(pathname)
  return getAlternateUrls(pathname, site)[current]
}

export function hreflangLinks(pathname: string, site: URL | string) {
  const alternates = getAlternateUrls(pathname, site)
  return [
    ...LOCALES.map((locale) => ({
      hreflang: HREFLANG[locale],
      href: alternates[locale],
    })),
    { hreflang: "x-default", href: alternates[DEFAULT_LOCALE] },
  ]
}

export function navHref(locale: Locale, key: "home" | "projects" | "blog"): string {
  if (key === "home") return localizePath("/", locale)
  if (key === "projects") return localizePath("/projects/", locale)
  return localizePath("/blog/", locale)
}

export function isNavActive(pathname: string, href: string): boolean {
  const current = withTrailingSlash(pathname.split("#")[0] || "/")
  const target = withTrailingSlash(href)
  if (target === "/" || target === "/ja/" || target === "/en/") {
    return current === target
  }
  return current === target || current.startsWith(target)
}
