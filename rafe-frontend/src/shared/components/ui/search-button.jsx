import { Search } from "lucide-react"

export function SearchButton({ onClick, placeholder = "Pesquisar" }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 w-full max-w-xs rounded-full border border-gray-300 bg-white text-gray-500 text-sm transition-colors hover:border-gray-400 active:border-black focus:outline-none"
    >
      <Search className="h-4 w-4 text-black" />
      <span>{placeholder}</span>
    </button>
  )
}
