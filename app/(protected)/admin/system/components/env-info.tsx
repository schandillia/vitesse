interface EnvInfoProps {
  items: { label: string; value: string }[]
}

function EnvInfoColumn({
  items,
}: {
  items: { label: string; value: string }[]
}) {
  return (
    <div className="rounded-xl border divide-y shadow-none">
      {items.map(({ label, value }) => (
        <div
          key={label}
          className="flex items-center justify-between px-4 py-3 text-sm"
        >
          <span className="text-muted-foreground font-medium shrink-0">
            {label}
          </span>
          <span className="font-mono text-foreground text-right truncate ml-4">
            {value}
          </span>
        </div>
      ))}
    </div>
  )
}

export function EnvInfo({ items }: EnvInfoProps) {
  const mid = Math.ceil(items.length / 2)
  const left = items.slice(0, mid)
  const right = items.slice(mid)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <EnvInfoColumn items={left} />
      <EnvInfoColumn items={right} />
    </div>
  )
}
