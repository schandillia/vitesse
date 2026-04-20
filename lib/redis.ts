import { siteConfig } from "@/config/site"
import { env } from "@/env"
import { Redis } from "@upstash/redis"

const url = env.UPSTASH_REDIS_REST_URL
const token = env.UPSTASH_REDIS_REST_TOKEN

if (!url || !token) {
  console.warn(
    `⚠️ [${siteConfig.brand.name}] Upstash Redis environment variables are missing. Caching is disabled and will fall back to the primary database.`
  )
}

export const redis =
  url && token
    ? new Redis({
        url,
        token,
        retry: {
          retries: 3,
          backoff: (retryCount) => Math.exp(retryCount) * 50,
        },
        // Upstash handles JSON parsing and stringifying automatically
        automaticDeserialization: true,
      })
    : null

// --- Safe Cache Wrappers ---

export const setCache = async <T>(
  key: string,
  value: T,
  ttlInSeconds?: number
): Promise<boolean> => {
  if (!redis) return false // Graceful bypass

  try {
    if (ttlInSeconds) {
      await redis.setex(key, ttlInSeconds, value)
    } else {
      await redis.set(key, value)
    }
    return true
  } catch (error) {
    console.error("[Redis] Failed to set cache:", error)
    return false
  }
}

export const getCache = async <T>(key: string): Promise<T | null> => {
  if (!redis) return null // Graceful bypass

  try {
    const cached = await redis.get<T>(key)
    return cached ?? null
  } catch (error) {
    console.error("[Redis] Failed to get cache:", error)
    return null
  }
}

export const deleteCache = async (key: string): Promise<boolean> => {
  if (!redis) return false // Graceful bypass

  try {
    await redis.del(key)
    return true
  } catch (error) {
    console.error("[Redis] Failed to delete cache:", error)
    return false
  }
}
