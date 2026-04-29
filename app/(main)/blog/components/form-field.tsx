import { Label } from "@/components/ui/label"

interface FormFieldProps {
  label: string
  htmlFor?: string
  required?: boolean
  children: React.ReactNode
  hint?: React.ReactNode
}

export function FormField({
  label,
  htmlFor,
  required,
  children,
  hint,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="flex items-center gap-0">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {hint}
    </div>
  )
}
