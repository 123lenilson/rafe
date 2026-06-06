import React from 'react'

interface MonetaryDisplayProps {
  value: string
}

export function MonetaryDisplay({ value }: MonetaryDisplayProps) {
  return (
    <div className="w-full p-4 bg-white flex items-center justify-end select-none">
      <span className="text-5xl font-normal tracking-tight text-black font-sans">
        {value}
      </span>
    </div>
  )
}
