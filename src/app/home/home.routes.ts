import {Routes} from '@angular/router';

import {isAuthenticated} from '../_shared/services/auth/is-authenticated.guard';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./home.component').then((c) => c.HomeComponent),
    canActivate: [isAuthenticated],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./start/start.component').then((c) => c.StartComponent),
      },
      {
        path: 'users',
        title: 'NAV_USERS',
        loadChildren: () => import('./users/users.routes').then((m) => m.ROUTES),
      },
      {
        path: 'system-notifications',
        title: 'NAV_SYSTEM_NOTIFICATIONS',
        loadChildren: () => import('./system-notifications/system-notifications.routes').then((m) => m.ROUTES),
      },
      {
        path: 'dead-letters',
        title: 'NAV_SYSTEM_NOTIFICATIONS',
        loadChildren: () => import('./dead-letters/dead-letters.routes').then((m) => m.ROUTES),
      },
      {
        path: 'usettings',
        title: 'NAV_USER_SETTINGS',
        loadChildren: () => import('./user-settings/user-settings.routes').then((m) => m.ROUTES),
      },
      {
        path: 'select',
        title: 'Select',
        loadComponent: () => import('./app-select-dialog-view.component').then((m) => m.AppSelectDialogViewComponent),
      },
      {
        path: 'qrcode/view',
        title: 'QR-Code',
        loadComponent: () => import('../_shared/ui/qr-code/app-qr-code.component').then((m) => m.AppQrCodeViewComponent),
      },
      {
        path: 'organisations',
        title: 'NAV_ORGANISATIONS',
        loadChildren: () => import('./organisations/organisations.routes').then((m) => m.ROUTES),
      },
      {
        path: 'events',
        title: 'NAV_EVENTS',
        loadChildren: () => import('./events/events.routes').then((m) => m.ROUTES),
      },
      {
        path: 'printers',
        title: 'NAV_PRINTERS',
        loadChildren: () => import('./printers/printers.routes').then((m) => m.ROUTES),
      },
      {
        path: 'tables',
        title: 'HOME_TABLES',
        loadChildren: () => import('./tables/tables.routes').then((m) => m.ROUTES),
      },
      {
        path: 'waiters',
        title: 'NAV_WAITERS',
        loadChildren: () => import('./waiters/waiters.routes').then((m) => m.ROUTES),
      },
      {
        path: 'products',
        title: 'HOME_PROD_ALL',
        loadChildren: () => import('./products/products.routes').then((m) => m.ROUTES),
      },
      {
        path: 'orders',
        title: 'NAV_ORDERS',
        loadChildren: () => import('./orders/orders.routes').then((m) => m.ROUTES),
      },
      {
        path: 'bills',
        title: 'NAV_BILLS',
        loadChildren: () => import('./bills/bills.routes').then((m) => m.ROUTES),
      },
      {
        path: 'statistics',
        title: 'NAV_STATISTICS',
        loadChildren: () => import('./statistics/statistics.module').then((m) => m.StatisticsModule),
      },
    ],
  },
];
