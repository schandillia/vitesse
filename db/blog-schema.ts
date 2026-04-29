import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { user } from "@/db/auth-schema"

export const category = pgTable("category", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
})

export const post = pgTable(
  "post",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    logline: text("logline"),
    slug: text("slug").notNull().unique(),
    content: text("content").notNull(), // Raw MDX string
    excerpt: text("excerpt"),
    coverImage: text("cover_image"),
    published: boolean("published").default(false).notNull(),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    categoryId: text("category_id").references(() => category.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("post_authorId_idx").on(table.authorId),
    index("post_categoryId_idx").on(table.categoryId),
    index("post_createdAt_idx").on(table.createdAt),
  ]
)

// Relations
export const categoryRelations = relations(category, ({ many }) => ({
  posts: many(post),
}))

export const postRelations = relations(post, ({ one }) => ({
  author: one(user, {
    fields: [post.authorId],
    references: [user.id],
  }),
  category: one(category, {
    fields: [post.categoryId],
    references: [category.id],
  }),
}))
