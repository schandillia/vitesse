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
  users: {
    defaultName: "User",
    maxNameLength: 100,
    minNameLength: 2,
    maxUsernameLength: 30,
    minUsernameLength: 3,
    maxBioLength: 160,
    minBioLength: 10,
  },

  uploads: {
    avatarSizeLimitInMB: 5,
  },

  blog: {
    pageHeading: `${BRANDNAME} Blog`,
    pageSubHeading:
      "Dispatches on product, performance, and scaling at the edge.",
  },

  legal: {
    grievance: {
      officerName: "Amit Schandillia",
      designation: "Grievance Officer",
      workingHours: "Monday through Friday, 10:00 AM to 6:00 PM IST",
      address: "Navi Mumbai, Maharashtra, India",
    },
  },

  emails: {
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
    grievance: {
      sender: `${BRANDNAME} Grievance Officer`,
      toEmail: `grievance@${BRANDDOMAIN}`,
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
      terms: {
        title: "Terms",
        description: "Learn more about our terms of service.",
      },
      privacy: {
        title: "Privacy",
        description: "Learn more about our privacy policy.",
      },
      grievance: {
        title: "Grievance",
        description: "Learn more about our grievance redressal policy.",
      },
      admin: {
        title: "Admin",
        description: "Manage your account.",
      },
    },
  },

  analytics: {
    postHog: {
      enabled: true,
      capturePageviews: true,
    },
  },

  monitoring: {
    sentry: {
      enabled: false,
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      sendDefaultPii: true,
    },
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
