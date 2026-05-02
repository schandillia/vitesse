"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Trash2, Fingerprint, Plus } from "lucide-react"

import { authClient } from "@/lib/auth/auth-client"
import { Passkey } from "@better-auth/passkey"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DestructiveActionButton } from "@/components/auth/destructive-action-button"
import { formatDate } from "@/lib/date"
import { GatedPageSubheading } from "@/app/(protected)/components/gated-page-subheading"

const passkeySchema = z.object({
  name: z.string().min(1, "Please name your device (e.g., 'Work Laptop')"),
})

type PasskeyForm = z.infer<typeof passkeySchema>

export function PasskeyManagement({ passkeys }: { passkeys: Passkey[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  const form = useForm<PasskeyForm>({
    resolver: zodResolver(passkeySchema),
    defaultValues: {
      name: "",
    },
  })

  const { isSubmitting } = form.formState

  async function handleAddPasskey(data: PasskeyForm) {
    await authClient.passkey.addPasskey(data, {
      onError: (ctx) => {
        toast.error(ctx.error.message || "Failed to add passkey")
      },
      onSuccess: async () => {
        toast.success("Passkey registered successfully")
        setIsDialogOpen(false)
        form.reset()
        router.refresh()
      },
    })
  }

  return (
    <div className="space-y-2 max-w-2xl">
      <div className="flex items-center justify-between">
        <GatedPageSubheading text="Passkeys" />
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) form.reset()
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-2">
              <Plus className="size-4" />
              Add Passkey
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Passkey</DialogTitle>
              <DialogDescription>
                Use biometrics or hardware keys for secure, passwordless access
                to Oolway.
              </DialogDescription>
            </DialogHeader>

            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleAddPasskey)}
            >
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Device Name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g., Einstein’s MacBook Pro"
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button type="submit" disabled={isSubmitting} className="w-full">
                <LoadingSwap isLoading={isSubmitting}>
                  Register Device
                </LoadingSwap>
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {passkeys.length === 0 ? (
        <Card className="border-muted/60 shadow-xs">
          <CardHeader className="flex flex-col items-center text-center py-10">
            <Fingerprint className="h-10 w-10 text-muted-foreground mb-4" />
            <CardTitle>No passkeys registered</CardTitle>
            <CardDescription>
              Register a device to sign in securely without a password.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4">
          {passkeys.map((passkey) => (
            <Card key={passkey.id} className="shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <Fingerprint className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-medium">
                      {passkey.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Added {formatDate(passkey.createdAt)}
                    </CardDescription>
                  </div>
                </div>
                <DestructiveActionButton
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  requireAreYouSure // This triggers the confirmation state
                  successMessage="Passkey removed"
                  action={async () => {
                    const res = await authClient.passkey.deletePasskey({
                      id: passkey.id,
                    })
                    if (res.error) return { error: res.error }
                    router.refresh()
                    return { error: null }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </DestructiveActionButton>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
