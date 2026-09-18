import type { CollectionEntry } from "astro:content"
import { createEffect, createSignal } from "solid-js"
import Fuse from "fuse.js"
import ArrowCard from "@components/ArrowCard"
import SearchBar from "@components/SearchBar"
import type { Locale } from "@i18n/config"

type Props = {
  data: CollectionEntry<"blog">[]
  locale?: Locale
  placeholderText?: string
  foundLabel?: string
  resultsForLabel?: string
}

export default function Search({ data, locale = "zh", placeholderText, foundLabel, resultsForLabel }: Props) {
  const [query, setQuery] = createSignal("")
  const [results, setResults] = createSignal<CollectionEntry<"blog">[]>([])

  const fuse = new Fuse(data, {
    keys: ["slug", "data.title", "data.titleJa", "data.titleEn", "data.summary", "data.summaryJa", "data.summaryEn", "data.tags"],
    includeMatches: true,
    minMatchCharLength: 2,
    threshold: 0.4,
  })

  createEffect(() => {
    if (query().length < 2) {
      setResults([])
    } else {
      setResults(fuse.search(query()).map((result) => result.item))
    }
  })

  const onSearchInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    setQuery(target.value)
  }

  return (
    <div class="flex flex-col">
      <SearchBar onSearchInput={onSearchInput} query={query} setQuery={setQuery} placeholderText={placeholderText ?? "What are you looking for?"} />

      {(query().length >= 2 && results().length >= 1) && (
        <div class="mt-12">
          <div class="meta mb-3">
            {foundLabel ?? "Found"} {results().length} {resultsForLabel ?? "results for"} {`'${query()}'`}
          </div>
          <ul class="flex flex-col gap-3">
            {results().map(result => (
              <li>
                <ArrowCard entry={result} pill={true} locale={locale} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
