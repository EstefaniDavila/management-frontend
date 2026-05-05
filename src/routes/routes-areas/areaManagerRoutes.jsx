import React from 'react'
import PrivateRoute from '../../utils/PrivateRoutes'

const areaManagerRoutes = [
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
          { index: true,  lazy: async () => ({ Component: (await import('../../pages/panels/manager/AreaManagerDashboard')).default }) },
          {  path: '/manager',  lazy: async () => ({ Component: (await import('../../pages/panels/manager/AreaManagerDashboard')).default }) },
          { path: '/manager/team-leads',  lazy: async () => ({ Component: (await import('../../pages/panels/manager/TeamLeads')).default }) },
          { path: '/manager/team-quotations', lazy: async () => ({ Component: (await import('../../pages/panels/manager/TeamQuotations')).default }) },
          { path: 'area-requests', lazy: async () => ({ Component: (await import('../../pages/panels/shared/AreaRequestsPage')).default }) },
        ],
      },
    ],
  },
]

export default areaManagerRoutes