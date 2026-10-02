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
    <div className="h-[56px] shrink-0 bg-white border-t border-zinc-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-2 mx-auto">
        {menuItems.map((item, idx) => {
          const { label, Icon } = item
          return (
            <button
              key={idx}
              onClick={() => {}}
              className="w-[80px] h-12 flex flex-col items-center justify-center gap-1 text-zinc-500 hover:text-black transition-colors focus:outline-none bg-transparent border-0 cursor-pointer select-none"
            >
              <Icon className="size-[1.125rem] shrink-0" />
              <span className="text-xs font-normal leading-none">{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
