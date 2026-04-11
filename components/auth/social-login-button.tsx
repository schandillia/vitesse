import { Button } from "@/components/ui/button"

interface SocialLoginButtonProps {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  disabled?: boolean
}

export default function SocialLoginButton({
  icon,
  label,
  onClick,
  disabled = false,
}: SocialLoginButtonProps) {
  return (
    <Button
      variant="outline"
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </Button>
  )
}
