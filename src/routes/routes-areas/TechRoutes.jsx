import GeneralError from '../../pages/general/errors/general-error'
import PrivateRoute from '../../utils/PrivateRoutes'

const techRoutes = [
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        lazy: async () => {
          const AppShell = await import('../../components/app-shell')
          return { Component: AppShell.default }
        },
        children: [
          {
            path: "work-orders",
            lazy: async () => ({
              Component: (await import('../../pages/panels/technician/operations/work-order/WorkOrder')).default,
            }),
          },
          {
            path: "work-orders/:id",
            lazy: async () => ({
              Component: (await import('../../pages/panels/technician/operations/work-order/WorkOrderDetail')).default,
            }),
          },
          // {
          //   path: "customer-management",
          //   lazy: async () => ({
          //     Component: (await import('../app/customers/CustomerManagement')).default,
          //   }),
          // },
          {
            path: "settings",
            lazy: async () => ({
              Component: (await import('../../pages/general/settings/index')).default,
            }),
          },
          {
            // Cualquier ruta no listada → unauthorized
            path: "*",
            lazy: async () => ({
              Component: (await import('../../pages/general/errors/not-found-error')).default,
            }),
          },
        ],
      },
    ],
  },
]

export default techRoutes