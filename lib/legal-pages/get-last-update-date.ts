import { stat } from "fs/promises"
import path from "path"
import { formatDate } from "@/lib/date"

/**
 * Retrieves the last modified date of a file in the content directory.
 * @param filename The name of the file (e.g., "terms.md")
 * @returns The formatted date string
 */
export async function getLastUpdatedDate(filename: string): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), "content", filename)
    const fileStats = await stat(filePath)
    return formatDate(fileStats.mtime)
  } catch (error) {
    // Fallback date just in case the file system check fails during a build
    console.error(`Failed to read stats for ${filename}`, error)
    return formatDate(new Date())
  }
}
