import type { RecordRow, RiskLimits } from '@/lib/types'

export const money = (value: number) => `${value.toLocaleString('th-TH')}`

export const aggregateByNumber = (records: RecordRow[]) =>
  Object.values(
    records.reduce<Record<string, RecordRow & { total: number }>>((acc, row) => {
      acc[row.number] ??= { ...row, top: 0, bottom: 0, tod: 0, total: 0 }
      acc[row.number].top += row.top
      acc[row.number].bottom += row.bottom
      acc[row.number].tod += row.tod
      acc[row.number].total += row.top + row.bottom + row.tod
      return acc
    }, {}),
  ).sort((a, b) => b.total - a.total)

export const getRiskFlags = (row: { top: number; bottom: number; tod: number }, limits: RiskLimits) => {
  const top = limits.top > 0 && row.top > limits.top
  const bottom = limits.bottom > 0 && row.bottom > limits.bottom
  const tod = limits.tod > 0 && row.tod > limits.tod
  return { top, bottom, tod, any: top || bottom || tod }
}

