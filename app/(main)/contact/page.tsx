import { siteConfig } from "@/config/site"
import type { Metadata } from "next"
import { MessageForm } from "@/app/(main)/contact/components/message-form"
import { MessageSquare, Clock } from "lucide-react"
import { getServerSession } from "@/lib/auth/get-server-session"

export const metadata: Metadata = {
  title: siteConfig.metaData.contact.title,
  description: siteConfig.metaData.contact.description,
}

export default async function ContactPage() {
  const session = await getServerSession()
  const user = session?.user ?? null

  return (
    <div className="w-full md:max-w-2xl md:mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Get in touch</h1>
        <p className="text-muted-foreground">
          Have a question or feedback? We typically reply within 24 hours,
          Monday thru Friday.
        </p>
      </div>

      {/* Form */}
      <MessageForm user={user} />
    </div>
  )
}
