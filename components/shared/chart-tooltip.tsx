import type { TooltipContentProps } from 'recharts'
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'

export function ChartTooltip({ active, payload, label, valueFormatter = (v) => v.toLocaleString('th-TH') }: TooltipContentProps<ValueType, NameType> & { valueFormatter?: (value: number) => string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-md">
      {label ? <p className="mb-1.5 font-medium text-muted-foreground">{label}</p> : null}
      <div className="flex flex-col gap-1">
        {payload.map((entry) => (
          <div key={`${entry.name}`} className="flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}</span>
            <span className="ml-auto font-semibold text-popover-foreground">{valueFormatter(Number(entry.value))}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
