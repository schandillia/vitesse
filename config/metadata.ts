import { BRANDNAME } from "@/config/constants"

export const metaData = {
  home: {
    title: `${BRANDNAME}, The best starter for Next.js 16`,
    description: `${BRANDNAME} is a Next.js 16 starter template with everything you need to build a modern web app, including authentication, database, and more.`,
  },
  dashboard: {
    title: "Dashboard",
    description: "Your personal dashboard.",
    robots: {
      index: false,
      follow: false,
    },
  },
  profile: {
    title: "Profile",
    description: "Manage your profile data.",
    robots: {
      index: false,
      follow: false,
    },
  },
  security: {
    title: "Security",
    description: "Manage your account security.",
    robots: {
      index: false,
      follow: false,
    },
  },
  settings: {
    title: "Settings",
    description: "Manage your account settings.",
    robots: {
      index: false,
      follow: false,
    },
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
    overview: {
      title: "Overview | Admin",
      description: "High-level metrics and platform summary.",
      robots: { index: false, follow: false },
    },
    users: {
      title: "Manage Users | Admin",
      description: "View and manage platform users and roles.",
      robots: { index: false, follow: false },
    },
    activity: {
      title: "Activity | Admin",
      description: "Monitor platform events and user activity.",
      robots: { index: false, follow: false },
    },
    system: {
      title: "System Info | Admin",
      description: "Environment configurations and infrastructure health.",
      robots: { index: false, follow: false },
    },
  },
}
