import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"

type Provider = {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

interface OneClickLoginProps {
  providers: Provider[]
  disabled?: boolean
}

export function OneClickLogin({
  providers,
  disabled = false,
}: OneClickLoginProps) {
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
    </Field>
  )
}
