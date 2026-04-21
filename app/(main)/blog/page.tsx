import { siteConfig } from "@/config/site"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: `Blog — ${siteConfig.brand.name}`,
  description: `Thoughts, updates, and insights from the ${siteConfig.brand.name} team.`,
}

// Replace these with real posts — or fetch from your CMS/MDX source
const posts = [
  {
    slug: "getting-started",
    category: "Product",
    title: `Getting started with ${siteConfig.brand.name}`,
    excerpt:
      "A step-by-step walkthrough of setting up your account, inviting your team, and shipping your first project.",
    date: "2025-01-15",
    readTime: "5 min read",
    author: {
      name: "Jane Doe",
      initials: "JD",
    },
  },
  {
    slug: "why-we-built-this",
    category: "Company",
    title: "Why we built this — and what comes next",
    excerpt:
      "The frustrations that led us to start building, the decisions we’ve made along the way, and where we’re headed.",
    date: "2025-01-08",
    readTime: "7 min read",
    author: {
      name: "John Smith",
      initials: "JS",
    },
  },
  {
    slug: "launch-week-recap",
    category: "Updates",
    title: "Launch week recap — what shipped and what’s next",
    excerpt:
      "We shipped five major features last week. Here’s a breakdown of everything that landed and what’s coming up.",
    date: "2024-12-20",
    readTime: "4 min read",
    author: {
      name: "Jane Doe",
      initials: "JD",
    },
  },
  {
    slug: "the-case-for-simplicity",
    category: "Engineering",
    title: "The case for simplicity in product design",
    excerpt:
      "How we think about feature design at {siteConfig.brand.name} and why we say no to more than we say yes.",
    date: "2024-12-10",
    readTime: "6 min read",
    author: {
      name: "John Smith",
      initials: "JS",
    },
  },
  {
    slug: "customer-story-acme",
    category: "Customer stories",
    title: "How Acme Corp cut onboarding time by 60%",
    excerpt:
      "A look at how one of our customers used our platform to completely overhaul their new user onboarding flow.",
    date: "2024-11-28",
    readTime: "8 min read",
    author: {
      name: "Jane Doe",
      initials: "JD",
    },
  },
  {
    slug: "new-analytics-dashboard",
    category: "Product",
    title: "Introducing the new analytics dashboard",
    excerpt:
      "We’ve rebuilt our analytics experience from the ground up. Faster, clearer, and more actionable than ever.",
    date: "2024-11-15",
    readTime: "3 min read",
    author: {
      name: "John Smith",
      initials: "JS",
    },
  },
]

const categories = [
  "All",
  "Product",
  "Engineering",
  "Company",
  "Updates",
  "Customer stories",
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function BlogPage() {
  const [featured, ...rest] = posts

  return (
    <div className="flex flex-col gap-16 py-16">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Blog
        </h1>
        <p className="text-muted-foreground">
          {/* Replace with your blog tagline */}
          Thoughts, product updates, and behind-the-scenes from the{" "}
          {siteConfig.brand.name} team.
        </p>
      </div>

      {/* Featured post */}
      <Link
        href={`/blog/${featured.slug}`}
        className="group flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-border bg-card hover:shadow-md transition-shadow"
      >
        {/* Replace with real featured image */}
        <div className="w-full md:w-64 h-40 rounded-lg bg-primary/10 shrink-0 flex items-center justify-center">
          <span className="text-primary/30 text-4xl font-bold">
            {featured.category[0]}
          </span>
        </div>
        <div className="flex flex-col gap-3 justify-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            {featured.category}
          </span>
          <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
            {featured.title}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {featured.excerpt}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
              {featured.author.initials}
            </div>
            <span>{featured.author.name}</span>
            <span>·</span>
            <span>{formatDate(featured.date)}</span>
            <span>·</span>
            <span>{featured.readTime}</span>
          </div>
        </div>
      </Link>

      {/* Category filter — replace with real filtering logic */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              cat === "All"
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Post grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {rest.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col gap-4 p-5 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
          >
            {/* Replace with real post image */}
            <div className="w-full h-28 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary/30 text-3xl font-bold">
                {post.category[0]}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                {post.category}
              </span>
              <h3 className="font-semibold text-foreground text-sm leading-snug group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                {post.author.initials}
              </div>
              <span>{post.author.name}</span>
              <span>·</span>
              <span>{formatDate(post.date)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
