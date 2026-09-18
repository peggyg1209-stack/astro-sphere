import { defineCollection, z } from "astro:content"

/**
 * Reserved media slots for projects and blog posts.
 *
 * Paths are plain URLs resolved against `public/`, e.g. `/media/foo.jpg`, so a
 * slot can be declared in frontmatter before the asset exists.
 */
const mediaImage = z.object({
  /** URL under `public/`, e.g. `/media/projects/foo.jpg` */
  src: z.string(),
  /** Alt text. Keep it meaningful — it is read out and indexed. */
  alt: z.string().default(""),
  /** Optional caption rendered under the image in mono microcopy. */
  caption: z.string().optional(),
})

const mediaAudio = z.object({
  /** URL under `public/`, e.g. `/media/blog/episode-01.mp3` */
  src: z.string(),
  /** Track title shown next to the player. */
  title: z.string().optional(),
  /** Human-readable length, e.g. `12:04`. Displayed as metadata. */
  duration: z.string().optional(),
  /** Optional link to a transcript page or file. */
  transcript: z.string().optional(),
})

const mediaVideo = z.object({
  /** URL under `public/`, e.g. `/media/projects/walk.mp4` */
  src: z.string(),
  /** Optional still shown before play. */
  poster: z.string().optional(),
  title: z.string().optional(),
  caption: z.string().optional(),
})

/** Fields shared by the two content-bearing collections. */
const mediaFields = {
  /** Lead image, rendered above the article body. */
  cover: mediaImage.optional(),
  /** Image set rendered after the article body. */
  gallery: z.array(mediaImage).default([]),
  /** Video clips rendered after the article body. */
  video: z.array(mediaVideo).default([]),
  /** Audio tracks rendered after the article body. */
  audio: z.array(mediaAudio).default([]),
  /**
   * Render placeholders for whichever cover / gallery / video / audio slots
   * are still empty, so every project and post has the same media rhythm
   * whether or not the assets have landed. Set to `false` to hide empty slots.
   */
  reserveMedia: z.boolean().default(true),
}

const localizedCopyFields = {
  /** Japanese title. Falls back to `title`. */
  titleJa: z.string().optional(),
  /** English title. Falls back to `title`. */
  titleEn: z.string().optional(),
  /** Japanese summary. Falls back to `summary`. */
  summaryJa: z.string().optional(),
  /** English summary. Falls back to `summary`. */
  summaryEn: z.string().optional(),
}

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    draft: z.boolean().optional(),
    ...localizedCopyFields,
    ...mediaFields,
  }),
})

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    draft: z.boolean().optional(),
    demoUrl: z.string().optional(),
    repoUrl: z.string().optional(),
    /** Compact geometric mark on cards. */
    mark: z.enum(["export", "field", "study"]).optional(),
    /** Monospace status token, e.g. EXPORT. */
    status: z.string().optional(),
    /** Homepage card atmosphere. List pages ignore this. */
    atmosphere: z.enum(["industrial", "film"]).optional(),
    ...localizedCopyFields,
    ...mediaFields,
  }),
})

const legal = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
  }),
})

export const collections = { blog, projects, legal }

export type MediaImage = z.infer<typeof mediaImage>
export type MediaAudio = z.infer<typeof mediaAudio>
export type MediaVideo = z.infer<typeof mediaVideo>
