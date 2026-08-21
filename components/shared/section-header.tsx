import { ChevronRight } from 'lucide-react'

export function SectionHeader({ title, subtitle, action, right }: { title: string; subtitle: string; action?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b px-5 py-4">
      <div>
        <h2 className="font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {right}
        {action ? (
          <button className="text-xs font-medium text-muted-foreground hover:text-foreground">
            {action} <ChevronRight className="ml-1 inline size-3" />
          </button>
        ) : null}
      </div>
    </div>
  )
}
