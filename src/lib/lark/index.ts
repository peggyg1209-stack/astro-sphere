/**
 * Lark (飞书) integration — reserved interface.
 *
 * Browser-safe surface only. `./server` is deliberately excluded from this
 * barrel so credential-bearing code can never be pulled into a client bundle
 * by an accidental import.
 */
export type {
  ConsultErrorCode,
  ConsultRequestBody,
  ConsultResult,
  ConsultStatus,
  ConsultSubmission,
  ConsultTopic,
  LarkBitableCreateResponse,
  LarkBitableRecord,
  LarkFieldValue,
} from "./types"

export { CONSULT_TOPICS } from "./types"

export {
  BITABLE_FIELDS,
  DEFAULT_STATUS,
  LOCALE_LABELS,
  TOPIC_LABELS,
  toBitableRecord,
} from "./fields"

export {
  isConsultConfigured,
  isValidContact,
  normalizeConsult,
  submitConsult,
  validateConsult,
  type ConsultValidationIssues,
} from "./client"
