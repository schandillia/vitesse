"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { uploadBlogImageAction } from "@/actions/upload-blog-image"
import { blogImageSchema } from "@/lib/validations/blog-image-schema"
import { ImageIcon, XIcon } from "lucide-react"
import toast from "react-hot-toast"
import { PostFormField } from "@/components/editor/post-form-field"

interface CoverImageFieldProps {
  coverImage: string
  onCoverImageChange: (url: string) => void
}

export function CoverImageField({
  coverImage,
  onCoverImageChange,
}: CoverImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = blogImageSchema.safeParse({ file })
    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || "Invalid image")
      e.target.value = ""
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    const result = await uploadBlogImageAction(formData)
    if (result.success) {
      onCoverImageChange(result.url)
    } else {
      toast.error(result.error)
    }

    setIsUploading(false)
    e.target.value = ""
  }

  return (
    <PostFormField label="Cover Image">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
        aria-label="Upload cover image"
      />
      {coverImage ? (
        <div className="relative group w-full aspect-video overflow-hidden rounded-lg border">
          {/* eslint-disable-next-line @next/next/no-img-element -- editor/upload preview */}
          <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
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
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex flex-col items-center justify-center gap-2 w-full aspect-video rounded-lg border-dashed text-muted-foreground hover:text-foreground h-auto"
          title="Upload cover image"
        >
          <ImageIcon className="size-6" />
          <span className="text-sm">
            {isUploading ? "Uploading…" : "Upload cover image"}
          </span>
        </Button>
      )}
    </PostFormField>
  )
}