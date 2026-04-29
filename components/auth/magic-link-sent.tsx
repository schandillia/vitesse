import { Button } from "@/components/ui/button"

interface MagicLinkSentProps {
  email: string
  onReset: () => void
}

export function MagicLinkSent({ email, onReset }: MagicLinkSentProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 md:p-8 text-center">
      <h2 className="text-2xl font-bold">Check your email</h2>
      <p className="text-sm text-muted-foreground">
        We sent a login link to <strong>{email}</strong>. Click the link in the
        email to sign in.
      </p>
      <Button variant="link" onClick={onReset}>
        Use a different email
      </Button>
    </div>
  )
}
