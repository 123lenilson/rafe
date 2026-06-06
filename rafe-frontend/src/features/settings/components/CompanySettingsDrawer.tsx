import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/shared/components/ui/sheet'

interface CompanySettingsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CompanySettingsDrawer({ open, onOpenChange }: CompanySettingsDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-white border border-zinc-200 p-6 flex flex-col gap-6 w-[320px] sm:w-[350px]">
        <SheetHeader className="p-0 border-b border-zinc-100 pb-4">
          <SheetTitle className="text-black font-extrabold text-xl tracking-tight">Rafe Ecosystem</SheetTitle>
          <SheetDescription className="text-zinc-400 mt-1">
            Configurações da empresa
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 flex items-center justify-center text-center p-4">
          <span className="text-zinc-500 text-sm font-semibold leading-relaxed">
            Aqui terá configurações de conta da empresa
          </span>
        </div>
      </SheetContent>
    </Sheet>
  )
}
