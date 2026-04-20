import { env } from "@/env"

const brandName = "Vitesse"
const brandDomain = "vitesse.com"
const emailSenderName = "Amit"

export const siteConfig = {
  brand: {
    backgroundColor: "#0f0f0f",
    themeColor: "#0f0f0f",
  },
  name: brandName,
  copyrightStartYear: 2023,
  url: env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  domain: brandDomain,
  callbackAfterLogin: "/dashboard",
  expiresInDays: 30,
  updateAgeInDays: 1,
  cookieMaxAgeInMinutes: 5,
  logOutEverywhereInstantly: true,
  enableSessionWatcher: true,
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
  avatarSizeLimitInMB: 5,
  sentry: {
    enabled: false,
    tracesSampleRate: 1.0, // lower in production, e.g. 0.1
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
    sendDefaultPii: true,
  },
  enablePostHog: true,
  emails: {
    support: {
      sender: `Team ${brandName}`,
      email: "onboarding@resend.dev",
    },
    contact: {
      sender: `Team ${brandName}`,
      fromEmail: "onboarding@resend.dev",
      toEmail: "amit@schandillia.com",
    },
    welcome: {
      sender: `${emailSenderName} from ${brandName}`,
      fromEmail: "onboarding@resend.dev",
    },
    magicLink: {
      sender: `${brandName} Accounts`,
      fromEmail: "onboarding@resend.dev",
    },
    privacy: {
      sender: `${brandName} Privacy Officer`,
      toEmail: `privacy@${brandDomain}`,
    },
  },
  genericUser: "User",
  metaData: {
    home: {
      title: `${brandName}, The best starter for Next.js 16`,
      description: `${brandName} is a Next.js 16 starter template with everything you need to build a modern web app, including authentication, database, and more.`,
    },
    dashboard: {
      title: "Dashboard",
      description: "Your personal dashboard.",
    },
    profile: {
      title: "Profile",
      description: "Manage your profile data.",
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
      description: `Explore the features of ${brandName}.`,
    },
    docs: {
      title: "Documentation",
      description: `Find out how ${brandName} works.`,
    },
    contact: {
      title: "Contact",
      description: "Get in touch with us.",
    },
    about: {
      title: "About",
      description: `Learn more about ${brandName}.`,
    },
    cookies: {
      title: "Cookies",
      description: "Learn more about cookies.",
    },
  },
}

export type SiteConfig = typeof siteConfig
