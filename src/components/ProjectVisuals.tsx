import type { JSX } from "solid-js"

export type ProjectMarkId = "export" | "field" | "study"

/** Three marks, same stroke language as the brand lockup. */
export function ProjectMark(props: { kind: ProjectMarkId; class?: string }) {
  const className = props.class ?? "size-9"
  return (
    <svg
      class={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="100" height="100" rx="20" class="fill-paper dark:fill-ink-raised" />
      {props.kind === "export" && <ExportGlyph />}
      {props.kind === "field" && <FieldGlyph />}
      {props.kind === "study" && <StudyGlyph />}
    </svg>
  )
}

/** Die frame + outbound horizon — manufacturing that leaves the shop. */
function ExportGlyph() {
  return (
    <g fill="none" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M28 36V70C28 71.1 28.9 72 30 72H64" class="stroke-pine" />
      <path d="M34 44H58V62H38C36.9 62 36 61.1 36 60V46C36 44.9 36.9 44 38 44" class="stroke-pine" />
      <path d="M48 72L72 28M72 28H54M72 28V46" class="stroke-lake" />
      <circle cx="48" cy="54" r="3.2" class="fill-lake stroke-none" />
    </g>
  )
}

/** Closed bay + three nodes — PEK · SHA · SZX behind the door. */
function FieldGlyph() {
  return (
    <g fill="none" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M30 38V68H70V38" class="stroke-pine" />
      <path d="M30 38H70" class="stroke-pine" />
      <path d="M46 38V68" class="stroke-lake" />
      <circle cx="38" cy="54" r="3.2" class="fill-pine stroke-none" />
      <circle cx="58" cy="48" r="3.2" class="fill-lake stroke-none" />
      <circle cx="58" cy="60" r="3.2" class="fill-pine stroke-none" />
    </g>
  )
}

/** Open folio + walking horizon — inquiry that leaves the stack. */
function StudyGlyph() {
  return (
    <g fill="none" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M30 34L50 42V70L30 62V34Z" class="stroke-pine" />
      <path d="M70 34L50 42V70L70 62V34Z" class="stroke-pine" />
      <path d="M28 78H48M72 78H56" class="stroke-lake" />
      <circle cx="52" cy="78" r="3.2" class="fill-lake stroke-none" />
    </g>
  )
}

/** Engineering-drawing ground. No photorealism. */
export function IndustrialGround(props: { kind: "export" | "field" }): JSX.Element {
  return (
    <svg
      class="absolute inset-0 h-full w-full"
      viewBox="0 0 900 280"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="900" height="280" class="fill-paper dark:fill-ink" />
      <g
        class="stroke-pine/25 dark:stroke-lake/20"
        fill="none"
        stroke-width="0.8"
      >
        {Array.from({ length: 19 }, (_, i) => (
          <line x1={i * 50} y1="0" x2={i * 50} y2="280" />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <line x1="0" y1={i * 40} x2="900" y2={i * 40} />
        ))}
      </g>
      {props.kind === "export" ? <ExportGround /> : <FieldGround />}
    </svg>
  )
}

function ExportGround() {
  return (
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <rect
        x="70"
        y="48"
        width="310"
        height="176"
        rx="6"
        class="stroke-pine/55 dark:stroke-pine/45"
        stroke-width="1.6"
      />
      <rect
        x="96"
        y="74"
        width="198"
        height="124"
        rx="3"
        class="stroke-pine/40 dark:stroke-pine/30"
        stroke-width="1.1"
      />
      <path
        d="M126 96H264M126 128H240M126 160H252M126 176H210"
        class="stroke-lake/35 dark:stroke-lake/30"
        stroke-width="1"
      />
      <circle cx="470" cy="92" r="7" class="fill-pine/50 stroke-none" />
      <circle cx="560" cy="70" r="5" class="fill-lake/45 stroke-none" />
      <circle cx="620" cy="124" r="6" class="fill-pine/40 stroke-none" />
      <circle cx="540" cy="168" r="5" class="fill-lake/35 stroke-none" />
      <circle cx="690" cy="88" r="4" class="fill-pine/35 stroke-none" />
      <path
        d="M477 96L555 74M477 96L614 122M477 96L538 164M560 76L616 120M616 124L686 90"
        class="stroke-lake/40 dark:stroke-lake/30"
        stroke-width="1.1"
      />
      <path
        d="M80 236H820M80 244H820"
        class="stroke-pine/30 dark:stroke-lake/20"
        stroke-width="1.2"
      />
      <path
        d="M640 236L720 200H800"
        class="stroke-lake/50 dark:stroke-lake/35"
        stroke-width="1.4"
        stroke-dasharray="5 4"
      />
      <path
        d="M788 194L800 200L788 206"
        class="stroke-lake/60 dark:stroke-lake/40"
        stroke-width="1.4"
      />
    </g>
  )
}

function FieldGround() {
  return (
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <rect
        x="64"
        y="52"
        width="220"
        height="150"
        class="stroke-pine/50 dark:stroke-pine/40"
        stroke-width="1.5"
      />
      <rect
        x="300"
        y="52"
        width="250"
        height="88"
        class="stroke-pine/40 dark:stroke-pine/30"
        stroke-width="1.2"
      />
      <rect
        x="300"
        y="152"
        width="250"
        height="50"
        class="stroke-lake/35 dark:stroke-lake/25"
        stroke-width="1.1"
      />
      <path
        d="M64 112H284M174 52V202"
        class="stroke-pine/30 dark:stroke-lake/20"
        stroke-width="1"
      />
      <circle cx="620" cy="96" r="8" class="fill-pine/55 stroke-none" />
      <circle cx="710" cy="96" r="8" class="fill-lake/45 stroke-none" />
      <circle cx="800" cy="96" r="8" class="fill-pine/40 stroke-none" />
      <path
        d="M628 96H702M718 96H792"
        class="stroke-lake/40 dark:stroke-lake/30"
        stroke-width="1.3"
        stroke-dasharray="4 3"
      />
      <path
        d="M80 236H840"
        class="stroke-pine/35 dark:stroke-lake/25"
        stroke-width="1.4"
      />
      <path
        d="M200 236V214H620V96"
        class="stroke-lake/40 dark:stroke-lake/30"
        stroke-width="1.2"
      />
    </g>
  )
}
