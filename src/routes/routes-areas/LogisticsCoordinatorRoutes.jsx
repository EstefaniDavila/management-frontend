import GeneralError from '../../pages/general/errors/general-error'
import PrivateRoute from '../../utils/PrivateRoutes'
const logisticCoordinatorRoutes = [
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
              Component: (await import('../../pages/panels/logisticsCoordinator/LogisticSuppliers')).default,
            }),
          },
          {
            path: "orderSuppliers",
            lazy: async () => ({
              Component: (await import('../../pages/panels/logisticsCoordinator/LogisticOrders')).default,
            }),
          },

          {
            path: "dispatch",
            lazy: async () => ({
              Component: (await import('../../pages/panels/logisticsCoordinator/LogisticCoordinatorDispatch')).default,
            }),
          },
          {
            path: "suppliers",
            lazy: async () => ({
              Component: (await import('../../pages/panels/logisticsCoordinator/LogisticSuppliers')).default,
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

export default logisticCoordinatorRoutes