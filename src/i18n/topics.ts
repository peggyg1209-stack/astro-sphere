import type { Locale } from "./config"

export type Topic = {
  /** Stable id stored in content frontmatter `tags`. Also used for filtering. */
  id: string
  /** Human labels — each locale string stays in that language only. */
  label: Record<Locale, string>
}

export const BLOG_TOPICS = [
  {
    id: "seo-geo",
    label: {
      zh: "引擎优化",
      ja: "エンジン最適化",
      en: "SEO & GEO",
    },
  },
  {
    id: "agile-hardware",
    label: {
      zh: "制造与供应链",
      ja: "製造とサプライチェーン",
      en: "Agile Hardware & Supply Chain",
    },
  },
  {
    id: "opc-solopreneur",
    label: {
      zh: "超级个体",
      ja: "ひとり事業",
      en: "OPC & Solopreneurship",
    },
  },
  {
    id: "cross-border-matchmaking",
    label: {
      zh: "跨境生态与飞地",
      ja: "越境エコシステムと飛び地",
      en: "Cross-Border Matchmaking",
    },
  },
  {
    id: "field-studies-pek-sha-szx",
    label: {
      zh: "北上深产研走读",
      ja: "北京・上海・深圳の産研フィールドスタディ",
      en: "Field Studies: PEK-SHA-SZX",
    },
  },
  {
    id: "lifelong-expeditions",
    label: {
      zh: "研学与探索",
      ja: "研学と探究",
      en: "Lifelong Expeditions",
    },
  },
  {
    id: "outdoors",
    label: {
      zh: "户外",
      ja: "アウトドア",
      en: "Outdoors",
    },
  },
  {
    id: "culinary-craft",
    label: {
      zh: "手作与食饮",
      ja: "手仕事と食飲",
      en: "Culinary Craft & Aesthetics",
    },
  },
] as const satisfies readonly Topic[]

export const PROJECT_TOPICS = [
  {
    id: "rapid-prototyping",
    label: {
      zh: "极速打样与小批量试产",
      ja: "超速試作と小ロット試産",
      en: "Rapid Prototyping & Low-Volume Run",
    },
  },
  {
    id: "generative-visibility",
    label: {
      zh: "生成式可见性与语义架构",
      ja: "生成可視性とセマンティック設計",
      en: "Generative Visibility & Schema Architecture",
    },
  },
  {
    id: "cross-border-eor",
    label: {
      zh: "跨境着陆与全球雇佣",
      ja: "越境ランディングと海外雇用",
      en: "Cross-Border Landing & EOR",
    },
  },
  {
    id: "industrial-delegations",
    label: {
      zh: "工业一线见学与闭门考察",
      ja: "工業の一線見学と非公開視察",
      en: "Front-line industrial study visits and closed-door inspections",
    },
  },
  {
    id: "curated-expeditions",
    label: {
      zh: "定制跨界游学",
      ja: "オーダーメイドの越境遊学",
      en: "Made-to-measure cross-boundary study travel",
    },
  },
  {
    id: "opc-incubation",
    label: {
      zh: "超级个体孵化",
      ja: "ひとり事業（OPC）の育成",
      en: "OPC Incubation",
    },
  },
] as const satisfies readonly Topic[]

export type BlogTopicId = (typeof BLOG_TOPICS)[number]["id"]
export type ProjectTopicId = (typeof PROJECT_TOPICS)[number]["id"]

export function localizeTopics(topics: readonly Topic[], locale: Locale) {
  return topics.map((topic) => ({
    id: topic.id,
    label: topic.label[locale],
  }))
}

/** Flattened keyword strings for <meta name="keywords"> and JSON-LD. */
export function topicKeywords(topics: readonly Topic[], locale: Locale): string[] {
  return topics.map((topic) => topic.label[locale])
}

function findTopic(tag: string): Topic | undefined {
  const needle = tag.toLowerCase()
  const pool = [...BLOG_TOPICS, ...PROJECT_TOPICS]
  return pool.find(
    (topic) =>
      topic.id === tag ||
      topic.label.zh.toLowerCase() === needle ||
      topic.label.ja.toLowerCase() === needle ||
      topic.label.en.toLowerCase() === needle,
  )
}

const HAN = /[\u4e00-\u9fff]/
const KANA = /[\u3040-\u30ff]/
const LATIN = /[A-Za-z]/

/** Keep only keywords that belong to the active UI language. */
function tagMatchesLocale(tag: string, locale: Locale): boolean {
  if (locale === "ja") return KANA.test(tag) || HAN.test(tag)
  if (locale === "zh") return HAN.test(tag) && !KANA.test(tag)
  return LATIN.test(tag) && !HAN.test(tag) && !KANA.test(tag)
}

/**
 * Map stored tags (ids or any-locale labels) onto the current locale, and drop
 * leftover keywords written in another language.
 */
export function localizeVisibleTags(
  tags: string[],
  locale: Locale,
  collection?: "blog" | "projects",
): string[] {
  const seen = new Set<string>()
  const visible: string[] = []

  for (const tag of tags) {
    const topic = findTopic(tag)
    if (topic) {
      if (collection === "projects" && !PROJECT_TOPICS.some((item) => item.id === topic.id)) {
        continue
      }
      if (collection === "blog" && !BLOG_TOPICS.some((item) => item.id === topic.id)) {
        continue
      }
      const label = topic.label[locale]
      if (!seen.has(label)) {
        seen.add(label)
        visible.push(label)
      }
      continue
    }

    if (!tagMatchesLocale(tag, locale)) continue
    if (!seen.has(tag)) {
      seen.add(tag)
      visible.push(tag)
    }
  }

  return visible
}

export function entryMatchesTopic(entryTags: string[], topicId: string): boolean {
  const topic =
    BLOG_TOPICS.find((item) => item.id === topicId) ??
    PROJECT_TOPICS.find((item) => item.id === topicId)
  if (!topic) return entryTags.some((tag) => tag.toLowerCase() === topicId.toLowerCase())

  const aliases = new Set(
    [topic.id, topic.label.zh, topic.label.ja, topic.label.en].map((value) =>
      value.toLowerCase(),
    ),
  )
  return entryTags.some((tag) => aliases.has(tag.toLowerCase()))
}
