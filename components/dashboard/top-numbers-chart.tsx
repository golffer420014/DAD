'use client'

import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useDashboardStore } from '@/lib/store'
import { aggregateByNumber, money } from '@/lib/format'
import { BET_TYPES } from '@/lib/bet-types'
import { ChartCard } from '@/components/shared/chart-card'
import { ChartTooltip } from '@/components/shared/chart-tooltip'

const RANK_OPTIONS = [5, 10, 20, 30, 50]

export function TopNumbersChart() {
  const records = useDashboardStore((state) => state.records)
  const [count, setCount] = useState(10)

  const numbers = aggregateByNumber(records)
  const topN = numbers.slice(0, count)

  return (
    <ChartCard
      title="เลขยอดนิยม"
      subtitle="เรียงตามยอดซื้อรวมสูงสุด แยกตามประเภท"
      right={
        <select
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="h-8 shrink-0 rounded-lg border bg-background px-2 text-xs outline-none focus:ring-2 focus:ring-ring"
        >
          {RANK_OPTIONS.map((n) => (
            <option key={n} value={n}>Top {n}</option>
          ))}
        </select>
      }
    >
      {topN.length === 0 ? (
        <div className="grid h-[260px] place-items-center text-sm text-muted-foreground">ยังไม่มีข้อมูลให้แสดงผล</div>
      ) : (
        <div className="flex flex-col gap-3">
          <ResponsiveContainer width="100%" height={Math.max(220, topN.length * 32)}>
            <BarChart data={topN} layout="vertical" margin={{ left: 4, right: 16, top: 4, bottom: 4 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--chart-grid)" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} tickFormatter={(v) => `฿${v / 1000}k`} />
              <YAxis type="category" dataKey="number" axisLine={false} tickLine={false} width={48} tick={{ fill: 'var(--foreground)', fontSize: 12, fontFamily: 'var(--font-mono)' }} />
              <Tooltip
                cursor={{ fill: 'var(--chart-hover)' }}
                content={(props) => <ChartTooltip {...props} label={props.label != null ? `เลข ${props.label}` : undefined} valueFormatter={money} />}
              />
              {BET_TYPES.map((s) => (
                <Bar key={s.key} dataKey={s.key} name={s.name} stackId="stack" fill={s.color} radius={0} barSize={18} />
              ))}
            </BarChart>
          </ResponsiveContainer>
          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
            {BET_TYPES.map((s) => (
              <li key={s.key} className="flex items-center gap-1.5">
                <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-muted-foreground">{s.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ChartCard>
  )
}
