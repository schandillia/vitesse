import { siteConfig } from "@/config/site"
import { PRICING_CURRENCY, TIERS } from "@/config/pricing"
import { organizationSchema } from "@/lib/seo/schema/organization"
import { websiteSchema } from "@/lib/seo/schema/website"

export function buildPricingJsonLd() {
  const baseUrl = siteConfig.brand.url

  const offers = Object.values(TIERS)
    .filter((tier) => tier.displayPrice.monthly.amount !== "Free")
    .map((tier) => ({
      "@type": "Offer",

      "@id": `${baseUrl}/pricing/#${tier.key}-monthly`,

      url: `${baseUrl}/pricing`,

      name: `${tier.name} Monthly Plan`,

      price: tier.displayPrice.monthly.amount,

      priceCurrency:
        PRICING_CURRENCY === "₹"
          ? "INR"
          : PRICING_CURRENCY === "$"
            ? "USD"
            : PRICING_CURRENCY === "€"
              ? "EUR"
              : PRICING_CURRENCY === "£"
                ? "GBP"
                : "USD",

      availability: "https://schema.org/InStock",

      category: "SaaS Subscription",

      seller: {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
      },
    }))

  return {
    "@context": "https://schema.org",

    "@graph": [
      organizationSchema(),

      websiteSchema(),

      {
        "@type": "SoftwareApplication",

        "@id": `${baseUrl}/#software`,

        name: siteConfig.brand.name,

        applicationCategory: "DeveloperApplication",

        operatingSystem: "Web",

        url: baseUrl,

        publisher: {
          "@type": "Organization",
          "@id": `${baseUrl}/#organization`,
        },

        offers: offers.map((offer) => ({
          "@id": offer["@id"],
        })),
      },

      ...offers,

      {
        "@type": "WebPage",

        "@id": `${baseUrl}/pricing/#webpage`,

        url: `${baseUrl}/pricing`,

        name: "Pricing",

        description: siteConfig.seo.metaData.pricing.description,

        isPartOf: {
          "@type": "WebSite",
          "@id": `${baseUrl}/#website`,
        },

        about: {
          "@type": "SoftwareApplication",
          "@id": `${baseUrl}/#software`,
        },

        mainEntity: {
          "@id": `${baseUrl}/#software`,
        },
      },
    ],
  }
}
