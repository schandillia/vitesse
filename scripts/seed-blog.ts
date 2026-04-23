import { db } from "@/db/drizzle"
import { category, post } from "@/db/blog-schema"

async function seed() {
  console.log("🌱 Seeding production-grade blog data...")

  const existingUser = await db.query.user.findFirst()

  if (!existingUser) {
    console.error(
      "❌ No user found. Please sign up in your app first so we have an author ID to link to the blog posts."
    )
    process.exit(1)
  }

  try {
    console.log("📂 Creating categories...")
    const [engineering, product, tutorials] = await db
      .insert(category)
      .values([
        {
          id: crypto.randomUUID(),
          name: "Engineering",
          slug: "engineering",
          description:
            "Deep dives into architecture, performance, and the Edge.",
        },
        {
          id: crypto.randomUUID(),
          name: "Product Updates",
          slug: "product",
          description: "New features, changelogs, and company news.",
        },
        {
          id: crypto.randomUUID(),
          name: "Tutorials",
          slug: "tutorials",
          description: "Step-by-step guides to building with our tools.",
        },
      ])
      .returning()

    console.log("📝 Creating long-form articles...")
    await db.insert(post).values([
      {
        id: crypto.randomUUID(),
        title: "Why We Bet on the Edge with Neon Postgres",
        logline:
          "Traditional databases break at the Edge. Here is how we solved connection pooling without losing V8 isolate performance.",
        excerpt:
          "An architectural deep dive into why Oolway uses Neon Serverless Postgres to deliver sub-50ms query times globally on Vercel's Edge Network.",
        slug: "why-we-bet-on-edge-postgres",
        published: true,
        authorId: existingUser.id,
        categoryId: engineering.id,
        content: `
When we set out to build Oolway, we had one non-negotiable constraint: **Everything must run at the Edge.** The Vercel Edge Runtime (built on V8 isolates) offers cold starts under 10ms and deploys your code globally, right next to your users. But there has always been an “elephant” in the room when it comes to the Edge: **Databases.**

### The Connection Pooling Nightmare

Traditional Postgres databases require a persistent TCP connection. When a standard Node.js serverless function spins up, it opens a connection, queries the database, and closes it. But at the Edge, where thousands of isolates can spin up concurrently across the globe, standard TCP connections instantly exhaust the database's connection pool. Your database crashes, and your users get 500 errors.

> “Building at the Edge without a serverless-native database is like putting a Ferrari engine in a tractor.”

### Enter Neon Serverless

This is why we architected Oolway around **Neon Postgres**. Neon decouples compute from storage and, most importantly, provides a native HTTP driver. 

Instead of maintaining fragile TCP connections, our Drizzle ORM queries are compiled into secure, stateless HTTP requests via \`@neondatabase/serverless\`. 

#### How it looks in Oolway:

\`\`\`typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Stateless, Edge-compatible connection
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
\`\`\`

### The Result
By routing Drizzle through Neon’s HTTP driver, Oolway templates achieve:
1. **Zero Connection Limits:** Scale to 10,000 concurrent edge requests without breaking a sweat.
2. **Instant Cold Starts:** No waiting for SSL handshakes and TCP connections.
3. **True Global Scale:** Data fetched securely right from the Vercel CDN layer.

Stop fighting your infrastructure. Welcome to the Edge.
        `.trim(),
      },
      {
        id: crypto.randomUUID(),
        title: "Introducing Oolway: The Bring-Your-Own-Keys Boilerplate",
        logline:
          "Stop paying monthly subscriptions for headless CMSs and auth providers. Own your stack.",
        excerpt:
          "Oolway is the first Next.js 16 SaaS scaffold that gives you enterprise architecture without the vendor lock-in.",
        slug: "introducing-oolway",
        published: true,
        authorId: existingUser.id,
        categoryId: product.id,
        content: `
Today, we are thrilled to officially launch **Oolway**—the boilerplate for developers who want to own their data, not rent it.

The current landscape of SaaS boilerplates is fundamentally broken. They help you launch in a weekend, but they force you to tie your application to proprietary, third-party services that charge exorbitant monthly fees the second you get real traction.

We built Oolway with a different philosophy: **Bring Your Own Keys.**

### What’s in the Box?

Oolway is a Next.js 16 (App Router) template engineered for the Vercel Edge. Out of the box, you get:

* **Authentication (BetterAuth):** Magic Links, Passkeys, and OAuth stored directly in your own database. No monthly auth bills.
* **Database (Neon Postgres):** Serverless, edge-ready data access managed by Drizzle ORM.
* **Infrastructure (AWS CDK):** One command provisions your own S3 buckets and CloudFront distributions.
* **Analytics (PostHog):** Self-hosted or cloud-based, completely wired into your Next.js routes.
* **The UI (Shadcn + Tailwind):** Beautiful, accessible components that you actually own the code for.

### The Built-in Edge CMS

We didn't just stop at auth and payments. Oolway includes a fully functional, Edge-native Markdown blog that reads directly from your Neon database using \`next-mdx-remote\`. 

No Contentful. No Sanity. Just your database and your MDX.

\`\`\`bash
# Start your next empire
bunx oolway init my-saas
\`\`\`

We can't wait to see what you build.
        `.trim(),
      },
      {
        id: crypto.randomUUID(),
        title: "Implementing Passkeys in Next.js with BetterAuth",
        logline:
          "Passwords are dead. Here is how to implement biometric Passkeys in 10 minutes.",
        excerpt:
          "A technical guide to configuring BetterAuth's Passkey plugin in an Edge-native Next.js application.",
        slug: "implementing-passkeys-betterauth",
        published: true,
        authorId: existingUser.id,
        categoryId: tutorials.id,
        content: `
User friction during sign-up is the number one killer of SaaS conversion rates. Every time a user has to open their password manager, you lose a potential customer. 

**Passkeys** (WebAuthn) solve this by allowing users to sign in using TouchID, FaceID, or Windows Hello. In Oolway, we’ve baked this right into the BetterAuth configuration. Here’s how it works under the hood.

### 1. The Database Schema
Passkeys require a dedicated table to store the public keys generated by the user's device. Using Drizzle, the schema looks like this:

\`\`\`typescript
export const passkey = pgTable("passkey", {
  id: text("id").primaryKey(),
  name: text("name"),
  publicKey: text("public_key").notNull(),
  userId: text("user_id").notNull().references(() => user.id),
  credentialID: text("credential_id").notNull(),
  counter: integer("counter").notNull(),
  deviceType: text("device_type").notNull(),
  backedUp: boolean("backed_up").notNull(),
  transports: text("transports"),
  createdAt: timestamp("created_at"),
})
\`\`\`

### 2. Enabling the Plugin
Because BetterAuth is modular, enabling Passkeys is as simple as importing the plugin and adding it to your \`auth.ts\` array:

\`\`\`typescript
import { betterAuth } from "better-auth"
import { passkey } from "@better-auth/passkey"

export const auth = betterAuth({
  // ... other config
  plugins: [
    passkey(), // 👈 That's literally it.
  ],
})
\`\`\`

### 3. The Client-Side Implementation
On your login page, you can now call the BetterAuth client to trigger the biometric prompt on the user's device. 

\`\`\`tsx
"use client"
import { authClient } from "@/lib/auth-client"

export function LoginButton() {
  const handlePasskeyLogin = async () => {
    const { data, error } = await authClient.signIn.passkey()
    if (error) console.error(error)
  }

  return (
    <button onClick={handlePasskeyLogin}>
      Sign in with FaceID
    </button>
  )
}
\`\`\`

By owning your auth infrastructure, you get to offer enterprise-grade features like Passkeys without paying Auth0 a premium tier subscription!
        `.trim(),
      },
    ])

    console.log("✅ Seeding complete! You now have a fully populated blog.")
  } catch (error) {
    console.error("❌ Error during seeding:", error)
    process.exit(1)
  }
}

seed().catch((err) => {
  console.error("❌ Fatal error:", err)
  process.exit(1)
})
