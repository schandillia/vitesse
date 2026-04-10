import { Button } from "@/components/ui/button"

interface SocialLoginButtonProps {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}

export default function SocialLoginButton({
  icon,
  label,
  onClick,
}: SocialLoginButtonProps) {
  return (
    <Button variant="outline" type="button" onClick={onClick}>
      {icon}
      <span className="sr-only">{label}</span>
    </Button>
  )
}
