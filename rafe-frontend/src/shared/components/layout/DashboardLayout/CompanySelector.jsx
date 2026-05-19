import React from 'react'
import { Briefcase, ChevronsUpDown } from "lucide-react"

export const CompanySelector = React.forwardRef(({
  companyName = "Acme Inc",
  plan = "Enterprise",
  onClick,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      onClick={onClick}
      className="flex flex-row items-center justify-between gap-3 px-4 py-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-150"
      {...props}
    >
      {/* Icone da Empresa */}
      <div className="w-8 h-8 bg-gray-900 rounded-md flex justify-center items-center shrink-0">
        <Briefcase className="w-4 h-4 text-white" />
      </div>

      {/* Bloco de Texto */}
      <div className="flex flex-col gap-0.5 flex-1 text-left">
        <span className="text-sm font-medium text-gray-900 leading-tight truncate">
          {companyName}
        </span>
        <span className="text-xs font-normal text-gray-500 leading-tight">
          {plan}
        </span>
      </div>

      {/* Chevron */}
      <ChevronsUpDown className="w-4 h-4 text-gray-400 shrink-0" />
    </div>
  )
})
CompanySelector.displayName = "CompanySelector"
