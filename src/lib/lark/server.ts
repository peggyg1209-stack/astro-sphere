import type {
  ConsultRequestBody,
  ConsultResult,
  LarkBitableCreateResponse,
} from "./types"
import { toBitableRecord } from "./fields"

/**
 * Server-side Lark (飞书) client — the reserved relay implementation.
 *
 * This module is intentionally NOT imported anywhere in the static site: it
 * holds the credential-bearing half of the integration. Credentials must never
 * be shipped to the browser.
 *
 * To go live, drop this into whatever runtime you choose (Cloudflare Worker,
 * Vercel/Netlify function, or an Astro API route once you add an SSR adapter),
 * pass it the config from that runtime's secrets, and point
 * `PUBLIC_LARK_CONTACT_ENDPOINT` at it. It is dependency-free and uses only
 * `fetch`, so it runs unchanged on Node 18+, Workers, and Deno.
 */

export interface LarkServerConfig {
  /** App ID from the Lark developer console. */
  appId: string
  /** App Secret. Server-side secret — never expose to the client. */
  appSecret: string
  /** Bitable app token, the `app_xxx` id of the 多维表格. */
  bitableAppToken: string
  /** Target table id, `tbl_xxx`. */
  tableId: string
  /**
   * API base. Use the `.cn` host for Feishu (China) tenants and the `.com`
   * host for Lark (international) tenants.
   */
  baseUrl?: string
}

const FEISHU_BASE = "https://open.feishu.cn"

/** Exchange app credentials for a tenant access token. */
export async function getTenantAccessToken(config: LarkServerConfig): Promise<string> {
  const base = config.baseUrl ?? FEISHU_BASE

  const response = await fetch(`${base}/open-apis/auth/v3/tenant_access_token/internal`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      app_id: config.appId,
      app_secret: config.appSecret,
    }),
  })

  const payload = (await response.json()) as {
    code: number
    msg: string
    tenant_access_token?: string
  }

  if (payload.code !== 0 || !payload.tenant_access_token) {
    throw new Error(`Lark token request failed: ${payload.code} ${payload.msg}`)
  }

  return payload.tenant_access_token
}

/**
 * 信息报送 — append one enquiry as a row in the Bitable so the built-in
 * dashboard/统计分析 views can aggregate it.
 */
export async function createBitableRecord(
  config: LarkServerConfig,
  submission: ConsultRequestBody,
  token?: string,
): Promise<ConsultResult> {
  const base = config.baseUrl ?? FEISHU_BASE
  const accessToken = token ?? (await getTenantAccessToken(config))
  const record = toBitableRecord(submission)

  const response = await fetch(
    `${base}/open-apis/bitable/v1/apps/${config.bitableAppToken}/tables/${config.tableId}/records`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(record),
    },
  )

  const payload = (await response.json()) as LarkBitableCreateResponse

  if (payload.code !== 0) {
    return {
      ok: false,
      error: "upstream",
      message: `Bitable write failed: ${payload.code} ${payload.msg}`,
    }
  }

  return { ok: true, recordId: payload.data?.record?.record_id }
}

/**
 * Optional: mirror the enquiry into a chat via an incoming-webhook bot, so the
 * team gets a push notification alongside the table row.
 *
 * Pass the custom bot webhook URL; returns false when no URL is configured.
 */
export async function notifyViaWebhook(
  webhookUrl: string | undefined,
  submission: ConsultRequestBody,
): Promise<boolean> {
  if (!webhookUrl) return false

  const lines = [
    `姓名：${submission.name}`,
    `联系方式：${submission.contact}`,
    submission.company ? `公司：${submission.company}` : null,
    `类型：${submission.topic}`,
    `语言：${submission.locale}`,
    `来源：${submission.sourcePath}`,
    "",
    submission.message,
  ].filter((line): line is string => line !== null)

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      msg_type: "post",
      content: {
        post: {
          zh_cn: {
            title: "新的留言",
            content: [lines.map((line) => ({ tag: "text", text: `${line}\n` }))],
          },
        },
      },
    }),
  })

  return response.ok
}

/**
 * Complete relay handler. Wire this to your runtime's request/response types.
 *
 * Validates nothing beyond required-field presence — reuse `validateConsult`
 * from `./client` on the server too, so the browser and relay agree.
 */
export async function handleConsultRequest(
  config: LarkServerConfig,
  submission: ConsultRequestBody,
  options: { webhookUrl?: string } = {},
): Promise<ConsultResult> {
  // Drop bot submissions silently.
  if (submission.trap && submission.trap.trim().length > 0) {
    return { ok: true }
  }

  const result = await createBitableRecord(config, submission)

  if (result.ok && options.webhookUrl) {
    // Notification is best-effort: a failed push must not fail the enquiry.
    await notifyViaWebhook(options.webhookUrl, submission).catch(() => false)
  }

  return result
}
