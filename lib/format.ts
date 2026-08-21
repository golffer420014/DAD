import type { RecordRow, RiskLimits } from '@/lib/types'

export const money = (value: number) => `฿${value.toLocaleString('th-TH')}`

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

export const filterRecords = (records: RecordRow[], search: string, sourceFile = '') =>
  records.filter(
    (row) =>
      (!sourceFile || row.sourceFile === sourceFile) &&
      (row.number.includes(search) || row.sourceFile.toLowerCase().includes(search.toLowerCase())),
  )

export const formatRelativeTime = (timestamp: number, now = Date.now()) => {
  const diffMinutes = Math.floor((now - timestamp) / 60000)
  if (diffMinutes < 1) return 'เมื่อสักครู่'
  if (diffMinutes < 60) return `${diffMinutes} นาทีที่แล้ว`
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays} วันที่แล้ว`
  return new Date(timestamp).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export const downloadRecordsAsCsv = (rows: RecordRow[], filename = 'excel-analytics.csv') => {
  const csv = [
    ['Source', 'Number', 'บน', 'ล่าง', 'โต๊ด', 'Total'],
    ...rows.map((r) => [r.sourceFile, r.number, r.top, r.bottom, r.tod, r.top + r.bottom + r.tod]),
  ]
    .map((row) => row.join(','))
    .join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
