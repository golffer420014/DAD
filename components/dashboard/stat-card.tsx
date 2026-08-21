import type { LucideIcon } from 'lucide-react'

export function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="group rounded-xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className="rounded-lg border bg-muted p-2.5">
          <Icon className="size-4 text-muted-foreground" />
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">จากไฟล์ที่นำเข้าในเซสชันนี้</p>
    </div>
  )
}
