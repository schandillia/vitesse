import { unauthorized, notFound } from "next/navigation"
import { getServerSession } from "@/lib/auth/get-server-session"
import { ROLES } from "@/db/types/roles"
import { getPostById } from "@/actions/get-post-by-id"
import { TiptapEditor } from "@/components/editor/tiptap-editor"
import { canEditPost } from "@/lib/blog-utils"

interface EditPostPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params
  const session = await getServerSession()

  if (session?.user?.role !== ROLES.ADMIN) {
    unauthorized()
  }

  const post = await getPostById(id)

  if (!post) {
    notFound()
  }

  const canEdit = await canEditPost(post.authorId)

  if (!canEdit) {
    unauthorized()
  }

  return (
    <article className="mx-auto max-w-4xl pb-10 px-4">
      <TiptapEditor
        draftId={post.id}
        initialTitle={post.title === "Untitled" ? "" : post.title}
        initialLogline={post.logline ?? ""}
        initialSlug={post.slug.startsWith("draft-") ? "" : post.slug}
        initialContent={post.content}
        initialExcerpt={post.excerpt ?? ""}
        initialCategoryId={post.categoryId ?? ""}
        initialCoverImage={post.coverImage ?? ""}
      />
    </article>
  )
}
