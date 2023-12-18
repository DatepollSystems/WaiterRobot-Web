import {Routes} from '@angular/router';

import {eventSelectedGuard} from './_shared/guards/event-selected-guard';
import {organisationSelectedGuard} from './_shared/guards/organisation-selected-guard';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./home.layout').then((c) => c.HomeLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./start/start.component').then((c) => c.StartComponent),
      },
      {
        path: 'users',
        title: 'NAV_USERS',
        loadChildren: () => import('./_admin/users/users.routes').then((m) => m.ROUTES),
      },
      {
        path: 'system-notifications',
        title: 'NAV_SYSTEM_NOTIFICATIONS',
        loadChildren: () => import('./_admin/system-notifications/system-notifications.routes').then((m) => m.ROUTES),
      },
      {
        path: 'dead-letters',
        title: 'NAV_SYSTEM_NOTIFICATIONS',
        loadChildren: () => import('./_admin/dead-letters/dead-letters.routes').then((m) => m.ROUTES),
      },
      {
        path: 'tmp-notifications',
        title: 'NAV_TMP_NOTIFICATIONS',
        loadChildren: () => import('./_admin/tmp-notifications/tmp-notifications.routes').then((m) => m.ROUTES),
      },
      {
        path: 'usettings',
        title: 'NAV_USER_SETTINGS',
        loadChildren: () => import('./user-settings/user-settings.routes').then((m) => m.ROUTES),
      },
      {
        path: 'select',
        title: 'Select',
        loadComponent: () => import('./select-dialog-view.component').then((m) => m.SelectDialogViewComponent),
      },
      {
        path: 'qrcode/view',
        title: 'QR-Code',
        loadComponent: () => import('./qr-code.component').then((m) => m.AppQrCodeViewComponent),
      },
      {
        path: 'organisations',
        title: 'NAV_ORGANISATIONS',
        loadChildren: () => import('./organisations/organisations.routes').then((m) => m.ROUTES),
      },
    ],
  },
  {
    path: 'o/:soId',
    loadComponent: () => import('./home.layout').then((c) => c.HomeLayout),
    canActivate: [organisationSelectedGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/not-found',
      },
      {
        path: 'events',
        title: 'NAV_EVENTS',
        loadChildren: () => import('./events/events.routes').then((m) => m.ROUTES),
      },
    ],
  },
  {
    path: 'o/:soId/e/:seId',
    loadComponent: () => import('./home.layout').then((c) => c.HomeLayout),
    canActivate: [organisationSelectedGuard, eventSelectedGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/not-found',
      },
      {
        path: 'waiters',
        title: 'NAV_WAITERS',
        loadChildren: () => import('./waiters/waiters.routes').then((m) => m.ROUTES),
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
