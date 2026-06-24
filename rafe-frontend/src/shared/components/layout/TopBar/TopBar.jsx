import { SidebarTrigger } from '@/shared/components/ui/sidebar'
import { Search, BellDot } from 'lucide-react'

export function TopBar() {
  return (
    <header className="flex h-[60px] items-center justify-between border-b border-[#E2E2E2] bg-white px-[24px] shrink-0">
      {/* Left side: Sidebar Trigger */}
      <div className="flex items-center gap-[12px]">
        <SidebarTrigger className="h-[36px] w-[36px] text-black hover:bg-[#e4e4e7]/60 active:bg-[#e4e4e7] transition-all duration-300" />
      </div>

      {/* Right side: TopBar visual helper shortcuts */}
      <div className="flex items-center gap-[12px]">
        <button
          title="Pesquisar"
          className="flex h-[36px] w-[36px] items-center justify-center rounded-lg text-zinc-500 hover:text-black hover:bg-[#e4e4e7]/60 transition-all duration-300 ease-in-out cursor-pointer"
        >
          <Search className="h-[18px] w-[18px] shrink-0" />
        </button>

        <button
          title="Notificações"
          className="flex h-[36px] w-[36px] items-center justify-center rounded-lg text-zinc-500 hover:text-black hover:bg-[#e4e4e7]/60 transition-all duration-300 ease-in-out cursor-pointer"
        >
          <BellDot className="h-[18px] w-[18px] shrink-0" />
        </button>
      </div>
    </header>
  )
}
