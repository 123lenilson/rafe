import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout/DashboardLayout'
import { POSLayout } from '@/features/pos/POSLayout'
import { MockPage } from '@/shared/components/dev/MockPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <DashboardLayout />,
    children: [
      {
        path: 'dashboard',
        element: <MockPage title="Dashboard" />,
      },
      {
        path: 'faturacao/orcamento',
        element: <MockPage title="Faturação > Orçamento" />,
      },
      {
        path: 'faturacao/facturas',
        element: <MockPage title="Faturação > Facturas" />,
      },
      {
        path: 'faturacao/proforma',
        element: <MockPage title="Faturação > Proforma" />,
      },
      {
        path: 'faturacao/recibo',
        element: <MockPage title="Faturação > Recibo" />,
      },
      {
        path: 'produtos/listar',
        element: <MockPage title="Produtos > Listar Produto" />,
      },
      {
        path: 'produtos/entrada-saida',
        element: <MockPage title="Produtos > Entrada/Saída" />,
      },
      {
        path: 'clients',
        element: <MockPage title="Clientes" />,
      },
      {
        path: 'financas/fluxo-caixa',
        element: <MockPage title="Finanças > Fluxo de Caixa" />,
      },
      {
        path: 'financas/contas-bancos',
        element: <MockPage title="Finanças > Contas/Bancos" />,
      },
      {
        path: 'financas/despesas',
        element: <MockPage title="Finanças > Despesas" />,
      },
      {
        path: 'users',
        element: <MockPage title="Utilizadores" />,
      },
      {
        path: 'definicoes/metodos-pagamento',
        element: <MockPage title="Definições > Métodos de Pagamento" />,
      },
    ],
  },
  {
    path: 'pos',
    element: <POSLayout />,
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
])
