import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as XLSX from 'xlsx'
import type { FileSummary, RecordRow, RiskLimits, View } from '@/lib/types'

type DashboardStore = {
  // state
  view: View
  files: FileSummary[]
  records: RecordRow[]
  search: string
  fileFilter: string
  selected: RecordRow | null
  processing: boolean
  mobileNav: boolean
  riskLimits: RiskLimits

  // actions
  setView: (view: View) => void
  setSearch: (search: string) => void
  setFileFilter: (sourceFile: string) => void
  selectRecord: (row: RecordRow | null) => void
  setMobileNav: (open: boolean) => void
  toggleMobileNav: () => void
  removeFile: (id: string) => void
  importFiles: (fileList: FileList | File[] | null) => Promise<void>
  viewFile: (name: string) => void
  setRiskLimits: (limits: RiskLimits) => void
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      view: 'dashboard',
      files: [],
      records: [],
      search: '',
      fileFilter: '',
      selected: null,
      processing: false,
      mobileNav: false,
      riskLimits: { top: 0, bottom: 0, tod: 0 },

      setView: (view) => set({ view, mobileNav: false }),
      setSearch: (search) => set({ search }),
      setFileFilter: (fileFilter) => set({ fileFilter }),
      selectRecord: (row) => set({ selected: row }),
      setMobileNav: (open) => set({ mobileNav: open }),
      toggleMobileNav: () => set((state) => ({ mobileNav: !state.mobileNav })),
      removeFile: (id) => set((state) => ({ files: state.files.filter((file) => file.id !== id) })),
      viewFile: (name) => set({ view: 'explorer', fileFilter: name, search: '' }),
      setRiskLimits: (riskLimits) => set({ riskLimits }),

      importFiles: async (fileList) => {
        if (!fileList?.length) return
        set({ processing: true })

        const additions: RecordRow[] = []
        const summaries: FileSummary[] = []

        for (const file of Array.from(fileList)) {
          const id = crypto.randomUUID()
          try {
            const buffer = await file.arrayBuffer()
            const workbook = XLSX.read(buffer, { type: 'array', cellText: true, cellDates: true })
            const sheet = workbook.Sheets[workbook.SheetNames[0]]
            const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })
            const fileRecords: RecordRow[] = []
            rows.forEach((raw) => {
              const entries = Object.entries(raw)
              const findIndex = (keys: string[]) => entries.findIndex(([key]) => keys.some((needle) => key.toLowerCase().includes(needle)))
              const numberIndex = findIndex(['เลข', 'number'])
              const number = String((numberIndex >= 0 ? entries[numberIndex][1] : '') ?? '').trim()
              if (!/^\d+$/.test(number)) return
              const parse = (value: unknown) => Number(String(value ?? '').replace(/,/g, '')) || 0
              // Some sheets leave บน/ล่าง/โต๊ด headers blank; fall back to their position
              // right after the เลข column (the layout every one of these sheets uses).
              const byNameOrPosition = (keys: string[], offsetFromNumber: number) => {
                const namedIndex = findIndex(keys)
                if (namedIndex >= 0) return entries[namedIndex][1]
                return numberIndex >= 0 ? entries[numberIndex + offsetFromNumber]?.[1] : undefined
              }
              fileRecords.push({
                sourceFile: file.name,
                number,
                top: parse(byNameOrPosition(['บน', 'top'], 1)),
                bottom: parse(byNameOrPosition(['ล่าง', 'bottom'], 2)),
                tod: parse(byNameOrPosition(['โต๊ด', 'tod'], 3)),
              })
            })
            additions.push(...fileRecords)
            summaries.push({
              id,
              name: file.name,
              records: fileRecords.length,
              total: fileRecords.reduce((sum, r) => sum + r.top + r.bottom + r.tod, 0),
              importedAt: Date.now(),
              size: `${Math.round(file.size / 1024)} KB`,
              status: fileRecords.length ? 'Ready' : 'Empty',
            })
          } catch {
            summaries.push({ id, name: file.name, records: 0, total: 0, importedAt: Date.now(), size: `${Math.round(file.size / 1024)} KB`, status: 'Error' })
          }
        }

        set((state) => ({
          records: additions.length ? [...state.records, ...additions] : state.records,
          files: [...summaries, ...state.files],
          processing: false,
        }))
      },
    }),
    {
      name: 'excel-analytics-settings',
      partialize: (state) => ({ riskLimits: state.riskLimits }),
    },
  ),
)
