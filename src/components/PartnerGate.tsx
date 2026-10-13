import { createSignal, onMount, Show } from "solid-js"
import type { Locale } from "@i18n/config"

const STORAGE_KEY = "junark-partner-preview-auth"
const DEFAULT_PASSWORD = "PARTNER2026"

type Labels = {
  title: string
  hint: string
  placeholder: string
  submit: string
  error: string
}

type Props = {
  locale: Locale
  labels: Labels
  /** Override via PUBLIC_PARTNER_PREVIEW_PASSWORD when set. */
  password?: string
}

export default function PartnerGate(props: Props) {
  const [unlocked, setUnlocked] = createSignal(false)
  const [booted, setBooted] = createSignal(false)
  const [error, setError] = createSignal(false)
  let inputEl: HTMLInputElement | undefined

  const expected = () => props.password?.trim() || DEFAULT_PASSWORD

  onMount(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") {
        setUnlocked(true)
      }
    } catch {
      // ignore
    }
    setBooted(true)
  })

  const unlock = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1")
    } catch {
      // ignore
    }
    setError(false)
    setUnlocked(true)
  }

  const onSubmit = (event: Event) => {
    event.preventDefault()
    event.stopPropagation()
    // Read from the DOM so password managers / automation that skip input
    // events still work (Solid controlled values would stay empty).
    const typed = (inputEl?.value ?? "").trim()
    if (typed === expected()) {
      unlock()
      return
    }
    setError(true)
  }

  return (
    <Show when={booted() && !unlocked()}>
      <div
        class="fixed inset-0 z-[80] flex items-center justify-center bg-paper/92 px-5 backdrop-blur-sm dark:bg-ink/92"
        role="dialog"
        aria-modal="true"
        aria-labelledby="partner-gate-title"
      >
        <div class="edge-glow w-full max-w-md rounded-lg border border-black/15 bg-paper-raised p-6 shadow-sm dark:border-white/20 dark:bg-ink-raised md:p-8">
          <h2
            id="partner-gate-title"
            class={`text-2xl font-semibold text-black dark:text-white ${
              props.locale === "en" ? "font-display" : "font-serif"
            }`}
          >
            {props.labels.title}
          </h2>
          <p class="mt-2 text-sm opacity-75">{props.labels.hint}</p>

          <form class="mt-6 space-y-3" onSubmit={onSubmit}>
            <label class="sr-only" for="partner-gate-password">
              {props.labels.placeholder}
            </label>
            <input
              id="partner-gate-password"
              ref={inputEl}
              class="field w-full"
              type="password"
              name="password"
              autocomplete="current-password"
              placeholder={props.labels.placeholder}
              onInput={() => {
                if (error()) setError(false)
              }}
            />
            <Show when={error()}>
              <p class="field-error meta" role="alert">
                {props.labels.error}
              </p>
            </Show>
            <button
              type="submit"
              class="edge-glow w-full rounded-md border border-black/15 bg-white px-5 py-2.5 text-sm text-black blend hover:bg-paper-sunken dark:border-white/20 dark:bg-ink-soft dark:text-white"
            >
              {props.labels.submit}
            </button>
          </form>
        </div>
      </div>
    </Show>
  )
}
