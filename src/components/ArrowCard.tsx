import { formatDate } from "@lib/utils"
import type { CollectionEntry } from "astro:content"
import type { Locale } from "@i18n/config"
import { localizePath } from "@i18n/utils"
import { localizeVisibleTags } from "@i18n/topics"

type Props = {
  entry: CollectionEntry<"blog"> | CollectionEntry<"projects">
  pill?: boolean
  locale?: Locale
}

export default function ArrowCard({ entry, pill, locale = "zh" }: Props) {
  const href = localizePath(`/${entry.collection}/${entry.slug}/`, locale)
  const cover = entry.data.cover
  const tags =
    entry.collection === "projects"
      ? localizeVisibleTags(entry.data.tags, locale, "projects")
      : entry.data.tags

  return (
    <a
      href={href}
      class="edge-glow cursor-glow group flex items-center gap-4 rounded-lg border border-black/15 p-4 blend hover:bg-paper-sunken dark:border-white/20 dark:hover:bg-ink-soft"
    >
      {cover && (
        <img
          src={cover.src}
          alt={cover.alt}
          loading="lazy"
          decoding="async"
          class="hidden sm:block size-16 shrink-0 rounded-md object-cover border border-black/10 dark:border-white/15"
        />
      )}

      <div class="w-full group-hover:text-black group-hover:dark:text-white blend">
        <div class="flex flex-wrap items-center gap-2">
          {pill && (
            <div class="meta rounded-full border border-black/15 px-2 py-0.5 dark:border-white/25">
              {entry.collection === "blog" ? "post" : "project"}
            </div>
          )}
          <div class="meta">{formatDate(entry.data.date, locale)}</div>
        </div>

        <div class="mt-2.5 font-semibold text-black dark:text-white line-clamp-2">
          {entry.data.title}
        </div>

        <div class="mt-1 text-sm opacity-75 line-clamp-2">{entry.data.summary}</div>

        {tags.length > 0 && (
          <ul class="mt-2.5 flex flex-wrap gap-1 list-none pl-0">
            {tags.map((tag: string) => (
              <li class="meta normal-case rounded bg-black/5 px-2 py-0.5 dark:bg-white/10">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="shrink-0 stroke-current group-hover:stroke-pine group-hover:dark:stroke-lake-light"
      >
        <line
          x1="5"
          y1="12"
          x2="19"
          y2="12"
          class="scale-x-0 translate-x-4 transition-all duration-300 ease-paper group-hover:scale-x-100 group-hover:translate-x-1"
        />
        <polyline
          points="12 5 19 12 12 19"
          class="translate-x-0 transition-all duration-300 ease-paper group-hover:translate-x-1"
        />
      </svg>
    </a>
  )
}
