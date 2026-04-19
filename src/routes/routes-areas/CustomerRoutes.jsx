import React, { lazy } from 'react'
import GeneralError from '../../pages/general/errors/general-error'
import PrivateRoute from '../../utils/PrivateRoutes'
import AppShell from '../../components/app-shell'

const customerRoutes = [
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
        // errorElement: <GeneralError />,
        // children: [
        //   { index: true, lazy: async () => ({ Component: (await import('../pages/panels/admin/dashboard/Dashboard')).default }) },
        //   {
        //     path: 'mantenimientos',
        //     lazy: async () => ({ Component: (await import('../pages/panels/customer/mantenimiento/Mantenimiento')).default }),
        //     // errorElement: <GeneralError />,
        //   },
        //   // {
        //   //   path: 'proveedores',
        //   //   lazy: async () => ({ Component: (await import('../pages/panels/admin/provider/Provider')).default }),
        //   //   errorElement: <GeneralError />,
        //   // },
        //   // {
        //   //   path: 'categorias',
        //   //   lazy: async () => ({ Component: (await import('../pages/panels/admin/category/Category')).default }),
        //   //   errorElement: <GeneralError />,
        //   // },
        //   {
        //     path: 'ajustes',
        //     lazy: async () => ({ Component: (await import('../pages/general/settings')).default }),
        //     // errorElement: <GeneralError />,
        //     children: [
        //       { index: true, lazy: async () => ({ Component: (await import('../pages/general/settings/profile')).default }) },
        //       { path: 'cuenta', lazy: async () => ({ Component: (await import('../pages/general/settings/account')).default }) },
        //       { path: 'apariencia', lazy: async () => ({ Component: (await import('../pages/general/settings/appearance')).default }) },
        //       { path: 'notificaciones', lazy: async () => ({ Component: (await import('../pages/general/settings/notifications')).default }) },
        //       { path: 'display', lazy: async () => ({ Component: (await import('../pages/general/settings/display')).default }) },
        //     ],
        //   },
        // ],
      },
    ],
  },
]

export default customerRoutes