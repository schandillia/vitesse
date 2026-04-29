import { readFile } from "fs/promises"
import path from "path"
import { siteConfig } from "@/config/site"
import { getLastUpdatedDate } from "@/lib/legal-pages/get-last-update-date"

/**
 * Fetches markdown content for legal pages and injects dynamic variables.
 * @param document The name of the markdown file without extension (e.g., "terms")
 */
export async function getLegalContent(document: string) {
  const filename = `${document}.md`
  const filePath = path.join(process.cwd(), "content", filename)

  // Fetch file content and metadata in parallel for better performance
  const [raw, lastUpdated] = await Promise.all([
    readFile(filePath, "utf-8"),
    getLastUpdatedDate(filename),
  ])

  return raw
    .replace(/{{BRAND_NAME}}/g, siteConfig.brand.name)
    .replace(/{{LAST_REVISED_DATE}}/g, lastUpdated)
    .replace(/{{PRIVACY_EMAIL}}/g, siteConfig.emails.privacy.toEmail)
    .replace(/{{GRIEVANCE_EMAIL}}/g, siteConfig.emails.grievance.toEmail)
    .replace(
      /{{GRIEVANCE_OFFICER_NAME}}/g,
      siteConfig.legal.grievance.officerName
    )
    .replace(
      /{{GRIEVANCE_DESIGNATION}}/g,
      siteConfig.legal.grievance.designation
    )
    .replace(
      /{{GRIEVANCE_WORKING_HOURS}}/g,
      siteConfig.legal.grievance.workingHours
    )
    .replace(/{{GRIEVANCE_ADDRESS}}/g, siteConfig.legal.grievance.address)
}
