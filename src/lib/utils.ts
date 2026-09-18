import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { HREFLANG, type Locale } from "@i18n/config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date, locale: Locale = "en") {
  return Intl.DateTimeFormat(HREFLANG[locale], {
    month: "short",
    day: "2-digit",
    year: "numeric"
  }).format(date)
}

/** CJK web reading ~400 chars/min; English ~220 wpm. Floor at 1 minute. */
export function readingTimeMinutes(source: string): number {
  const text = source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_~-]+/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .trim()

  const cjk = (text.match(/[\u4e00-\u9fff\u3040-\u30ff\u3400-\u4dbf]/g) || []).length
  const latinWords = text
    .replace(/[\u4e00-\u9fff\u3040-\u30ff\u3400-\u4dbf]/g, " ")
    .split(/\s+/)
    .filter((word) => /[A-Za-z0-9]/.test(word)).length

  return Math.max(1, Math.round(cjk / 400 + latinWords / 220))
}

export function readingTime(source: string, label = "min read") {
  return `${readingTimeMinutes(source)} ${label}`
}


export function truncateText(str: string, maxLength: number): string {
  const ellipsis = '…';

  if (str.length <= maxLength) return str;

  const trimmed = str.trimEnd();
  if (trimmed.length <= maxLength) return trimmed;

  const cutoff = maxLength - ellipsis.length;
  let sliced = str.slice(0, cutoff).trimEnd();

  return sliced + ellipsis;
}
