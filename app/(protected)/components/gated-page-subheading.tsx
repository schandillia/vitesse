interface GatedPageSubheadingProps {
  text: string
}

export function GatedPageSubheading({ text }: GatedPageSubheadingProps) {
  return <h2 className="text-lg font-medium">{text}</h2>
}
