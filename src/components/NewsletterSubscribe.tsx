import { createSignal } from "solid-js"
import type { Locale } from "@i18n/config"

type Labels = {
  title: string
  hint: string
  placeholder: string
  submit: string
  success: string
  invalid: string
}

type Props = {
  locale: Locale
  labels: Labels
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function NewsletterSubscribe(props: Props) {
  const [email, setEmail] = createSignal("")
  const [status, setStatus] = createSignal<"idle" | "ok" | "error">("idle")

  const onSubmit = (event: Event) => {
    event.preventDefault()
    const value = email().trim()
    if (!EMAIL_RE.test(value)) {
      setStatus("error")
      return
    }

    try {
      const key = "junark-newsletter-priority"
      const existing = JSON.parse(localStorage.getItem(key) || "[]") as string[]
      if (!existing.includes(value.toLowerCase())) {
        existing.push(value.toLowerCase())
        localStorage.setItem(key, JSON.stringify(existing))
      }
    } catch {
      // localStorage may be unavailable; still show success for UX
    }

    setStatus("ok")
    setEmail("")
  }

  return (
    <section
      class="edge-glow relative overflow-hidden rounded-lg border border-black/15 p-5 dark:border-white/20 md:p-7"
      aria-labelledby="newsletter-title"
    >
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-r from-paper via-paper-raised to-paper-sunken dark:from-ink dark:via-ink-raised dark:to-ink-soft"
        aria-hidden="true"
      />
      <div class="relative z-10">
        <h2
          id="newsletter-title"
          class={`text-xl font-semibold text-black dark:text-white md:text-2xl ${
            props.locale === "en" ? "font-display tracking-[0.04em]" : "font-serif"
          }`}
        >
          {props.labels.title}
        </h2>
        <p class="mt-2 max-w-2xl text-sm leading-relaxed opacity-75 md:text-base">
          {props.labels.hint}
        </p>

        {status() === "ok" ? (
          <p
            class="mt-5 rounded border border-pine/30 bg-paper-raised px-4 py-3 text-sm text-pine dark:border-lake/40 dark:bg-ink-raised dark:text-lake-light"
            role="status"
          >
            {props.labels.success}
          </p>
        ) : (
          <form class="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start" onSubmit={onSubmit}>
            <div class="min-w-0 flex-1 space-y-1.5">
              <label class="sr-only" for="newsletter-email">
                {props.labels.placeholder}
              </label>
              <input
                id="newsletter-email"
                class="field w-full"
                type="email"
                name="email"
                autocomplete="email"
                required
                placeholder={props.labels.placeholder}
                value={email()}
                onInput={(e) => {
                  setEmail(e.currentTarget.value)
                  if (status() === "error") setStatus("idle")
                }}
              />
              {status() === "error" && (
                <p class="field-error meta" role="alert">
                  {props.labels.invalid}
                </p>
              )}
            </div>
            <button
              type="submit"
              class="edge-glow shrink-0 rounded-md border border-black/15 bg-white px-5 py-2.5 text-sm text-black blend hover:bg-paper-sunken dark:border-white/20 dark:bg-ink-raised dark:text-white dark:hover:bg-ink-soft"
            >
              {props.labels.submit}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
