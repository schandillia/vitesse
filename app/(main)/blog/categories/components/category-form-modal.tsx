"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { CategoryForm } from "@/app/(main)/blog/categories/components/category-form"

interface CategoryFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (created: {
    id: string
    name: string
    slug: string
    description: string | null
  }) => void
}

export function CategoryFormModal({
  open,
  onOpenChange,
  onCreated,
}: CategoryFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Category</DialogTitle>
          <DialogDescription>
            Create a new category for your blog posts
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          onCreated={(created) => {
            onCreated(created)
            onOpenChange(false)
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
