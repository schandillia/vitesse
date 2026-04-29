import { Button } from "@/components/ui/button"
import { CaseSensitiveIcon } from "lucide-react"

interface TitleCaseButtonProps {
  onClick: () => void
}

export function TitleCaseButton({ onClick }: TitleCaseButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="lg"
      onClick={onClick}
      title="Convert to title case"
    >
      <CaseSensitiveIcon className="size-4 shrink-0" />
    </Button>
  )
}
