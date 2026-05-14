import GeneralError from '../../pages/general/errors/general-error'
import PrivateRoute from '../../utils/PrivateRoutes'

const warehouseRoutes = [
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
            path: "inventory",
            lazy: async () => ({
              Component: (await import('../../pages/panels/warehouse/WarehouseInventory')).default,
            }),
          },
          {
            path: "ordersReview",
            lazy: async () => ({
              Component: (await import('../../pages/panels/warehouse/ReceivedOrdersView')).default,
            }),
          },
          {
            path: "settings",
            lazy: async () => ({
              Component: (await import('../../pages/general/settings')).default,
            }),
          },
          {
            path: "area-requests",
            lazy: async () => ({
              Component: (await import('../../pages/panels/shared/AreaRequestsPage')).default,
            }),
          },
        ],
      },
    ],
  },
]

export default warehouseRoutes