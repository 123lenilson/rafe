import { Outlet } from 'react-router-dom'
import { SidebarProvider } from '@/shared/components/ui/sidebar'
import { AppSidebar } from '@/shared/components/layout/Sidebar/Sidebar'

export function DashboardLayout() {
  return (
    <SidebarProvider>
      {/* AppSidebar será renderizado à esquerda */}
      <AppSidebar />
      
      {/* O container principal à direita contendo a área de conteúdo */}
      <div className="flex flex-col flex-1 min-w-0 bg-zinc-50/30">
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Outlet renderiza os subcomponentes de rota */}
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}
