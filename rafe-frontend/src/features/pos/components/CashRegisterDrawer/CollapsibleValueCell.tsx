import React from 'react'

interface CollapsibleValueCellProps {
  collapsed: boolean
  children: React.ReactNode
  as?: 'th' | 'td'
  className?: string
  align?: 'right'
}

export function CollapsibleValueCell({ collapsed, children, as = 'td', className = '', align = 'right' }: CollapsibleValueCellProps) {
  const alignClass = align === 'right' ? 'text-right' : ''
  const Tag = as

  return (
    <Tag className={`px-[6px] py-[6px] ${alignClass} border-none ${className}`}>
      <div
        style={{
          width: collapsed ? 0 : 'auto',
          overflow: 'hidden',
          transition: 'width 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {children}
      </div>
    </Tag>
  )
}
