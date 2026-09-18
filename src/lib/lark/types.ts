import type { Locale } from "@i18n/config"

/**
 * Consultation enquiry payload — the single shape that travels from the browser
 * form to whatever server relays it into Lark (飞书).
 *
 * Keep this type as the contract: the relay handler and the Bitable field map
 * are both derived from it, so adding a field here is the only place you need
 * to start when extending the form.
 */
export interface ConsultSubmission {
  /** Contact name. Required. */
  name: string
  /**
   * How to reach the sender — an email address OR a phone number. Required,
   * validated on both the client and the relay.
   */
  contact: string
  /** Organisation, optional. */
  company?: string
  /** What the enquiry is about. */
  topic: ConsultTopic
  /** Free-form brief. Required. */
  message: string
  /** Preferred slot as an ISO date string (YYYY-MM-DD), optional. */
  preferredDate?: string
  /** UI language the enquiry was submitted in — drives reply language. */
  locale: Locale
  /** Page the enquiry originated from, for attribution. */
  sourcePath: string
  /** Explicit consent to be contacted. Must be true. */
  consent: boolean
}

export const CONSULT_TOPICS = ["consulting", "collaboration", "speaking", "other"] as const
export type ConsultTopic = (typeof CONSULT_TOPICS)[number]

/**
 * Enriched payload actually sent over the wire. The client adds these; the form
 * never asks the user for them.
 */
export interface ConsultRequestBody extends ConsultSubmission {
  /** ISO-8601 timestamp, client clock. */
  submittedAt: string
  /** Honeypot field — must be empty. Non-empty means bot, drop silently. */
  trap?: string
}

export type ConsultStatus = "idle" | "submitting" | "success" | "error"

export type ConsultResult =
  | { ok: true; recordId?: string }
  | { ok: false; error: ConsultErrorCode; message?: string }

export type ConsultErrorCode =
  /** No relay endpoint configured — interface reserved but not yet wired. */
  | "not-configured"
  /** Client-side validation failed. */
  | "invalid"
  /** Network/transport failure. */
  | "network"
  /** Relay or Lark rejected the record. */
  | "upstream"
  /** Too many submissions from this client. */
  | "rate-limited"

/**
 * A single record in the Lark Bitable (多维表格), keyed by human-readable field
 * names as they appear in the table UI. See `fields.ts` for the mapping.
 */
export interface LarkBitableRecord {
  fields: Record<string, LarkFieldValue>
}

export type LarkFieldValue = string | number | boolean | string[] | null

/** Shape returned by Lark's `bitable/v1/apps/{app}/tables/{table}/records` API. */
export interface LarkBitableCreateResponse {
  code: number
  msg: string
  data?: {
    record?: {
      record_id?: string
      fields?: Record<string, unknown>
    }
  }
}
