'use client'

import { useDashboardStore } from '@/lib/store'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { AppTopbar } from '@/components/layout/app-topbar'
import { DashboardView } from '@/components/dashboard/dashboard-view'
import { ExplorerView } from '@/components/explorer/explorer-view'
import { FilesView } from '@/components/files/files-view'
import { SettingsView } from '@/components/settings/settings-view'
import { DetailPanel } from '@/components/detail/detail-panel'

export default function Page() {
  const view = useDashboardStore((state) => state.view)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppSidebar />
      <div className="lg:pl-64">
        <AppTopbar />
        <main className="mx-auto max-w-[1500px] p-4 md:p-8">
          {view === 'dashboard' && <DashboardView />}
          {view === 'explorer' && <ExplorerView />}
          {view === 'files' && <FilesView />}
          {view === 'settings' && <SettingsView />}
        </main>
      </div>
      <DetailPanel />
    </div>
  )
}
