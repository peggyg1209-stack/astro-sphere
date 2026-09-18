import type { Locale } from "@i18n/config"
import type {
  ConsultRequestBody,
  ConsultResult,
  ConsultSubmission,
  ConsultErrorCode,
} from "./types"
import { CONSULT_TOPICS } from "./types"

/**
 * Relay endpoint for consultation enquiries.
 *
 * The site builds fully static, so there is no server route here and — more
 * importantly — a Lark App Secret must never reach the browser. This points at
 * a small relay you own (Cloudflare Worker, Vercel/Netlify function, or your
 * own API) which holds the credentials and writes into the Bitable.
 *
 * Leave it unset and the form degrades gracefully to the mailto fallback:
 * `submitConsult` returns `not-configured` without making a request.
 */
const ENDPOINT: string = import.meta.env.PUBLIC_LARK_CONTACT_ENDPOINT ?? ""

export function isConsultConfigured(): boolean {
  return ENDPOINT.trim().length > 0
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
/** Digits with common separators; needs at least 6 digits to count as a number. */
const PHONE_PATTERN = /^\+?[\d\s()./-]{6,}$/

/** The contact field accepts either an email address or a phone number. */
export function isValidContact(value: string): boolean {
  const trimmed = value.trim()
  if (EMAIL_PATTERN.test(trimmed)) return true
  const digits = trimmed.replace(/\D/g, "")
  return PHONE_PATTERN.test(trimmed) && digits.length >= 6
}

export interface ConsultValidationIssues {
  name?: string
  contact?: string
  message?: string
  consent?: string
}

/**
 * Validate a submission. Returns an empty object when the payload is sendable.
 * Values are i18n keys the caller resolves, not user-facing copy.
 */
export function validateConsult(
  submission: Partial<ConsultSubmission>,
): ConsultValidationIssues {
  const issues: ConsultValidationIssues = {}

  if (!submission.name?.trim()) issues.name = "required"
  if (!submission.contact?.trim()) {
    issues.contact = "required"
  } else if (!isValidContact(submission.contact)) {
    issues.contact = "invalidContact"
  }
  if (!submission.message?.trim()) issues.message = "required"
  if (!submission.consent) issues.consent = "required"

  return issues
}

/** Normalise raw form values into a well-typed submission. */
export function normalizeConsult(
  raw: Record<string, string | undefined>,
  context: { locale: Locale; sourcePath: string },
): ConsultSubmission {
  const topic = CONSULT_TOPICS.find((value) => value === raw.topic) ?? "consulting"

  return {
    name: raw.name?.trim() ?? "",
    contact: raw.contact?.trim() ?? "",
    company: raw.company?.trim() || undefined,
    topic,
    message: raw.message?.trim() ?? "",
    preferredDate: raw.preferredDate?.trim() || undefined,
    locale: context.locale,
    sourcePath: context.sourcePath,
    consent: raw.consent === "on" || raw.consent === "true",
  }
}

/**
 * POST an enquiry to the relay.
 *
 * The relay is expected to accept `ConsultRequestBody` as JSON and respond
 * `{ ok: true, recordId?: string }` on success. See `src/lib/lark/README.md`
 * for the full contract, including the Bitable write it performs.
 */
export async function submitConsult(
  submission: ConsultSubmission,
  options: { trap?: string; signal?: AbortSignal } = {},
): Promise<ConsultResult> {
  // Honeypot: a filled trap means a bot. Report success so the bot does not
  // learn it was rejected, but send nothing.
  if (options.trap && options.trap.trim().length > 0) {
    return { ok: true }
  }

  const issues = validateConsult(submission)
  if (Object.keys(issues).length > 0) {
    return { ok: false, error: "invalid" }
  }

  if (!isConsultConfigured()) {
    return { ok: false, error: "not-configured" }
  }

  const body: ConsultRequestBody = {
    ...submission,
    submittedAt: new Date().toISOString(),
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: options.signal,
    })

    if (!response.ok) {
      return {
        ok: false,
        error: statusToErrorCode(response.status),
        message: `Relay responded ${response.status}`,
      }
    }

    const payload = (await response.json().catch(() => null)) as
      | { ok?: boolean; recordId?: string; message?: string }
      | null

    if (payload && payload.ok === false) {
      return { ok: false, error: "upstream", message: payload.message }
    }

    return { ok: true, recordId: payload?.recordId }
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { ok: false, error: "network", message: "aborted" }
    }
    return {
      ok: false,
      error: "network",
      message: error instanceof Error ? error.message : String(error),
    }
  }
}

function statusToErrorCode(status: number): ConsultErrorCode {
  if (status === 429) return "rate-limited"
  if (status === 400 || status === 422) return "invalid"
  return "upstream"
}
