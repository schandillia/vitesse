import { env } from "@/env"

const BRANDNAME = "Oolway"
const BRANDDOMAIN = "oolway.com"
const EMAILSENDERNAME = "Amit"

export const siteConfig = {
  brand: {
    name: BRANDNAME,
    domain: BRANDDOMAIN,
    url: env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    copyrightStartYear: 2023,
  },

  authAndSession: {
    callbackAfterLogin: "/dashboard",
    expiresInDays: 30,
    updateAgeInDays: 1,
    cookieMaxAgeInMinutes: 5,
    logOutEverywhereInstantly: true,
    enableSessionWatcher: true,
  },

  uploads: {
    avatarSizeLimitInMB: 5,
  },

  emails: {
    genericUser: "User",
    support: {
      sender: `Team ${BRANDNAME}`,
      email: "onboarding@resend.dev",
    },
    contact: {
      sender: `Team ${BRANDNAME}`,
      fromEmail: "onboarding@resend.dev",
      toEmail: `contact@${BRANDDOMAIN}`,
    },
    welcome: {
      sender: `${EMAILSENDERNAME} from ${BRANDNAME}`,
      fromEmail: "onboarding@resend.dev",
    },
    magicLink: {
      sender: `${BRANDNAME} Accounts`,
      fromEmail: "onboarding@resend.dev",
    },
    privacy: {
      sender: `${BRANDNAME} Privacy Officer`,
      toEmail: `privacy@${BRANDDOMAIN}`,
    },
  },

  seo: {
    verification: {
      google: "",
      bing: "",
    },
    metaData: {
      home: {
        title: `${BRANDNAME}, The best starter for Next.js 16`,
        description: `${BRANDNAME} is a Next.js 16 starter template with everything you need to build a modern web app, including authentication, database, and more.`,
      },
      dashboard: {
        title: "Dashboard",
        description: "Your personal dashboard.",
      },
      profile: {
        title: "Profile",
        description: "Manage your profile data.",
      },
      security: {
        title: "Security",
        description: "Manage your account security.",
      },
      settings: {
        title: "Settings",
        description: "Manage your account settings.",
      },
      login: {
        title: "Login",
        description: "Sign in to your account.",
      },
      pricing: {
        title: "Pricing",
        description: "Choose the plan that works best for you.",
      },
      features: {
        title: "Features",
        description: `Explore the features of ${BRANDNAME}.`,
      },
      docs: {
        title: "Documentation",
        description: `Find out how ${BRANDNAME} works.`,
      },
      blog: {
        title: "Blog",
        description: `Thoughts, updates, and insights from the ${BRANDNAME} team.`,
      },
      contact: {
        title: "Contact",
        description: "Get in touch with us.",
      },
      about: {
        title: "About",
        description: `Learn more about ${BRANDNAME}.`,
      },
      cookies: {
        title: "Cookies",
        description: "Learn more about cookies.",
      },
    },
  },

  observability: {
    sentry: {
      enabled: false,
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      sendDefaultPii: true,
    },
    enablePostHog: true,
  },

  security: {
    arcjet: {
      enabled: true,
      rateLimits: {
        authRestrictive: {
          max: 10,
          interval: "10m",
        },
        authLax: {
          max: 60,
          interval: "1m",
        },
        contact: {
          max: 5,
          interval: "15m",
        },
      },
    },
  },
}

export type SiteConfig = typeof siteConfig
