import React from 'react'
import { BottomMenu } from './components/BottomMenu/BottomMenu'

export function POSLayout() {
  return (
    <div className="h-screen w-screen bg-white flex flex-col overflow-hidden">
      {/* Área Principal dos Painéis (altura 100% excluindo o BottomMenu) */}
      <div className="flex-1 flex justify-center items-stretch min-h-0 overflow-hidden w-full max-w-[1500px] mx-auto bg-white">
        
        {/* Painel Esquerdo (Aproximadamente 20% da largura, mínimo de 300px no xl) */}
        <div className="w-[200px] sm:w-[240px] md:w-[280px] lg:w-[300px] shrink-0 border-r border-zinc-200 bg-white flex flex-col h-full overflow-y-auto">
          {/* Painel Esquerdo - Destinado ao teclado numérico e métodos de pagamento */}
          <div className="p-[24px]">
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Painel Esquerdo</span>
            <p className="text-sm text-zinc-500 mt-2">
              Espaço reservado para o teclado numérico e métodos de pagamento.
            </p>
          </div>
        </div>

        {/* Painel Central (Aproximadamente 45% da largura) */}
        <div className="w-[450px] sm:w-[540px] md:w-[630px] lg:w-[675px] shrink-0 border-r border-zinc-200 bg-white flex flex-col h-full overflow-y-auto">
          {/* Painel Central - Destinado aos cards de produtos */}
          <div className="p-[24px]">
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Painel Central</span>
            <p className="text-sm text-zinc-500 mt-2">
              Espaço reservado para a listagem e cards de produtos.
            </p>
          </div>
        </div>

        {/* Painel Direito (Aproximadamente 35% da largura) */}
        <div className="w-[350px] sm:w-[420px] md:w-[490px] lg:w-[525px] shrink-0 bg-white flex flex-col h-full overflow-y-auto">
          {/* Painel Direito - Destinado ao carrinho e aos totais da venda */}
          <div className="p-[24px]">
            <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Painel Direito</span>
            <p className="text-sm text-zinc-500 mt-2">
              Espaço reservado para o carrinho de compras e totais da faturação.
            </p>
          </div>
        </div>

      </div>

      {/* Rodapé - BottomMenu */}
      <BottomMenu />
    </div>
  )
}
