import { PasskeyButton } from "@/components/auth/passkey-button"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"

type Provider = {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

interface SocialLoginProps {
  providers: Provider[]
  disabled?: boolean
  onSuccess?: () => void
  onLoadingChange?: (loading: boolean) => void
  callbackURL?: string
}

export function SocialLogin({
  providers,
  disabled = false,
  onSuccess,
  onLoadingChange,
  callbackURL,
}: SocialLoginProps) {
  return (
    <Field className="grid grid-cols-3 gap-4">
      {providers.map((provider) => (
        <Button
          key={provider.label}
          variant="outline"
          type="button"
          onClick={provider.onClick}
          disabled={disabled}
        >
          {provider.icon}
          <span className="sr-only">{provider.label}</span>
        </Button>
      ))}
      <PasskeyButton
        onSuccess={onSuccess}
        disabled={disabled}
        onLoadingChange={onLoadingChange}
        callbackURL={callbackURL}
      />
    </Field>
  )
}
