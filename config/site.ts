import { env } from "@/env"
import { BRANDNAME, BRANDDOMAIN, EMAILSENDERNAME } from "@/config/constants"
import { metaData } from "@/config/metadata"

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
    blogImageSizeLimitInMB: 10,
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
    provider: "resend", // or sendgrid or nodemailer
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
    metaData,
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

  auditLogs: {
    retentionDays: 90,
    activityFeedLimit: 10,
  },

  admin: {
    usersPageSize: 10,
  },
}

export type SiteConfig = typeof siteConfig
