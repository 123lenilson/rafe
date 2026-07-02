import React from 'react'
import { LayoutDashboard, User, Tag, FileText, MoreHorizontal } from 'lucide-react'

export function BottomMenu() {
  const menuItems = [
    { label: 'Sistema', Icon: LayoutDashboard },
    { label: 'Cliente', Icon: User },
    { label: 'Desconto', Icon: Tag },
    { label: 'Nota', Icon: FileText },
    { label: 'Mais', Icon: MoreHorizontal },
  ]

  return (
    <div className="h-[56px] shrink-0 bg-white border-t border-zinc-200 flex items-center justify-between px-[24px]">
      <div className="flex items-center gap-[8px] mx-auto">
        {menuItems.map((item, idx) => {
          const { label, Icon } = item
          return (
            <button
              key={idx}
              onClick={() => {}}
              className="w-[80px] h-[48px] flex flex-col items-center justify-center gap-[4px] text-zinc-500 hover:text-black transition-colors focus:outline-none bg-transparent border-0 cursor-pointer select-none"
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span className="text-[10px] font-normal leading-none">{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
