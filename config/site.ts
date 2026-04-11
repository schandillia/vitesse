export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Vitesse",
  description:
    "A high-performance Next.js SaaS boilerplate powered by Postgres, Redis, and BetterAuth.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  domain: "vitesse.com",
  callbackAfterLogin: "/dashboard",
  emails: {
    noReply: "onboarding@resend.dev",
    support: "support@vitesse.com",
  },
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Components",
      href: "/components",
    },
    {
      title: "Documentation",
      href: "/docs",
    },
  ],
  links: {
    github: "https://github.com/yourusername/vitesse",
    author: "https://schandillia.com",
  },
}
