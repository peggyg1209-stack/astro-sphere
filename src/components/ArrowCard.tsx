import { formatDate, readingTime } from "@lib/utils"
import { localizedEntryBody, localizedEntryCopy } from "@lib/project"
import type { CollectionEntry } from "astro:content"
import type { Locale } from "@i18n/config"
import { localizePath } from "@i18n/utils"
import { localizeVisibleTags } from "@i18n/topics"
import { IndustrialGround, ProjectMark, type ProjectMarkId } from "@components/ProjectVisuals"
import { cn } from "@lib/utils"
import { t } from "@i18n/ui"

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
  const copy = () => localizedEntryCopy(props.entry, locale())
  const tags = () =>
    localizeVisibleTags(props.entry.data.tags, locale(), props.entry.collection)
  const mark = () => project()?.mark as ProjectMarkId | undefined
  const status = () => project()?.status
  const atmosphere = () => (props.featured ? project()?.atmosphere : undefined)
  const film = () => atmosphere() === "film" ? project()?.cover : undefined
  const meta = () => {
    if (!isProject()) return formatDate(props.entry.data.date, locale())
    const body = localizedEntryBody("projects", props.entry.slug, locale(), props.entry.body)
    return readingTime(body, t(locale(), "minRead"))
  }

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
          class="absolute inset-0 h-full w-full object-cover opacity-[0.42] dark:opacity-[0.38]"
        />
      )}
      {props.featured && (
        <>
          <div
            class="project-card-grain pointer-events-none absolute inset-0"
            aria-hidden="true"
          />
          {atmosphere() === "film" ? (
            <>
              <div
                class="pointer-events-none absolute inset-0 bg-gradient-to-r from-paper from-[8%] via-paper/90 via-48% to-paper/38 dark:hidden"
                aria-hidden="true"
              />
              <div
                class="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-ink from-[12%] via-ink/92 via-52% to-ink/48 dark:block"
                aria-hidden="true"
              />
            </>
          ) : (
            <div
              class={cn(
                "pointer-events-none absolute inset-0",
                "bg-gradient-to-r from-paper/96 via-paper/90 to-paper/62 dark:from-ink/94 dark:via-ink/80 dark:to-ink/40",
              )}
              aria-hidden="true"
            />
          )}
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

        <div
          class={cn(
            "w-full min-w-0 blend",
            props.featured
              ? "text-ink dark:text-white group-hover:text-ink dark:group-hover:text-white"
              : "group-hover:text-black group-hover:dark:text-white",
          )}
        >
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
            <div class={cn("meta", props.featured && "text-ink/80 dark:text-white/85")}>{meta()}</div>
          </div>

          <div
            class={cn(
              "mt-2.5 font-semibold leading-snug line-clamp-2",
              props.featured ? "text-ink dark:text-white" : "text-black dark:text-white",
            )}
          >
            {copy().title}
          </div>

          <div
            class={cn(
              "mt-1 text-sm line-clamp-2",
              props.featured ? "text-ink/88 dark:text-white/90" : "opacity-75",
            )}
          >
            {copy().summary}
          </div>

          {tags().length > 0 && (
            <ul class="mt-2.5 flex flex-wrap gap-1.5 list-none pl-0">
              {tags().map((tag: string) => (
                isProject() ? (
                  <li
                    class={cn(
                      "font-mono text-[0.62rem] tracking-[0.08em]",
                      props.featured
                        ? "text-ink/80 dark:text-white/80"
                        : "text-black/65 dark:text-white/65",
                    )}
                  >
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
