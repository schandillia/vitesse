import { env } from "@/env"
import { drizzle } from "drizzle-orm/neon-http"
import * as authSchema from "@/db/auth-schema"
import * as blogSchema from "@/db/blog-schema"

export const schema = { ...authSchema, ...blogSchema }

export const db = drizzle(env.DATABASE_URL!, { schema })
