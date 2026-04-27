"use client"

import { useEffect, useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { uploadBlogImageAction } from "@/actions/upload-blog-image"
import { blogImageSchema } from "@/lib/validations/blog-image-schema"
import { type CategoryOption } from "@/actions/get-categories"
import { ImageIcon, XIcon } from "lucide-react"
import toast from "react-hot-toast"
import { siteConfig } from "@/config/site"
import { LoadingSwap } from "@/components/ui/loading-swap"

interface FormFieldProps {
  label: string
  htmlFor?: string
  required?: boolean
  children: React.ReactNode
  hint?: React.ReactNode
}

function FormField({
  label,
  htmlFor,
  required,
  children,
  hint,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="flex items-center gap-0">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {hint}
    </div>
  )
}

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
  const coverImageInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [localSlug, setLocalSlug] = useState(slug)

  useEffect(() => {
    setLocalSlug(slug)
  }, [slug])

  const handleCoverImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = blogImageSchema.safeParse({ file })
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || "Invalid image")
      e.target.value = ""
      return
    }

    setIsUploadingCover(true)
    const formData = new FormData()
    formData.append("file", file)

    const result = await uploadBlogImageAction(formData)
    if (result.success) {
      onCoverImageChange(result.url)
    } else {
      toast.error(result.error)
    }

    setIsUploadingCover(false)
    e.target.value = ""
  }

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
            Configure your post before publishing.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          <FormField
            label="Post URL"
            htmlFor="slug"
            required
            hint={
              <p className="text-xs text-muted-foreground text-right">
                {slug.length} / 255
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
                maxLength={255}
              />
            </div>
          </FormField>

          <FormField label="Excerpt" htmlFor="excerpt">
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

          <FormField label="Cover Image">
            <input
              ref={coverImageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverImageUpload}
              aria-label="Upload cover image"
            />
            {coverImage ? (
              <div className="relative group w-full aspect-video overflow-hidden rounded-lg border">
                {/* eslint-disable-next-line @next/next/no-img-element -- editor/upload preview */}
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onCoverImageChange("")}
                  className="absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove cover image"
                >
                  <XIcon className="size-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => coverImageInputRef.current?.click()}
                disabled={isUploadingCover}
                className="flex flex-col items-center justify-center gap-2 w-full aspect-video rounded-lg border-dashed text-muted-foreground hover:text-foreground h-auto"
                title="Upload cover image"
              >
                <ImageIcon className="size-6" />
                <span className="text-sm">
                  {isUploadingCover ? "Uploading…" : "Upload cover image"}
                </span>
              </Button>
            )}
          </FormField>
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
