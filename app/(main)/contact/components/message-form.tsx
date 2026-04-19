"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"
import { SendIcon, CheckCircleIcon } from "lucide-react"
import toast from "react-hot-toast"
import { sendContactEmailAction } from "@/app/actions/send-contact-email"
import Link from "next/link"
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/validations/contact"

interface MessageFormProps {
  user?: {
    name?: string | null
    email?: string | null
  } | null
}

export function MessageForm({ user }: MessageFormProps) {
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      subject: "",
      message: "",
    },
  })

  async function onSubmit(values: ContactFormValues) {
    const result = await sendContactEmailAction(values)

    if (result.success) {
      setIsSuccess(true)
    } else {
      toast.error(result.error ?? "Something went wrong. Please try again.")
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <CheckCircleIcon className="size-12 text-primary" />
        <div>
          <h2 className="text-xl font-semibold mb-1">Message sent!</h2>
          <p className="text-muted-foreground text-sm">
            We’ll get back to you within 24 hours.
          </p>
        </div>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              placeholder="John Smith"
              disabled={isSubmitting}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              {...register("name")}
            />
            <FieldError id="name-error" errors={[errors.name]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              disabled={isSubmitting}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
            <FieldError id="email-error" errors={[errors.email]} />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="subject">Subject</FieldLabel>
          <Input
            id="subject"
            placeholder="What’s this about?"
            disabled={isSubmitting}
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? "subject-error" : undefined}
            {...register("subject")}
          />
          <FieldError id="subject-error" errors={[errors.subject]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="message">Message</FieldLabel>
          <Textarea
            id="message"
            placeholder="Tell us what’s on your mind..."
            className="min-h-36 resize-none"
            disabled={isSubmitting}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            {...register("message")}
          />
          <FieldError id="message-error" errors={[errors.message]} />
        </Field>

        <div className="w-full flex justify-center pt-2">
          <Button
            size="lg"
            type="submit"
            className="w-full md:max-w-sm"
            disabled={isSubmitting}
            aria-live="polite"
          >
            <LoadingSwap isLoading={isSubmitting}>
              <span className="flex items-center justify-center gap-x-2">
                <SendIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                Send Message
              </span>
            </LoadingSwap>
          </Button>
        </div>
      </FieldGroup>
    </form>
  )
}
