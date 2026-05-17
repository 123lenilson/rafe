import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout/DashboardLayout';
import LoginPage from '@/features/auth/pages/LoginPage';
import DashboardPage from '@/features/dashboard/pages/DashboardPage';
import InvoicingPage from '@/features/invoicing/pages/InvoicingPage';
import PosPage from '@/features/pos/pages/PosPage';
import ProductsPage from '@/features/products/pages/ProductsPage';
import ClientsPage from '@/features/clients/pages/ClientsPage';
import FinancesPage from '@/features/finances/pages/FinancesPage';
import UsersPage from '@/features/users/pages/UsersPage';
import SettingsPage from '@/features/settings/pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'pos', element: <PosPage /> },
      { path: 'invoicing', element: <InvoicingPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'clients', element: <ClientsPage /> },
      { path: 'finances', element: <FinancesPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);
