"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PencilIcon, Trash2Icon } from "lucide-react"
import { deleteCategory } from "@/actions/delete-category"
import { updateCategory } from "@/actions/update-category"
import toast from "react-hot-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CategoryCardProps {
  category: {
    id: string
    name: string
    slug: string
    description: string | null
  }
  onDeleted: (id: string) => void
  onUpdated: (updated: {
    id: string
    name: string
    slug: string
    description: string | null
  }) => void
}

type EditingField = "name" | "slug" | "description" | null

export function CategoryCard({
  category,
  onDeleted,
  onUpdated,
}: CategoryCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [name, setName] = useState(category.name)
  const [slug, setSlug] = useState(category.slug)
  const [description, setDescription] = useState(category.description || "")
  const [editingField, setEditingField] = useState<EditingField>(null)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editingField])

  function handleCancel() {
    setName(category.name)
    setSlug(category.slug)
    setDescription(category.description || "")
    setEditingField(null)
  }

  async function handleSave() {
    const trimmedName = name.trim()
    const trimmedSlug = slug.trim()
    const trimmedDesc = description.trim()

    if (!trimmedName || !trimmedSlug) {
      toast.error("Name and slug cannot be empty.")
      handleCancel()
      return
    }

    if (
      trimmedName === category.name &&
      trimmedSlug === category.slug &&
      trimmedDesc === (category.description || "")
    ) {
      setName(trimmedName)
      setSlug(trimmedSlug)
      setDescription(trimmedDesc)
      setEditingField(null)
      return
    }

    setEditingField(null)
    setName(trimmedName)
    setSlug(trimmedSlug)
    setDescription(trimmedDesc)

    const savePromise = updateCategory({
      id: category.id,
      name: trimmedName,
      slug: trimmedSlug,
      description: trimmedDesc || undefined,
    })

    toast.promise(savePromise, {
      loading: "Saving changes…",
      success: (result) => {
        if (!result.success) throw new Error(result.error)
        onUpdated({
          id: category.id,
          name: trimmedName,
          slug: trimmedSlug,
          description: trimmedDesc || null,
        })
        return "Category updated!"
      },
      error: (err) => {
        handleCancel()
        return err.message || "Failed to update category."
      },
    })
  }

  async function handleDelete() {
    setIsDeleting(true)
    const result = await deleteCategory(category.id)
    setIsDeleting(false)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success("Category deleted.")
    onDeleted(category.id)
  }

  return (
    <div className="flex flex-col gap-4 p-6 border rounded-xl hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          {editingField === "name" ? (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              value={name}
              placeholder="Add a name…"
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === "Escape") handleCancel()
                if (e.key === "Enter") handleSave()
              }}
              className="text-2xl font-bold bg-transparent border-0 p-0 focus-visible:ring-0 focus-visible:outline-none w-full placeholder:text-muted-foreground/50"
              aria-label="Category name"
            />
          ) : (
            <button
              type="button"
              onClick={() => setEditingField("name")}
              className="group/edit flex items-center gap-2 text-left truncate cursor-text"
            >
              <h2 className="text-2xl font-bold truncate">{name}</h2>
              <PencilIcon className="size-4 text-muted-foreground ml-2 opacity-30 shrink-0" />
            </button>
          )}

          <div className="flex items-center text-xs text-muted-foreground font-mono mt-1">
            <span className="shrink-0">/blog/category/</span>
            {editingField === "slug" ? (
              <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                value={slug}
                placeholder="Add a slug…"
                onChange={(e) =>
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^\w-]/g, "")
                  )
                }
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === "Escape") handleCancel()
                  if (e.key === "Enter") handleSave()
                }}
                className="bg-transparent border-0 p-0 focus-visible:ring-0 focus-visible:outline-none flex-1 font-mono text-xs text-foreground placeholder:text-muted-foreground/50"
                aria-label="Category slug"
              />
            ) : (
              <button
                type="button"
                onClick={() => setEditingField("slug")}
                className="group/edit flex items-center gap-2 text-left truncate cursor-text"
              >
                <span className="truncate">{slug}</span>
                <PencilIcon className="size-3 ml-2 opacity-30 shrink-0" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={isDeleting}
                className="size-8 text-destructive hover:text-destructive/80 hover:bg-transparent"
              >
                <Trash2Icon className="size-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete <span className="italic">{category.name}</span>?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Posts in this category will become uncategorized. This cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={handleDelete}
                  className="bg-destructive! text-white border-destructive"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {editingField === "description" ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Escape") handleCancel()
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSave()
            }
          }}
          className="resize-none text-sm bg-transparent border-0 p-0 focus-visible:ring-0 focus-visible:outline-none w-full text-foreground placeholder:text-muted-foreground/50"
          placeholder="Add a short description…"
          rows={3}
          aria-label="Category description"
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditingField("description")}
          className="group/edit flex w-full items-start gap-2 text-left cursor-text"
        >
          <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
            {description || (
              <span className="italic opacity-50">
                No description provided. Click to add one.
              </span>
            )}
          </p>
          <PencilIcon className="size-3 text-muted-foreground ml-2 opacity-30 mt-1 shrink-0" />
        </button>
      )}
    </div>
  )
}
