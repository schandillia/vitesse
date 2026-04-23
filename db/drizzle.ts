import { env } from "@/env"
import { config } from "dotenv"
import { drizzle } from "drizzle-orm/neon-http"
import * as authSchema from "./auth-schema"
import * as blogSchema from "./blog-schema"

config({ path: ".env" })

export const schema = { ...authSchema, ...blogSchema }

export const db = drizzle(env.DATABASE_URL!, { schema })
