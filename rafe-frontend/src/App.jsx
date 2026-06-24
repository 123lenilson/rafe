import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { TooltipProvider } from '@/shared/components/ui/tooltip'
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout/DashboardLayout'
import { Toaster } from '@/shared/components/ui/sonner'

// Componente mock super premium e minimalista para mostrar a rota actual
function MockPage({ title }) {
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

export default function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* Redirecionar a raiz para o Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Dashboard Shell Layout */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<MockPage title="Dashboard" />} />
            
            {/* Faturação Submenus */}
            <Route path="/faturacao/orcamento" element={<MockPage title="Faturação > Orçamento" />} />
            <Route path="/faturacao/facturas" element={<MockPage title="Faturação > Facturas" />} />
            <Route path="/faturacao/proforma" element={<MockPage title="Faturação > Proforma" />} />
            <Route path="/faturacao/recibo" element={<MockPage title="Faturação > Recibo" />} />
            
            {/* Outros links de navegação principais */}
            <Route path="/pos" element={<MockPage title="Point of Sale (POS)" />} />
            
            {/* Produtos Submenus */}
            <Route path="/produtos/listar" element={<MockPage title="Produtos > Listar Produto" />} />
            <Route path="/produtos/entrada-saida" element={<MockPage title="Produtos > Entrada/Saída" />} />
            
            <Route path="/clients" element={<MockPage title="Clientes" />} />
            
            {/* Finanças Submenus */}
            <Route path="/financas/fluxo-caixa" element={<MockPage title="Finanças > Fluxo de Caixa" />} />
            <Route path="/financas/contas-bancos" element={<MockPage title="Finanças > Contas/Bancos" />} />
            <Route path="/financas/despesas" element={<MockPage title="Finanças > Despesas" />} />
            
            <Route path="/users" element={<MockPage title="Utilizadores" />} />
            
            {/* Definições Submenus */}
            <Route path="/definicoes/metodos-pagamento" element={<MockPage title="Definições > Métodos de Pagamento" />} />
          </Route>

          {/* Catch-all - Redirecionar para o dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  )
}
