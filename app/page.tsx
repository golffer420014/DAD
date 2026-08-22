'use client'

import { AppTopbar } from '@/components/layout/app-topbar'
import { TriageView } from '@/components/triage/triage-view'
import { DetailPanel } from '@/components/detail/detail-panel'

export default function Page() {
  return (
    <div className="h-dvh overflow-hidden bg-background text-foreground">
      <div className="flex h-full flex-col">
        <AppTopbar /> 
        <main className="mx-auto flex min-h-0 w-full flex-1 flex-col p-4 md:p-8">
          <TriageView />
        </main>
      </div>
      <DetailPanel />
    </div>
  )
}
