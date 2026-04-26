import { unauthorized } from "next/navigation"
import { getServerSession } from "@/lib/auth/get-server-session"
import { ROLES } from "@/lib/auth/roles"
import { TiptapEditor } from "@/components/editor/tiptap-editor"

export default async function NewPostPage() {
  const session = await getServerSession()

  if (session?.user?.role !== ROLES.ADMIN) {
    unauthorized()
  }

  return (
    <article className="mx-auto max-w-4xl pb-10 px-4">
      <TiptapEditor />
    </article>
  )
}
