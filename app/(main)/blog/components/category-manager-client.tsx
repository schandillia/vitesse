"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { CategoryCard } from "@/app/(main)/blog/components/category-card"
import { CategoryFormModal } from "@/app/(main)/blog/components/category-form-modal"
import type { CategoryOption } from "@/actions/get-categories"

interface CategoryManagerClientProps {
  initialCategories: CategoryOption[]
}

export function CategoryManagerClient({
  initialCategories,
}: CategoryManagerClientProps) {
  const [categories, setCategories] =
    useState<CategoryOption[]>(initialCategories)
  const [isCreating, setIsCreating] = useState(false)

  function handleDeleted(id: string) {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  function handleUpdated(updated: CategoryOption) {
    setCategories((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    )
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreating(true)}>
          <PlusIcon className="size-4" />
          New category
        </Button>
      </div>

      <CategoryFormModal
        open={isCreating}
        onOpenChange={setIsCreating}
        onCreated={(created) => {
          setCategories((prev) =>
            [...prev, created].sort((a, b) => a.name.localeCompare(b.name))
          )
          setIsCreating(false)
        }}
      />

      {categories.length === 0 ? (
        <p className="text-muted-foreground text-center">
          No categories yet. Create one above.
        </p>
      ) : (
        <div className="md:grid md:grid-cols-2 flex flex-col gap-10">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onDeleted={handleDeleted}
              onUpdated={handleUpdated}
            />
          ))}
        </div>
      )}
    </div>
  )
}
