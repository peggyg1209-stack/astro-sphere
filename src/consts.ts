import type { Site, Page, Socials } from "@types"

export const SITE: Site = {
  TITLE: "Peggy Gao",
  DESCRIPTION: "Portfolio, projects, and writing by Peggy Gao.",
  AUTHOR: "Peggy Gao",
}

export const BLOG: Page = {
  TITLE: "Blogs",
  DESCRIPTION: "Writing on topics I am passionate about.",
}

export const PROJECTS: Page = {
  TITLE: "Projects",
  DESCRIPTION: "Recent projects I have worked on.",
}

export const SEARCH: Page = {
  TITLE: "Search",
  DESCRIPTION: "Search all posts and projects by keyword.",
}

/**
 * The "Send me a message" form lives on-page (components/ConsultForm.astro) and
 * relays into Lark rather than a third-party scheduler. This is the in-page
 * anchor the header, footer, and project pages link to.
 */
export const CONSULT = {
  ANCHOR: "contact",
}

export const EMAIL = {
  HREF: "mailto:peggyg1209@gmail.com",
  TEXT: "peggyg1209@gmail.com",
}

export const LINKEDIN = {
  HREF: "https://www.linkedin.com/in/yang-gao-759722113/",
  TEXT: "linkedin.com/in/yang-gao-759722113",
}

export const PHONES = [
  {
    id: "cn",
    flag: "🇨🇳",
    display: "86-18001290093",
    href: "tel:+8618001290093",
  },
  {
    id: "jp",
    flag: "🇯🇵",
    display: "81-070-8908-8709",
    href: "tel:+817089088709",
  },
] as const

export const WECHAT = {
  ID: "Tutugao129",
}

export const SOCIALS: Socials = [
  {
    NAME: "LinkedIn",
    ICON: "linkedin",
    TEXT: LINKEDIN.TEXT,
    HREF: LINKEDIN.HREF,
  },
  {
    NAME: "Email",
    ICON: "email",
    TEXT: EMAIL.TEXT,
    HREF: EMAIL.HREF,
  },
]
