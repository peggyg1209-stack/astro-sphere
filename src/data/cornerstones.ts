import type { Locale } from "@i18n/config"

/**
 * Three production “cornerstone” whitepaper / outline covers.
 * Shown on the public blog index while full reports stay Coming Soon (2026 Q4).
 */
export type CornerstoneAsset = {
  id: string
  /** Stable topic id aligned with BLOG_TOPICS where possible. */
  topicId: string
  title: Record<Locale, string>
  summary: Record<Locale, string>
  coverLabel: Record<Locale, string>
}

export const CORNERSTONE_ASSETS: readonly CornerstoneAsset[] = [
  {
    id: "geo-trust-whitepaper",
    topicId: "seo-geo",
    title: {
      zh: "生成式可见性与工业采信白皮书",
      ja: "生成可視性と産業採信ホワイトペーパー",
      en: "Generative Visibility & Industrial Trust Whitepaper",
    },
    summary: {
      zh: "大纲：从 AI 采信盲区审计到 Schema 工业语义图谱，为中国先进制造重建可被检索与采信的数字实体。",
      ja: "アウトライン：AI採信の死角監査から Schema 産業セマンティックグラフまで。先進製造のデジタル実体を再構築します。",
      en: "Outline: from AI trust-gap audits to Schema industrial knowledge graphs — rebuilding digitable entities overseas buyers and models can cite.",
    },
    coverLabel: {
      zh: "白皮书封面",
      ja: "ホワイトペーパー表紙",
      en: "Whitepaper cover",
    },
  },
  {
    id: "supply-chain-playbook",
    topicId: "agile-hardware",
    title: {
      zh: "敏捷硬件与跨境供应链实践手册",
      ja: "アジャイル・ハードウェアと越境サプライチェーン実践ハンドブック",
      en: "Agile Hardware & Cross-Border Supply Chain Playbook",
    },
    summary: {
      zh: "大纲：极速打样、小批量试产与目标市场合规落地的端到端路径，面向硬科技实体的可执行框架。",
      ja: "アウトライン：超速試作・小ロット試産から進出先コンプライアンス実装までの実行可能な枠組み。",
      en: "Outline: rapid prototyping, low-volume runs, and target-market compliance — an executable frame for hard-tech firms.",
    },
    coverLabel: {
      zh: "实践手册封面",
      ja: "実践ハンドブック表紙",
      en: "Playbook cover",
    },
  },
  {
    id: "corridor-ecosystem-brief",
    topicId: "cross-border-matchmaking",
    title: {
      zh: "跨境生态走廊与飞地共建简报",
      ja: "越境エコシステム回廊と飛び地共創ブリーフ",
      en: "Cross-Border Corridor & Enclave Co-Creation Brief",
    },
    summary: {
      zh: "大纲：产业匹配、战略伙伴共创位与案例诊断框架，连接制造一线与海外决策网络。",
      ja: "アウトライン：産業マッチング、戦略パートナー共創枠、ケース診断フレームで製造現場と海外意思決定をつなぐ。",
      en: "Outline: industrial matchmaking, strategic co-creation slots, and a case-diagnosis frame linking shop floors to overseas decision networks.",
    },
    coverLabel: {
      zh: "战略简报封面",
      ja: "戦略ブリーフ表紙",
      en: "Strategy brief cover",
    },
  },
] as const
