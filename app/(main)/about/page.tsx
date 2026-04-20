import { siteConfig } from "@/config/site"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: siteConfig.seo.metaData.about.title,
  description: siteConfig.seo.metaData.about.description,
}

export default function AboutPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <p className="text-lg text-muted-foreground">
        Welcome to our website! We are dedicated to providing you with the best
        experience possible. Our team is passionate about creating high-quality
        content and services that meet your needs. Thank you for visiting us!
      </p>
    </div>
  )
}
