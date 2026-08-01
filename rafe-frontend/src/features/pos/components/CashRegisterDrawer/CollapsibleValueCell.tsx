import React from 'react'

const EXPANDED_WIDTH = 95

interface CollapsibleValueCellProps {
  collapsed: boolean
  children: React.ReactNode
  className?: string
  align?: 'right'
}

export function CollapsibleValueCell({ collapsed, children, className = '', align = 'right' }: CollapsibleValueCellProps) {
  const alignClass = align === 'right' ? 'text-right' : ''
  const width = collapsed ? 0 : EXPANDED_WIDTH

  return (
    <div
      className={`px-[6px] py-[6px] ${alignClass} overflow-hidden whitespace-nowrap ${className}`}
      style={{
        width,
        minWidth: width,
        maxWidth: width,
        flexShrink: 0,
        flexGrow: 0,
        transition: 'width 650ms cubic-bezier(0.16, 1, 0.3, 1), min-width 650ms cubic-bezier(0.16, 1, 0.3, 1), max-width 650ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  )
}