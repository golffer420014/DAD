export function RiskLimitField({ label, hint, value, onChange }: { label: string; hint: string; value: number; onChange: (value: number) => void }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <label className="text-sm font-medium">{label}</label>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      <div className="mt-3 flex items-center gap-2">
        <input
          type="number"
          min={0}
          step={100}
          value={value || ''}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          placeholder="0 = ไม่จำกัด"
          className="h-9 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  )
}
