"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { createCategory } from "@/actions/create-category"
import { updateCategory } from "@/actions/update-category"
import toast from "react-hot-toast"
import { siteConfig } from "@/config/site"
import { FormField } from "@/app/blog/components/form-field"

interface CategoryFormProps {
  /** Pass a category to put the form in edit mode. Omit for create mode. */
  category?: {
    id: string
    name: string
    slug: string
    description: string | null
  }
  onSuccess?: (updated: {
    name: string
    slug: string
    description: string | null
  }) => void
  onCreated?: (created: {
    id: string
    name: string
    slug: string
    description: string | null
  }) => void
  onCancel?: () => void
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
}

export function CategoryForm({
  category,
  onSuccess,
  onCreated,
  onCancel,
}: CategoryFormProps) {
  const isEditing = !!category

  const [name, setName] = useState(category?.name ?? "")
  const [slug, setSlug] = useState(category?.slug ?? "")
  const [description, setDescription] = useState(category?.description ?? "")
  const [slugTouched, setSlugTouched] = useState(isEditing)
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit() {
    const trimmedName = name.trim()
    const trimmedSlug = slug.trim()
    const trimmedDescription = description.trim()

    if (!trimmedName) {
      toast.error("Category name is required.")
      return
    }
    if (!trimmedSlug) {
      toast.error("Category slug is required.")
      return
    }

    setIsPending(true)

    const result = isEditing
      ? await updateCategory({
          id: category.id,
          name: trimmedName,
          slug: trimmedSlug,
          description: trimmedDescription || undefined,
        })
      : await createCategory({
          name: trimmedName,
          slug: trimmedSlug,
          description: trimmedDescription || undefined,
        })

    setIsPending(false)

    if (!result.success) {
      toast.error(result.error)
      return
    }

    toast.success(isEditing ? "Category updated." : "Category created.")
    if (!isEditing && result.success) {
      onCreated?.({
        id: (result as { success: true; id: string }).id,
        name: trimmedName,
        slug: trimmedSlug,
        description: trimmedDescription || null,
      })
    } else {
      onSuccess?.({
        name: trimmedName,
        slug: trimmedSlug,
        description: trimmedDescription || null,
      })
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <FormField
        label="Name"
        htmlFor="cat-name"
        required
        hint={
          <p className="text-xs text-muted-foreground text-right">
            {name.length} / 100
          </p>
        }
      >
        <Input
          id="cat-name"
          aria-required="true"
          value={name}
          onChange={(e) => {
            const newName = e.target.value
            setName(newName)
            if (!slugTouched) {
              setSlug(toSlug(newName).slice(0, 50))
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit()
          }}
          placeholder="e.g. Engineering"
          maxLength={100}
          minLength={2}
          className="placeholder:text-muted-foreground/50"
        />
      </FormField>

      <FormField
        label="Slug"
        htmlFor="cat-slug"
        required
        hint={
          <p className="text-xs text-muted-foreground text-right">
            {slug.length} / 50
          </p>
        }
      >
        <div className="flex items-center rounded-md border overflow-hidden focus-within:ring-1 focus-within:ring-ring">
          <span
            aria-hidden="true"
            className="px-3 py-2 text-sm text-muted-foreground bg-muted border-r shrink-0"
          >
            {siteConfig.brand.url}/blog/category/
          </span>
          <Input
            id="cat-slug"
            aria-describedby={
              !slugTouched && name.length > 0 ? "slug-hint" : undefined
            }
            aria-required="true"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true)
              setSlug(toSlug(e.target.value))
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit()
            }}
            placeholder="engineering"
            className="font-mono border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none placeholder:text-muted-foreground/50"
            maxLength={50}
            minLength={2}
          />
        </div>
        {!slugTouched && name.length > 0 && (
          <p id="slug-hint" className="sr-only">
            Auto-generated. Edit the field above to override.
          </p>
        )}
      </FormField>

      <FormField
        label="Description"
        htmlFor="cat-description"
        hint={
          <p className="text-xs text-muted-foreground text-right">
            {description.length} / 200
          </p>
        }
      >
        <Textarea
          id="cat-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSubmit()
            }
          }}
          placeholder="A short description shown on the category page…"
          className="placeholder:text-muted-foreground/50"
          rows={3}
          maxLength={200}
        />
      </FormField>

      <div className="flex items-center justify-end gap-3 pt-1">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        )}
        <Button onClick={handleSubmit} disabled={isPending}>
          <LoadingSwap isLoading={isPending}>
            {isEditing ? "Save changes" : "Create category"}
          </LoadingSwap>
        </Button>
      </div>
    </div>
  )
}
