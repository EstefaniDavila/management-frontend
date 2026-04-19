import GeneralError from '../../pages/general/errors/general-error'
import PrivateRoute from '../../utils/PrivateRoutes'

const techRoutes = [
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
    //   {
    //     path: "/",
    //     lazy: async () => {
    //       const AppShell = await import('../components/app-shell')
    //       return { Component: AppShell.default }
    //     },
    //     children: [
    //       {
    //         path: "sales-management",
    //         lazy: async () => ({
    //           Component: (await import('../app/sales/SalesManagement')).default,
    //         }),
    //       },
    //       {
    //         path: "customer-management",
    //         lazy: async () => ({
    //           Component: (await import('../app/customers/CustomerManagement')).default,
    //         }),
    //       },
    //       {
    //         path: "settings",
    //         lazy: async () => ({
    //           Component: (await import('../app/settings/Settings')).default,
    //         }),
    //       },
    //       {
    //         // Cualquier ruta no listada → unauthorized
    //         path: "*",
    //         lazy: async () => ({
    //           Component: (await import('../pages/general/errors/unauthorized')).default,
    //         }),
    //       },
    //     ],
    //   },
    ],
  },
]

export default techRoutes