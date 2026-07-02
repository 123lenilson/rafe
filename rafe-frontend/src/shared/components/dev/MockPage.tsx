import { useLocation } from 'react-router-dom'

interface MockPageProps {
  title: string
}

export function MockPage({ title }: MockPageProps) {
  const location = useLocation()
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-xs max-w-4xl animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-2 w-2 rounded-full bg-black animate-pulse" />
        <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Visualização do Componente</span>
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight text-black mb-4">{title}</h1>
      <p className="text-sm text-zinc-500 leading-relaxed mb-6">
        Esta é uma visualização da página <strong className="text-black">{title}</strong>. O Sidebar e a estrutura do Dashboard estão totalmente funcionais e integrados com o React Router.
      </p>
      
      {/* Elementos visuais premium de simulação de dados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-zinc-100 pt-6">
        <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-100">
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Path da Rota</span>
          <p className="text-xs font-bold text-zinc-700 mt-1 font-mono truncate">{location.pathname}</p>
        </div>
        <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-100">
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Componente Sidebar</span>
          <p className="text-xs font-bold text-zinc-700 mt-1">Minimalista Preto & Branco</p>
        </div>
        <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-100">
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">shadcn/ui</span>
          <p className="text-xs font-bold text-zinc-700 mt-1">Primitivos Carregados</p>
        </div>
      </div>
    </div>
  )
}
