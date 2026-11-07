import { useEffect, useRef, useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover'

interface POSDiscountSummaryRowProps {
  label: string
  formattedValue: string
  onEdit: () => void
  onRemove: () => void
}

export function POSDiscountSummaryRow({
  label,
  formattedValue,
  onEdit,
  onRemove,
}: POSDiscountSummaryRowProps) {
  const [isOpen, setIsOpen] = useState(false)
  const editRequested = useRef(false)

  useEffect(() => {
    if (isOpen || !editRequested.current) return

    editRequested.current = false
    onEdit()
  }, [isOpen, onEdit])

  function handleEdit() {
    editRequested.current = true
    setIsOpen(false)
  }

  function handleRemove() {
    setIsOpen(false)
    onRemove()
  }

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex w-full cursor-pointer items-center justify-between gap-1 text-left text-foreground underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-foreground focus-visible:outline-offset-2"
          type="button"
        >
          <span>{label}</span>
          <span className="shrink-0">-{formattedValue}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-72 rounded-md border border-border bg-background p-2 shadow-sm"
        side="top"
        sideOffset={4}
      >
        <div className="flex flex-col">
          <Button
            className="w-full justify-start text-left"
            onClick={handleEdit}
            type="button"
            variant="ghost"
          >
            Editar desconto
          </Button>
          <Button
            className="w-full justify-start text-left"
            onClick={handleRemove}
            type="button"
            variant="ghost"
          >
            Remover desconto
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
