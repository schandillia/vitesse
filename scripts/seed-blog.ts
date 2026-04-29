import { db } from "@/db/drizzle"
import { category, post } from "@/db/blog-schema"

async function seed() {
  console.log("🌱 Seeding blog data...")

  const existingUser = await db.query.user.findFirst()

  if (!existingUser) {
    console.error(
      "❌ No user found. Please sign up in your app first so we have an author ID to link to the blog posts."
    )
    process.exit(1)
  }

  try {
    console.log("🧹 Clearing old seed data...")
    await db.delete(post)
    await db.delete(category)

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

    console.log("📝 Creating 50 posts...")

    const allCategories = [engineering, product, tutorials]
    const TOTAL = 50

    const posts = Array.from({ length: TOTAL }).map((_, index) => {
      const postNumber = index + 1
      const cat = allCategories[index % 3]

      return {
        id: crypto.randomUUID(),
        // ✅ Lesson 1 is oldest, Lesson 50 is newest
        createdAt: new Date(Date.now() - (TOTAL - index) * 60 * 1000),
        title: `Scaling SaaS Architectures: Lesson ${postNumber}`,
        logline: `Exploring performance optimization pattern #${postNumber} for modern web applications.`,
        excerpt: `A brief look into how implementing strategy ${postNumber} can drastically improve your application's reliability and user experience.`,
        slug: `scaling-saas-architectures-lesson-${postNumber}`,
        published: true,
        authorId: existingUser.id,
        categoryId: cat.id,
        content: `
Welcome to lesson ${postNumber} in our ongoing series about building robust applications.

### The Core Concept

As your boilerplate scales, managing state and performance becomes critical. Pattern ${postNumber} addresses the common pitfalls developers face when writing complex server-side logic.

\`\`\`typescript
// Example implementation for Pattern ${postNumber}
export async function optimizeData() {
  console.log("Running optimization ${postNumber}...");
  return { status: "optimized", id: ${postNumber} };
}
\`\`\`

By implementing these strategies, you ensure your architecture remains highly available.
        `.trim(),
      }
    })

    await db.insert(post).values(posts)

    console.log("✅ Seeding complete! 50 posts created.")
  } catch (error) {
    console.error("❌ Error during seeding:", error)
    process.exit(1)
  }
}

seed().catch((err) => {
  console.error("❌ Fatal error:", err)
  process.exit(1)
})
