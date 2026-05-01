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
            index: true,
            lazy: async () => ({
              Component: (await import('../../pages/general/errors/not-found-error')).default,
            }),
          },
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

        ],
      },
    ],
  },
]

export default warehouseRoutes