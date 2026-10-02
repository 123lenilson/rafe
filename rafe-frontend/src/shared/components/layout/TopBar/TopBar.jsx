import { SidebarTrigger } from '@/shared/components/ui/sidebar'
import { MessageCircle, BellDot } from 'lucide-react'

export function TopBar() {
  return (
    <header className="flex h-[60px] items-center justify-between border-b border-[#E2E2E2] bg-white px-6 shrink-0">
      {/* Left side: Sidebar Trigger */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="h-9 w-9 text-black hover:bg-[#e4e4e7]/60 active:bg-[#e4e4e7] transition-all duration-300" />
      </div>

      {/* Right side: TopBar visual helper shortcuts */}
      <div className="flex items-center gap-3">
        <button
          title="Mensagem"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:text-black hover:bg-[#e4e4e7]/60 transition-all duration-300 ease-in-out cursor-pointer"
        >
          <MessageCircle className="size-[1.125rem] shrink-0" />
        </button>

        <button
          title="Notificações"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:text-black hover:bg-[#e4e4e7]/60 transition-all duration-300 ease-in-out cursor-pointer"
        >
          <BellDot className="size-[1.125rem] shrink-0" />
        </button>
      </div>
    </header>
  )
}
