import type { CollectionEntry } from "astro:content"
import { createEffect, createSignal, For, onMount } from "solid-js"
import Fuse from "fuse.js"
import ArrowCard from "@components/ArrowCard"
import { cn } from "@lib/utils"
import SearchBar from "@components/SearchBar"
import type { Locale } from "@i18n/config"
import { entryMatchesTopic } from "@i18n/topics"

type TopicOption = {
  id: string
  label: string
}

type Props = {
  entry_name: string
  topics: TopicOption[]
  data: CollectionEntry<"blog">[] | CollectionEntry<'projects'>[]
  locale?: Locale
  labels?: {
    tags: string
    showing: string
    of: string
    ascending: string
    descending: string
    placeholder: string
  }
}

export default function SearchCollection({ entry_name, data, topics, locale = "zh", labels }: Props) {
  const coerced = data.map((entry) => entry as CollectionEntry<'blog'>);
  const copy = {
    tags: labels?.tags ?? "Tags",
    showing: labels?.showing ?? "SHOWING",
    of: labels?.of ?? "OF",
    ascending: labels?.ascending ?? "ASCENDING",
    descending: labels?.descending ?? "DESCENDING",
    placeholder: labels?.placeholder ?? `Search ${entry_name}`,
  }

  const [query, setQuery] = createSignal("");
  const [filter, setFilter] = createSignal(new Set<string>())
  const [collection, setCollection] = createSignal<CollectionEntry<'blog'>[]>([])
  const [descending, setDescending] = createSignal(false);

  const fuse = new Fuse(coerced, {
    keys: ["slug", "data.title", "data.summary", "data.tags"],
    includeMatches: true,
    minMatchCharLength: 2,
    threshold: 0.4,
  })

  createEffect(() => {
    const filtered = (query().length < 2
      ? coerced
      : fuse.search(query()).map((result) => result.item)
    ).filter((entry) =>
      Array.from(filter()).every((topicId) =>
        entryMatchesTopic(entry.data.tags, topicId)
      )
    );
    setCollection(descending() ? filtered.toReversed() : filtered)
  })

  function toggleDescending() {
    setDescending(!descending())
  }

  function toggleTag(tag: string) {
    setFilter((prev) =>
      new Set(prev.has(tag)
        ? [...prev].filter((t) => t !== tag)
        : [...prev, tag]
      )
    )
  }

  function clearFilters() {
    setFilter(new Set<string>());
  }

  const onSearchInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    setQuery(target.value)
  }

  onMount(() => {
    const wrapper = document.getElementById("search-collection-wrapper");
    if (wrapper) {
      wrapper.style.minHeight = "unset";
    }
  })

  return (
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="col-span-3 sm:col-span-1">
        <div class="sticky top-24 mt-7">
          <SearchBar onSearchInput={onSearchInput} query={query} setQuery={setQuery} placeholderText={copy.placeholder} />
          <div class="relative flex flex-row justify-between w-full"><p class="meta my-4 text-black dark:text-white">{copy.tags}</p>
            {filter().size > 0 && (
              <button
                onClick={clearFilters}
                aria-label="Clear filters"
                class="absolute flex justify-center items-center h-full w-10 right-0 top-0 stroke-black/40 dark:stroke-white/40 hover:stroke-pine dark:hover:stroke-lake-light blend"
              >
                <svg class="size-5">
                  <use href={`/ui.svg#x`} />
                </svg>
              </button>
            )}</div>
          <ul class="flex flex-wrap sm:flex-col gap-1.5">
            <For each={topics}>
              {(topic) => (
                <li class="sm:w-full">
                  <button
                    onClick={() => toggleTag(topic.id)}
                    class={cn(
                      "w-full px-2 py-1.5 rounded text-sm text-left",
                      "flex gap-2 items-start",
                      "bg-black/[0.04] dark:bg-white/[0.06]",
                      "hover:bg-black/[0.08] hover:dark:bg-white/10",
                      "blend",
                      filter().has(topic.id) && "text-black dark:text-white"
                    )}
                  >
                    <svg
                      class={cn(
                        "shrink-0 size-5 mt-0.5 fill-black/40 dark:fill-white/40",
                        "blend",
                        filter().has(topic.id) && "fill-pine dark:fill-lake-light"
                      )}
                    >
                      <use
                        href={`/ui.svg#square`}
                        class={cn(!filter().has(topic.id) ? "block" : "hidden")}
                      />
                      <use
                        href={`/ui.svg#square-check`}
                        class={cn(filter().has(topic.id) ? "block" : "hidden")}
                      />
                    </svg>

                    <span class="block min-w-0 leading-snug">
                      {topic.label}
                    </span>
                  </button>

                </li>
              )}
            </For>
          </ul>
        </div>
      </div>
      <div class="col-span-3 sm:col-span-2">
        <div class="flex flex-col">
          <div class='flex justify-between flex-row mb-2 items-center'>
            <div class="meta">
              {copy.showing} {collection().length} {copy.of} {data.length} {entry_name}
            </div>
            <button onClick={toggleDescending} class='flex flex-row gap-1 items-center stroke-black/40 dark:stroke-white/40 hover:stroke-pine dark:hover:stroke-lake-light blend'>
              <div class="meta">
                {descending() ? copy.descending : copy.ascending}
              </div>
              <svg
                class="size-5"
              >
                <use href={`/ui.svg#sort-descending`} class={descending() ? "block" : "hidden"}></use>
                <use href={`/ui.svg#sort-ascending`} class={descending() ? "hidden" : "block"}></use>
              </svg>
            </button>
          </div>
          <ul class="flex flex-col gap-3">
            {collection().map((entry) => (
              <li>
                <ArrowCard entry={entry} locale={locale} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
