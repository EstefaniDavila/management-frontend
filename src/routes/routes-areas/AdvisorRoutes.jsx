import PrivateRoute from '../../utils/PrivateRoutes'

const advisorRoutes = [
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

          {
            index: true,
            lazy: async () => ({
              Component: (await import('../../pages/panels/advisor/AdvisorDashboard')).default,
            }),
          },
          {
            path: 'advisor',
            lazy: async () => ({
              Component: (await import('../../pages/panels/advisor/AdvisorDashboard')).default,
            }),
          },
          {
            path: 'area-requests',
            lazy: async () => ({
              Component: (await import('../../pages/panels/shared/AreaRequestsPage')).default,
            }),
          },
          {
            path: 'advisor/leads',
            lazy: async () => ({
              Component: (await import('../../pages/panels/advisor/LeadRequests')).default,
            }),
          },

          {
            path: '/advisor/quotations',
            lazy: async () => ({
              Component: (await import('../../pages/panels/advisor/MyQuotations')).default,
            }),
          },

          {
            path: '/advisor/clients',
            lazy: async () => ({
              Component: (await import('../../pages/panels/advisor/MyClients')).default,
            }),
          },

          {
            path: 'settings',
            lazy: async () => ({
              Component: (await import('../../pages/general/settings')).default,
            }),
          },
        ],
      },
    ],
  },
]

export default advisorRoutes