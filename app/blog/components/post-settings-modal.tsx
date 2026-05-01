"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type CategoryOption } from "@/actions/get-categories"
import toast from "react-hot-toast"
import { siteConfig } from "@/config/site"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { CoverImageField } from "@/app/blog/components/cover-image-field"
import { FormField } from "@/app/blog/components/form-field"

interface PostSettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: CategoryOption[]
  slug: string
  onSlugChange: (slug: string) => void
  excerpt: string
  onExcerptChange: (excerpt: string) => void
  logline?: string
  categoryId: string
  onCategoryChange: (categoryId: string) => void
  coverImage: string
  onCoverImageChange: (url: string) => void
  onPublish: () => void
  isPublishing: boolean
}

export function PostSettingsModal({
  open,
  onOpenChange,
  categories,
  slug,
  onSlugChange,
  excerpt,
  onExcerptChange,
  logline = "",
  categoryId,
  onCategoryChange,
  coverImage,
  onCoverImageChange,
  onPublish,
  isPublishing,
}: PostSettingsModalProps) {
  const [localSlug, setLocalSlug] = useState(slug)

  useEffect(() => {
    setLocalSlug(slug)
  }, [slug])

  const handlePublish = () => {
    if (!slug.trim()) {
      toast.error("Post URL is required before publishing")
      return
    }
    onPublish()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Post Settings</DialogTitle>
          <DialogDescription>
            Configure your post before publishing
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          <FormField
            label="Slug"
            htmlFor="slug"
            required
            hint={
              <p className="text-xs text-muted-foreground text-right">
                {slug.length} / 75
              </p>
            }
          >
            <div className="flex items-center rounded-md border overflow-hidden focus-within:ring-1 focus-within:ring-ring">
              <span className="px-3 py-2 text-sm text-muted-foreground bg-muted border-r shrink-0">
                {siteConfig.brand.url}/blog/
              </span>
              <Input
                id="slug"
                value={localSlug}
                onChange={(e) =>
                  setLocalSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^\w-]/g, "")
                  )
                }
                onBlur={() => {
                  if (localSlug.trim()) {
                    onSlugChange(localSlug)
                  } else {
                    setLocalSlug(slug) // revert to last valid value
                  }
                }}
                placeholder="my-post-slug"
                className="font-mono border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                maxLength={75}
                minLength={2}
              />
            </div>
          </FormField>

          <FormField
            label="Excerpt"
            htmlFor="excerpt"
            hint={
              <p className="text-xs text-muted-foreground text-right">
                {excerpt.length} / 200
              </p>
            }
          >
            <Textarea
              id="excerpt"
              value={excerpt || logline}
              onChange={(e) => onExcerptChange(e.target.value)}
              placeholder="A short description of your post…"
              rows={3}
            />
          </FormField>

          <FormField label="Category">
            <Select value={categoryId} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <CoverImageField
            coverImage={coverImage}
            onCoverImageChange={onCoverImageChange}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Update
          </Button>
          <Button onClick={handlePublish} disabled={isPublishing}>
            <LoadingSwap isLoading={isPublishing}>Publish</LoadingSwap>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
