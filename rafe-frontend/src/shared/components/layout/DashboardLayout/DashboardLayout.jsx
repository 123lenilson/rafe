import { Outlet } from 'react-router-dom'
import { SidebarProvider } from '@/shared/components/ui/sidebar'
import { AppSidebar } from '@/shared/components/layout/Sidebar/Sidebar'

export function DashboardLayout() {
  return (
    <SidebarProvider 
      className="bg-[#F4F4F2] h-screen overflow-hidden text-black"
      style={{ 
        "--sidebar-width": "230px",
        "--sidebar": "#F4F4F2",
        "--sidebar-border": "transparent"
      }}
    >
      {/* AppSidebar será renderizado à esquerda com fundo integrado */}
      <AppSidebar />
      
      {/* O container principal à direita contendo a área de conteúdo */}
      <div className="flex flex-col flex-1 min-w-0 bg-transparent overflow-hidden">
        <main className="flex-1 p-6 overflow-y-auto bg-white rounded-t-[16px] rounded-b-none my-3 mr-3 ml-1 shadow-sm border border-zinc-200/20">
          {/* Outlet renderiza os subcomponentes de rota */}
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}
