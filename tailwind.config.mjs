import defaultTheme from "tailwindcss/defaultTheme"

/**
 * Visual system
 * - paper : 米灰纸质亮底 (light base)
 * - ink   : 深墨绿正文 (body copy / dark base)
 * - pine  : 松柏绿 — KV gradient start
 * - lake  : 湖蓝  — KV gradient end
 *
 * `black` and `white` are deliberately remapped onto ink/paper so that every
 * `text-black dark:text-white` pair in the codebase resolves to the ink-green
 * duotone instead of pure monochrome. Nothing in the UI should render #000/#fff.
 */
const paper = "#F8F9F6"
const ink = "#17221C"
const pine = "#2E6358"
const lake = "#477585"

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        white: paper,
        black: ink,
        paper: {
          DEFAULT: paper,
          raised: "#FCFCFA",
          sunken: "#F1F3EE",
        },
        ink: {
          DEFAULT: ink,
          soft: "#243329",
          raised: "#1D2A23",
        },
        pine: {
          DEFAULT: pine,
          light: "#3C7A6D",
        },
        lake: {
          DEFAULT: lake,
          light: "#5C8B9B",
        },
      },
      fontFamily: {
        // Latin display serif for large English headings
        display: ["Cormorant Garamond", "Noto Serif SC", ...defaultTheme.fontFamily.serif],
        // 思源宋体 — Chinese headings and body copy
        serif: [
          "Noto Serif SC",
          "Songti SC",
          "Source Han Serif SC",
          "Hiragino Mincho ProN",
          "Yu Mincho",
          ...defaultTheme.fontFamily.serif,
        ],
        sans: [
          "Noto Serif SC",
          "Songti SC",
          "Source Han Serif SC",
          "Hiragino Mincho ProN",
          "Yu Mincho",
          ...defaultTheme.fontFamily.serif,
        ],
        // Metadata / status microcopy
        mono: ["JetBrains Mono Variable", "JetBrains Mono", ...defaultTheme.fontFamily.mono],
      },
      backgroundImage: {
        "kv-gradient": `linear-gradient(115deg, ${pine} 0%, ${lake} 100%)`,
        "kv-gradient-soft": `linear-gradient(115deg, ${pine}00 0%, ${pine}2E 35%, ${lake}2E 65%, ${lake}00 100%)`,
      },
      /**
       * Prose colours are driven by the same CSS variables as the rest of the
       * UI, so `html.dark` flips article copy without needing `prose-invert`.
       */
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "full",
            "--tw-prose-body": "rgb(var(--copy) / 0.82)",
            "--tw-prose-headings": "rgb(var(--copy))",
            "--tw-prose-lead": "rgb(var(--copy) / 0.7)",
            "--tw-prose-links": "rgb(var(--pine))",
            "--tw-prose-bold": "rgb(var(--copy))",
            "--tw-prose-counters": "rgb(var(--copy) / 0.6)",
            "--tw-prose-bullets": "rgb(var(--pine) / 0.45)",
            "--tw-prose-hr": "rgb(var(--edge) / var(--edge-opacity))",
            "--tw-prose-quotes": "rgb(var(--copy) / 0.75)",
            "--tw-prose-quote-borders": "rgb(var(--pine) / 0.4)",
            "--tw-prose-captions": "rgb(var(--copy) / 0.6)",
            "--tw-prose-code": "rgb(var(--copy))",
            "--tw-prose-th-borders": "rgb(var(--edge) / var(--edge-opacity))",
            "--tw-prose-td-borders": "rgb(var(--edge) / var(--edge-opacity))",
            "--tw-prose-pre-code": "rgb(var(--paper))",
            "--tw-prose-pre-bg": "rgb(var(--ink))",
            a: {
              textDecorationThickness: "0.5px",
              textUnderlineOffset: "3px",
              transitionProperty: "color",
              transitionDuration: "300ms",
              "&:hover": { color: "rgb(var(--lake))" },
            },
          },
        },
      },
      animation: {
        "kv-drift": "kv-drift 22s ease-in-out infinite",
        "rise": "rise 1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        "kv-drift": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)", opacity: 0.55 },
          "50%": { transform: "translate3d(0, -2%, 0) scale(1.04)", opacity: 0.8 },
        },
        rise: {
          from: { opacity: 0, transform: "translateY(24px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
      transitionTimingFunction: {
        paper: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
