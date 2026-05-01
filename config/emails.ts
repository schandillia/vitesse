import { BRANDNAME, BRANDDOMAIN, EMAILSENDERNAME } from "@/config/constants"

export const emails = {
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
}

export type EmailsConfig = typeof emails
