import { profile } from "console"
import { features } from "process"

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Vitesse",
  copyrightStartYear: 2023,
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  domain: "vitesse.com",
  callbackAfterLogin: "/dashboard",
  emails: {
    noReply: "onboarding@resend.dev",
    support: "support@vitesse.com",
  },
  genericUser: "User",
  metaData: {
    home: {
      title: "Vitesse, The best starter for Next.js 16",
      description:
        "Vitesse is a Next.js 13 starter template with everything you need to build a modern web app, including authentication, database, and more.",
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
      description: "Explore the features of Vitesse.",
    },
    docs: {
      title: "Documentation",
      description: "Find out how Vitesse works.",
    },
    contact: {
      title: "Contact",
      description: "Get in touch with us.",
    },
    about: {
      title: "About",
      description: "Learn more about Vitesse.",
    },
  },
}
