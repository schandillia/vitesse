"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Plus, CopyIcon, CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createApiKey } from "@/actions/create-api-key"
import { API_KEY_EXPIRY_OPTIONS } from "@/config/api-keys"

const createKeySchema = z.object({
  name: z.string().min(1, "Please give your key a name"),
  expiresInDays: z.number().nullable(),
})

type CreateKeyForm = z.infer<typeof createKeySchema>

export function CreateKeyDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const form = useForm<CreateKeyForm>({
    resolver: zodResolver(createKeySchema),
    defaultValues: {
      name: "",
      expiresInDays: 30,
    },
  })

  const { isSubmitting } = form.formState

  async function handleCreate(data: CreateKeyForm) {
    const result = await createApiKey({
      name: data.name,
      expiresInDays: data.expiresInDays,
      scopes: [],
    })

    if (!result.success) {
      toast.error(result.error)
      return
    }

    setCreatedKey(result.data.key)
    router.refresh()
  }

  async function handleCopy() {
    if (!createdKey) return
    await navigator.clipboard.writeText(createdKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleClose() {
    setIsOpen(false)
    setTimeout(() => {
      setCreatedKey(null)
      setCopied(false)
      form.reset()
    }, 300)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose()
        else setIsOpen(true)
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <Plus className="size-4" />
          New Key
        </Button>
      </DialogTrigger>
      <DialogContent>
        {createdKey ? (
          <>
            <DialogHeader>
              <DialogTitle>Key Created</DialogTitle>
              <DialogDescription>
                Copy your API key now. You won't be able to see it again.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-md border border-muted bg-muted/40 px-3 py-2">
                <code className="flex-1 text-xs break-all text-foreground select-all">
                  {createdKey}
                </code>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="shrink-0 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Copy API key"
                >
                  {copied ? (
                    <CheckIcon className="size-4 text-green-500" />
                  ) : (
                    <CopyIcon className="size-4" />
                  )}
                </button>
              </div>
              <Button className="w-full" onClick={handleClose}>
                Done
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Name your key and set an expiry.
              </DialogDescription>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleCreate)}
            >
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Key Name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. Production Server"
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="expiresInDays"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Expiry</FieldLabel>
                    <div className="flex flex-wrap gap-2">
                      {API_KEY_EXPIRY_OPTIONS.map((option) => {
                        const selected = field.value === option.days
                        return (
                          <button
                            key={option.label}
                            type="button"
                            onClick={() => field.onChange(option.days)}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                              selected
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-muted text-muted-foreground hover:border-primary/50 hover:text-foreground"
                            }`}
                          >
                            {option.label}
                          </button>
                        )
                      })}
                    </div>
                  </Field>
                )}
              />

              <Button type="submit" disabled={isSubmitting} className="w-full">
                <LoadingSwap isLoading={isSubmitting}>Create Key</LoadingSwap>
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
