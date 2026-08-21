import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useDashboardStore } from '@/lib/store'
import { money } from '@/lib/format'
import { ChartCard } from '@/components/shared/chart-card'
import { ChartTooltip } from '@/components/shared/chart-tooltip'

const SLICE_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']
const MAX_SLICES = 5

export function ValueByFileChart() {
  const files = useDashboardStore((state) => state.files)

  const byValue = [...files].sort((a, b) => b.total - a.total)
  const shown = byValue.slice(0, MAX_SLICES).map((file) => ({ name: file.name.replace(/\.(xlsx|xls|csv)$/i, ''), value: file.total }))
  const rest = byValue.slice(MAX_SLICES)
  const fileData = rest.length
    ? [...shown, { name: `อื่นๆ (${rest.length} ไฟล์)`, value: rest.reduce((sum, file) => sum + file.total, 0) }]
    : shown
  const total = fileData.reduce((sum, file) => sum + file.value, 0)
  const colorAt = (index: number) => (rest.length && index === fileData.length - 1 ? 'var(--chart-other)' : SLICE_COLORS[index])

  return (
    <ChartCard title="Value by file" subtitle="เปรียบเทียบผลงานแต่ละไฟล์">
      {fileData.length === 0 ? (
        <div className="grid h-[260px] place-items-center text-sm text-muted-foreground">ยังไม่มีไฟล์ที่นำเข้า</div>
      ) : (
        <div className="flex flex-col gap-4">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={fileData} dataKey="value" nameKey="name" innerRadius={68} outerRadius={92} paddingAngle={4} stroke="var(--card)" strokeWidth={2}>
                {fileData.map((entry, index) => (
                  <Cell key={index} fill={colorAt(index)} />
                ))}
              </Pie>
              <Tooltip content={(props) => <ChartTooltip {...props} valueFormatter={money} />} />
              <text x="50%" y="47%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-lg font-semibold">
                {money(total)}
              </text>
              <text x="50%" y="57%" textAnchor="middle" dominantBaseline="middle" className="fill-muted-foreground text-[11px]">
                ทั้งหมด
              </text>
            </PieChart>
          </ResponsiveContainer>
          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
            {fileData.map((entry, index) => (
              <li key={index} className="flex min-w-0 items-center gap-1.5">
                <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: colorAt(index) }} />
                <span className="truncate text-muted-foreground">{entry.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ChartCard>
  )
}
