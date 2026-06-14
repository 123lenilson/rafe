import React from 'react'
import { RippleButton } from '@/shared/components/ui/ripple-button'
import { Delete } from 'lucide-react'

interface NumericKeypadProps {
  onKeyPress: (key: string) => void
}

export function NumericKeypad({ onKeyPress }: NumericKeypadProps) {
  // Teclas: 1 a 9, ponto, zero, C e Apagar (vertical)
  const keys = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '', value: 'backspace', isBackspace: true, className: 'row-span-4 h-full' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '.', value: '.' },
    { label: '0', value: '0' },
    { label: 'C', value: 'clear' }
  ]

  return (
    <div className="grid grid-cols-4 gap-2 w-full max-w-xs mx-auto">
      {keys.map((key) => (
        <RippleButton
          key={key.value}
          onClick={() => onKeyPress(key.value)}
          rippleColor="#a1a1aa"
          className={`
            py-3 text-[18px] border-[0.5px] border-zinc-200 rounded-[8px] bg-white 
            hover:bg-zinc-50/50 transition-colors font-semibold text-black 
            select-none cursor-pointer focus:outline-none ${key.className || ''}
          `}
        >
          {key.isBackspace ? (
            <div className="flex items-center justify-center w-full h-full">
              <Delete className="h-5 w-5 text-zinc-500" />
            </div>
          ) : (
            key.label
          )}
        </RippleButton>
      ))}
    </div>
  )
}
