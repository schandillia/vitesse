"use client"

import { useRef, useState } from "react"
import {
  Dialog,
  DialogContent,
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

interface PostSettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: CategoryOption[]
  slug: string
  onSlugChange: (slug: string) => void
  excerpt: string
  onExcerptChange: (excerpt: string) => void
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
  categoryId,
  onCategoryChange,
  coverImage,
  onCoverImageChange,
  onPublish,
  isPublishing,
}: PostSettingsModalProps) {
  const coverImageInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingCover, setIsUploadingCover] = useState(false)

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
      toast.error("Slug is required before publishing")
      return
    }
    onPublish()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Post Settings</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          {/* Slug */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="slug">
              Slug <span className="text-destructive">*</span>
            </Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) =>
                onSlugChange(
                  e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^\w-]/g, "")
                )
              }
              placeholder="my-post-slug"
              className="font-mono"
            />
          </div>

          {/* Excerpt */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => onExcerptChange(e.target.value)}
              placeholder="A short description of your post…"
              rows={3}
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <Label>Category</Label>
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
          </div>

          {/* Cover Image */}
          <div className="flex flex-col gap-1.5">
            <Label>Cover Image</Label>
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
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handlePublish} disabled={isPublishing}>
            {isPublishing ? "Publishing…" : "Publish"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
