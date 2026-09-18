type Props = {
  onSearchInput: (e: Event) => void
  query: () => string
  setQuery: (value: string) => void
  placeholderText: string
}

export default function SearchBar({ onSearchInput, query, setQuery, placeholderText }: Props) {
  return (
    <div class="relative">
      <svg class="pointer-events-none absolute left-2.5 top-[0.55rem] size-5 stroke-black/40 dark:stroke-white/40">
        <use href="/ui.svg#search" />
      </svg>

      <input
        name="search"
        type="text"
        value={query()}
        onInput={onSearchInput}
        autocomplete="off"
        spellcheck={false}
        placeholder={placeholderText}
        class="w-full rounded-md border border-black/10 bg-paper-raised px-10 py-2 text-black outline-none blend placeholder:text-black/40 hover:border-black/20 focus:border-pine/60 dark:border-white/15 dark:bg-ink-raised dark:text-white dark:placeholder:text-white/40 dark:hover:border-white/25 dark:focus:border-lake/60"
      />

      {query().length > 0 && (
        <button
          onClick={() => setQuery("")}
          aria-label="Clear search"
          class="absolute right-0 top-0 flex h-full w-10 items-center justify-center stroke-black/40 blend hover:stroke-pine dark:stroke-white/40 dark:hover:stroke-lake-light"
        >
          <svg class="size-5">
            <use href="/ui.svg#x" />
          </svg>
        </button>
      )}
    </div>
  )
}
