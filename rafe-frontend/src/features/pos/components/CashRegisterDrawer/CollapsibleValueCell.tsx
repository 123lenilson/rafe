import React from 'react'

const EXPANDED_WIDTH = 95

interface CollapsibleValueCellProps {
  collapsed: boolean
  children: React.ReactNode
  className?: string
  align?: 'right'
}

export function CollapsibleValueCell({ collapsed: _collapsed, children, className = '' }: CollapsibleValueCellProps) {
  // A animação é controlada pelo pai via classe CSS rafe-table-condensed.
  // Esta célula apenas declara a sua classe e largura fixa.
  // O translateX + opacity é gerido pelo CSS em index.css.
  return (
    <div
      className={`rafe-collapsible-col px-[6px] py-[6px] ${className}`}
      style={{ width: EXPANDED_WIDTH, minWidth: EXPANDED_WIDTH, maxWidth: EXPANDED_WIDTH }}
    >
      {children}
    </div>
  )
}