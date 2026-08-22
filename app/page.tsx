'use client'

import { AppSidebar } from '@/components/layout/app-sidebar'
import { AppTopbar } from '@/components/layout/app-topbar'
import { TriageView } from '@/components/triage/triage-view'
import { DetailPanel } from '@/components/detail/detail-panel'

export default function Page() {
  return (
    <div className="h-dvh overflow-hidden bg-background text-foreground">
      <AppSidebar />
      <div className="flex h-full flex-col lg:pl-64">
        <AppTopbar />
        <main className="mx-auto flex min-h-0 w-full max-w-[1500px] flex-1 flex-col p-4 md:p-8">
          <TriageView />
        </main>
      </div>
      <DetailPanel />
    </div>
  )
}
