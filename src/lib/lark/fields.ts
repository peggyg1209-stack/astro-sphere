import type { Locale } from "@i18n/config"
import type { ConsultRequestBody, ConsultTopic, LarkBitableRecord } from "./types"

/**
 * Lark Bitable (多维表格) field mapping.
 *
 * These keys must match the column names in the target table exactly. Change
 * them here rather than in the relay handler so the statistics/analysis views
 * built on top of the table keep working.
 *
 * Suggested column types when creating the table:
 *   提交时间   Date/时间
 *   姓名       Text/文本
 *   联系方式   Text/文本   (email or phone)
 *   公司       Text/文本
 *   咨询类型   SingleSelect/单选
 *   期望时间   Date/日期
 *   需求描述   Text/多行文本
 *   语言       SingleSelect/单选
 *   来源页面   Text/文本
 *   处理状态   SingleSelect/单选
 */
export const BITABLE_FIELDS = {
  submittedAt: "提交时间",
  name: "姓名",
  contact: "联系方式",
  company: "公司",
  topic: "咨询类型",
  preferredDate: "期望时间",
  message: "需求描述",
  locale: "语言",
  sourcePath: "来源页面",
  status: "处理状态",
} as const satisfies Record<string, string>

/** Single-select option labels, so the table reads natively in Chinese. */
export const TOPIC_LABELS: Record<ConsultTopic, string> = {
  consulting: "咨询",
  collaboration: "合作",
  speaking: "演讲 / 分享",
  other: "其他",
}

export const LOCALE_LABELS: Record<Locale, string> = {
  zh: "中文",
  ja: "日本語",
  en: "English",
}

/** Initial workflow state for every new enquiry. */
export const DEFAULT_STATUS = "待处理"

/**
 * Translate a submission into a Bitable record.
 *
 * Intended to run on the relay (server) side, but kept dependency-free and
 * isomorphic so it can be unit-tested or reused in an edge function.
 */
export function toBitableRecord(submission: ConsultRequestBody): LarkBitableRecord {
  const fields: LarkBitableRecord["fields"] = {
    [BITABLE_FIELDS.submittedAt]: submission.submittedAt,
    [BITABLE_FIELDS.name]: submission.name,
    [BITABLE_FIELDS.contact]: submission.contact,
    [BITABLE_FIELDS.topic]: TOPIC_LABELS[submission.topic],
    [BITABLE_FIELDS.message]: submission.message,
    [BITABLE_FIELDS.locale]: LOCALE_LABELS[submission.locale],
    [BITABLE_FIELDS.sourcePath]: submission.sourcePath,
    [BITABLE_FIELDS.status]: DEFAULT_STATUS,
  }

  // Only send optional columns when populated, so Bitable does not create
  // empty-string values that break the single-select statistics views.
  if (submission.company) {
    fields[BITABLE_FIELDS.company] = submission.company
  }
  if (submission.preferredDate) {
    fields[BITABLE_FIELDS.preferredDate] = submission.preferredDate
  }

  return { fields }
}
