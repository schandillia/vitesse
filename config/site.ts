const brandName = "Vitesse"
const brandDomain = "vitesse.com"
const emailSenderName = "Amit"

export const siteConfig = {
  name: brandName,
  copyrightStartYear: 2023,
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  domain: brandDomain,
  callbackAfterLogin: "/dashboard",
  expiresInDays: 30,
  updateAgeInDays: 1,
  cookieMaxAgeInMinutes: 5,
  emails: {
    support: {
      sender: `${brandName} Team`,
      email: "onboarding@resend.dev",
    },
    welcome: {
      sender: `${emailSenderName} from ${brandName}`,
      email: "onboarding@resend.dev",
    },
    magicLink: {
      sender: `${brandName} Accounts`,
      email: "onboarding@resend.dev",
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
  },
}

export type SiteConfig = typeof siteConfig
