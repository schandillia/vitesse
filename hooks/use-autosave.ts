import { useCallback, useEffect, useRef, useState } from "react"
import { updatePost } from "@/actions/update-post"

interface AutosaveState {
  content: string
  title: string
  logline: string
  slug: string
  excerpt: string
  categoryId: string
  coverImage: string
}

interface UseAutosaveProps {
  draftId: string
  title: string
  logline: string
  slug: string
  excerpt: string
  categoryId: string
  coverImage: string
  getMarkdown: () => string
  editor: unknown
}

export function useAutosave({
  draftId,
  title,
  logline,
  slug,
  excerpt,
  categoryId,
  coverImage,
  getMarkdown,
  editor,
}: UseAutosaveProps) {
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle")
  const isSavingRef = useRef(false)
  const lastSavedStateRef = useRef<AutosaveState>({
    content: "",
    title,
    logline,
    slug,
    excerpt,
    categoryId,
    coverImage,
  })
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const save = useCallback(async () => {
    if (isSavingRef.current) return

    const content = getMarkdown()
    if (
      content === lastSavedStateRef.current.content &&
      title === lastSavedStateRef.current.title &&
      logline === lastSavedStateRef.current.logline &&
      slug === lastSavedStateRef.current.slug &&
      excerpt === lastSavedStateRef.current.excerpt &&
      categoryId === lastSavedStateRef.current.categoryId &&
      coverImage === lastSavedStateRef.current.coverImage
    )
      return

    isSavingRef.current = true
    setSaveStatus("saving")

    try {
      const result = await updatePost({
        id: draftId,
        title,
        slug,
        logline,
        excerpt,
        categoryId: categoryId || undefined,
        coverImage: coverImage || undefined,
        content,
      })

      if (result.success) {
        lastSavedStateRef.current = {
          content,
          title,
          logline,
          slug,
          excerpt,
          categoryId,
          coverImage,
        }
        setSaveStatus("saved")
      } else {
        setSaveStatus("error")
      }
    } catch {
      setSaveStatus("error")
    } finally {
      isSavingRef.current = false
    }
  }, [
    draftId,
    title,
    slug,
    logline,
    excerpt,
    categoryId,
    coverImage,
    getMarkdown,
  ])

  // Debounce on editor content change
  useEffect(() => {
    if (!editor) return
    const tiptapEditor = editor as {
      on: (event: string, handler: () => void) => void
      off: (event: string, handler: () => void) => void
    }

    const handleUpdate = () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = setTimeout(save, 1500)
    }

    tiptapEditor.on("update", handleUpdate)
    return () => {
      tiptapEditor.off("update", handleUpdate)
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
  }, [editor, save])

  // Debounce on title/logline change
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    debounceTimerRef.current = setTimeout(save, 1500)
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
  }, [title, logline, save])

  // Debounce on modal field changes
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    debounceTimerRef.current = setTimeout(save, 1500)
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
  }, [slug, excerpt, categoryId, coverImage, save])

  // Save on tab close
  useEffect(() => {
    const handleBeforeUnload = () => save()
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [save])

  return { saveStatus, save }
}
