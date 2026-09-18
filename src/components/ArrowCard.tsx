import { formatDate } from "@lib/utils"
import { localizedProjectCopy } from "@lib/project"
import type { CollectionEntry } from "astro:content"
import type { Locale } from "@i18n/config"
import { localizePath } from "@i18n/utils"
import { localizeVisibleTags } from "@i18n/topics"
import { IndustrialGround, ProjectMark, type ProjectMarkId } from "@components/ProjectVisuals"
import { cn } from "@lib/utils"

type Props = {
  entry: CollectionEntry<"blog"> | CollectionEntry<"projects">
  pill?: boolean
  locale?: Locale
  /** Homepage only: atmosphere ground + grain. */
  featured?: boolean
}

export default function ArrowCard(props: Props) {
  const locale = () => props.locale ?? "zh"
  const href = () => localizePath(`/${props.entry.collection}/${props.entry.slug}/`, locale())
  const isProject = () => props.entry.collection === "projects"
  const project = () => (isProject() ? (props.entry as CollectionEntry<"projects">).data : null)
  const copy = () => {
    const data = project()
    if (data) return localizedProjectCopy(data, locale())
    return { title: props.entry.data.title, summary: props.entry.data.summary }
  }
  const tags = () =>
    isProject()
      ? localizeVisibleTags(props.entry.data.tags, locale(), "projects")
      : props.entry.data.tags
  const mark = () => project()?.mark as ProjectMarkId | undefined
  const status = () => project()?.status
  const atmosphere = () => (props.featured ? project()?.atmosphere : undefined)
  const film = () => atmosphere() === "film" ? project()?.cover : undefined

  return (
    <a
      href={href()}
      class={cn(
        "edge-glow cursor-glow group relative flex overflow-hidden rounded-lg border border-black/15 blend",
        "hover:bg-paper-sunken dark:border-white/20 dark:hover:bg-ink-soft",
        props.featured ? "min-h-[13.5rem] items-stretch gap-4 p-0" : "items-center gap-4 p-4",
      )}
    >
      {atmosphere() === "industrial" && mark() && mark() !== "study" && (
        <IndustrialGround kind={mark() === "field" ? "field" : "export"} />
      )}
      {film() && (
        <img
          src={film()!.src}
          alt=""
          aria-hidden="true"
          class="absolute inset-0 h-full w-full object-cover opacity-70 dark:opacity-50"
        />
      )}
      {props.featured && (
        <>
          <div
            class="project-card-grain pointer-events-none absolute inset-0"
            aria-hidden="true"
          />
          <div
            class={cn(
              "pointer-events-none absolute inset-0",
              atmosphere() === "film"
                ? "bg-gradient-to-r from-paper/82 via-paper/62 to-paper/20 dark:from-ink/78 dark:via-ink/52 dark:to-ink/22"
                : "bg-gradient-to-r from-paper/92 via-paper/78 to-paper/42 dark:from-ink/94 dark:via-ink/80 dark:to-ink/40",
            )}
            aria-hidden="true"
          />
        </>
      )}

      <div
        class={cn(
          "relative z-10 flex w-full items-center gap-4",
          props.featured ? "p-5 md:p-6" : "",
        )}
      >
        {mark() && (
          <ProjectMark
            kind={mark()!}
            class="size-10 shrink-0 sm:size-11"
          />
        )}

        <div class="w-full min-w-0 group-hover:text-black group-hover:dark:text-white blend">
          <div class="flex flex-wrap items-center gap-2">
            {props.pill && (
              <div class="meta rounded-full border border-black/15 px-2 py-0.5 dark:border-white/25">
                {props.entry.collection === "blog" ? "post" : "project"}
              </div>
            )}
            {status() && (
              <span class="font-mono text-[0.62rem] font-medium uppercase tracking-[0.16em] text-pine dark:text-lake-light">
                [{status()}]
              </span>
            )}
            <div class="meta">{formatDate(props.entry.data.date, locale())}</div>
          </div>

          <div class="mt-2.5 font-semibold leading-snug text-black dark:text-white line-clamp-2">
            {copy().title}
          </div>

          <div class="mt-1 text-sm opacity-75 line-clamp-2">{copy().summary}</div>

          {tags().length > 0 && (
            <ul class="mt-2.5 flex flex-wrap gap-1.5 list-none pl-0">
              {tags().map((tag: string) => (
                isProject() ? (
                  <li class="font-mono text-[0.62rem] tracking-[0.08em] text-black/65 dark:text-white/65">
                    #{tag}
                  </li>
                ) : (
                  <li class="meta normal-case rounded bg-black/5 px-2 py-0.5 dark:bg-white/10">
                    {tag}
                  </li>
                )
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
          class="relative z-10 shrink-0 stroke-current group-hover:stroke-pine group-hover:dark:stroke-lake-light"
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
      </div>
    </a>
  )
}
