import React from 'react'
import GeneralError from '../../pages/general/errors/general-error'
import PrivateRoute from '../../utils/PrivateRoutes'
import { SalesProvider } from '@/providers/SalesContext'

const adminRoutes = [
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        lazy: async () => {
          const AppShell = await import('../../components/app-shell')
          return { Component: AppShell.default }
        },
        children: [

          // ── Dashboard ──
          {
            index: true,
            lazy: async () => ({
              Component: (await import('../../app/dashboard/dashboard')).default,
            }),
          },
          { path: 'users', lazy: async () => ({ Component: (await import('../../pages/panels/admin/general-management/users/UsersManagement')).default }) },
          { path: 'monitoring', lazy: async () => ({ Component: (await import('../../pages/panels/admin/general-management/monitoring/MonitoringDashboard')).default }) },
          { path: 'area-control', lazy: async () => ({ Component: (await import('../../pages/panels/admin/general-management/AreaControl')).default }) },
          { path: 'area-requests', lazy: async () => ({ Component: (await import('../../pages/panels/shared/AreaRequestsPage')).default }) },
          { path: 'change-history', lazy: async () => ({ Component: (await import('../../pages/panels/admin/change-management/ChangeHistory')).default }) },

          // ── Logistics & Warehouse ──
          {
            path: 'inventory',
            lazy: async () => ({
              Component: (await import('../../pages/panels/admin/logistics/inventory/inventory')).default,
            }),
          },
          {
            path: 'suppliers',
            lazy: async () => ({
              Component: (await import('../../pages/panels/admin/logistics/suppliers/Suppliers')).default,
            }),
          },

          {
            path: 'dispatch',
            lazy: async () => ({
              Component: (await import('../../pages/panels/admin/logistics/dispatch/Dispatch')).default,
            }),
          },

          {
            path: 'ordersSuppliers',
            lazy: async () => ({
              Component: (await import('../../pages/panels/admin/logistics/ordersSuppliers/OrdersSuppliers')).default,
            }),
          },


          // ── Production & Operations ──
          {
            path: 'maintenance',
            lazy: async () => ({
              Component: (await import('../../pages/panels/operation/operations/maintenanceManagement/MaintenanceManagement')).default,
            }),
          },

          // ── Marketing & Sales ──
          { path: 'quotations',       lazy: async () => ({ Component: (await import('../../pages/panels/admin/marketing/Quotations')).default }) },
          { path: 'customers',        lazy: async () => ({ Component: (await import('../../pages/panels/admin/marketing/Customers')).default }) },
          { path: 'customer-history', lazy: async () => ({ Component: (await import('../../pages/panels/admin/marketing/CustomerHistory')).default }) },
          { path: 'sales-orders',     lazy: async () => ({ Component: (await import('../../pages/panels/admin/marketing/SalesOrders')).default }) },

          // ── Settings ──
          {
            path: 'settings',
            lazy: async () => ({
              Component: (await import('../../pages/general/settings')).default,
            }),
            children: [
              { index: true,          lazy: async () => ({ Component: (await import('../../pages/general/settings/profile')).default }) },
              { path: 'account',      lazy: async () => ({ Component: (await import('../../pages/general/settings/account')).default }) },
              { path: 'appearance',   lazy: async () => ({ Component: (await import('../../pages/general/settings/appearance')).default }) },
              { path: 'notifications',lazy: async () => ({ Component: (await import('../../pages/panels/admin/marketing/CustomerHistory')).default }) },
              { path: 'display',      lazy: async () => ({ Component: (await import('../../pages/general/settings/display')).default }) },
            ],
          },

        ],
      },
    ],
  },
]

export default adminRoutes