export type RecordRow = { sourceFile: string; number: string; top: number; bottom: number; tod: number }
export type FileSummary = { id: string; name: string; records: number; total: number; importedAt: number; size: string; status: 'Ready' | 'Empty' | 'Error' }
export type RiskLimits = { top: number; bottom: number; tod: number }
export type Held = Record<string, boolean>
