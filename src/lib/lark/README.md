# Lark (飞书) 接入预留接口

咨询预约表单已经写好，但**默认不发任何请求**。因为站点是纯静态构建（`astro.config.mjs` 没有
adapter），而 Lark 的 App Secret 绝不能出现在浏览器里，所以中间必须有一个你自己持有凭据的
中转端点（relay）。

未配置时表单会优雅降级：直接提示用户走邮件，不会报错。

## 架构

```
浏览器表单                 你的中转端点                    Lark 开放平台
ConsultForm.astro   ──►   Worker / 函数 / API        ──►   tenant_access_token
src/lib/lark/client.ts    src/lib/lark/server.ts           bitable records/create
                                                     └►   自定义机器人 webhook（可选）
```

- `client.ts` —— 浏览器侧。校验、归一化、POST。不含任何凭据。
- `server.ts` —— 中转侧。持有 App Secret，换 token，写多维表格。**站点代码从不 import 它。**
- `fields.ts` —— 两侧共用的多维表格字段映射，改字段只改这一个文件。
- `types.ts` —— 唯一契约来源。

## 启用步骤

1. **建多维表格**，按 `fields.ts` 顶部注释里的列名与列类型创建（`提交时间`、`姓名`、
   `联系方式`、`公司`、`咨询类型`、`期望时间`、`需求描述`、`语言`、`来源页面`、`处理状态`）。
   `联系方式` 存邮箱或电话，用文本列。从表格 URL 里取 `app_xxx`（app token）和 `tbl_xxx`（table id）。

2. **建 Lark 应用**，开启机器人能力，授予 `bitable:app` 权限，并把应用加为该表格的协作者
   （否则写入会报权限错误）。

3. **部署中转端点**。把 `server.ts` 拷进你的运行时，示例（Cloudflare Worker）：

   ```ts
   import { handleConsultRequest } from "./lark/server"
   import type { ConsultRequestBody } from "./lark/types"

   export default {
     async fetch(request: Request, env: Env): Promise<Response> {
       if (request.method === "OPTIONS") return cors(new Response(null, { status: 204 }))
       if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 })

       const submission = (await request.json()) as ConsultRequestBody

       const result = await handleConsultRequest(
         {
           appId: env.LARK_APP_ID,
           appSecret: env.LARK_APP_SECRET,
           bitableAppToken: env.LARK_BITABLE_APP_TOKEN,
           tableId: env.LARK_TABLE_ID,
           baseUrl: env.LARK_BASE_URL,
         },
         submission,
         { webhookUrl: env.LARK_WEBHOOK_URL },
       )

       return cors(
         Response.json(result, { status: result.ok ? 200 : 502 }),
       )
     },
   }
   ```

   记得处理 **CORS**（允许你的站点域名）和**限流**，中转端点是公开的。

4. **配置站点**：把 `.env` 里的 `PUBLIC_LARK_CONTACT_ENDPOINT` 指向中转端点，重新构建。

## 契约

**请求** `POST <endpoint>`，`Content-Type: application/json`，body 为 `ConsultRequestBody`：

```json
{
  "name": "张三",
  "contact": "zhangsan@example.com",
  "company": "示例公司",
  "topic": "consulting",
  "message": "想聊一下品牌站改版。",
  "preferredDate": "2026-10-08",
  "locale": "zh",
  "sourcePath": "/projects/project-1/",
  "consent": true,
  "submittedAt": "2026-09-18T02:30:00.000Z"
}
```

`contact` 可以是邮箱**或**电话，两侧都用 `isValidContact` 校验。`sourcePath` 记录留言来自哪个
页面（首页或某个 project 详情页），方便在多维表格里按来源统计转化。

**响应**：成功 `200` + `{ "ok": true, "recordId": "rec_xxx" }`；失败 `4xx/5xx` +
`{ "ok": false, "message": "..." }`。`429` 会被客户端识别为限流并提示用户稍后再试。

`trap` 字段是蜜罐：非空表示机器人，两侧都会静默丢弃并假装成功。

## 后续统计分析

记录进表格后，直接用多维表格自带的仪表盘：按 `咨询类型` / `语言` / `来源页面` 分组计数，
按 `提交时间` 看趋势，用 `处理状态` 跟进转化。无需额外埋点。
