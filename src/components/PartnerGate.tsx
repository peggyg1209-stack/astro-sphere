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
  const [ready, setReady] = createSignal(false)
  const [value, setValue] = createSignal("")
  const [error, setError] = createSignal(false)

  const expected = () => props.password?.trim() || DEFAULT_PASSWORD

  onMount(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") {
        setUnlocked(true)
      }
    } catch {
      // ignore
    }
    setReady(true)
  })

  const onSubmit = (event: Event) => {
    event.preventDefault()
    if (value().trim() === expected()) {
      try {
        localStorage.setItem(STORAGE_KEY, "1")
      } catch {
        // ignore
      }
      setError(false)
      setUnlocked(true)
      return
    }
    setError(true)
  }

  return (
    <Show when={ready() && !unlocked()}>
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
              class="field w-full"
              type="password"
              autocomplete="current-password"
              placeholder={props.labels.placeholder}
              value={value()}
              onInput={(e) => {
                setValue(e.currentTarget.value)
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
