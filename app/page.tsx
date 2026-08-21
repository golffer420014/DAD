'use client'

import { useDashboardStore } from '@/lib/store'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { AppTopbar } from '@/components/layout/app-topbar'
import { TriageView } from '@/components/triage/triage-view'
import { ExplorerView } from '@/components/explorer/explorer-view'
import { FilesView } from '@/components/files/files-view'
import { SettingsView } from '@/components/settings/settings-view'
import { DetailPanel } from '@/components/detail/detail-panel'

export default function Page() {
  const view = useDashboardStore((state) => state.view)

  return (
    <div className="h-dvh overflow-hidden bg-background text-foreground">
      <AppSidebar />
      <div className="flex h-full flex-col lg:pl-64">
        <AppTopbar />
        <main className="mx-auto flex min-h-0 w-full max-w-[1500px] flex-1 flex-col p-4 md:p-8">
          {view === 'triage' && <TriageView />}
          {view === 'explorer' && <ExplorerView />}
          {view === 'files' && <FilesView />}
          {view === 'settings' && <SettingsView />}
        </main>
      </div>
      <DetailPanel />
    </div>
  )
}
