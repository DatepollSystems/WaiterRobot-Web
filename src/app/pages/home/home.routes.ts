import {Routes} from '@angular/router';

import {eventSelectedGuard} from '../../guards/event-selected-guard';
import {organisationSelectedGuard} from '../../guards/organisation-selected-guard';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./home.layout').then((c) => c.HomeLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./start.page').then((c) => c.StartPage),
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
        path: 'tmp-notifications',
        title: 'NAV_TMP_NOTIFICATIONS',
        loadChildren: () => import('./tmp-notifications/tmp-notifications.routes').then((m) => m.ROUTES),
      },
      {
        path: 'usettings',
        title: 'NAV_USER_SETTINGS',
        loadChildren: () => import('./usettings/user-settings.routes').then((m) => m.ROUTES),
      },
      {
        path: 'select',
        title: 'Select',
        loadComponent: () => import('./switcher.page').then((m) => m.SwitcherPage),
      },
      {
        path: 'qrcode/view',
        title: 'QR-Code',
        loadComponent: () => import('./qr-code.page').then((m) => m.QrCodePage),
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
    ],
  },
  {
    path: 'o/:soId',
    loadComponent: () => import('./home.layout').then((c) => c.HomeLayout),
    canActivate: [organisationSelectedGuard],
    children: [
      {
        path: 'settings',
        title: 'SETTINGS',
        loadChildren: () => import('./settings/settings.routes').then((m) => m.ROUTES),
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
        path: 'recycle-bin',
        title: 'RECYCLE_BIN',
        loadChildren: () => import('./recycle-bin/recycle-bin.routes').then((m) => m.RECYCLE_BIN_ROUTES),
      },
      {
        path: 'waiters',
        title: 'NAV_WAITERS',
        loadChildren: () => import('./waiters/waiters.routes').then((m) => m.WAITER_ROUTES),
      },
      {
        path: 'waiter-duplicates',
        title: 'NAV_WAITERS',
        loadChildren: () => import('./waiters/waiters.routes').then((m) => m.WAITER_DUPLICATE_ROUTES),
      },
      {
        path: 'printers',
        title: 'NAV_PRINTERS',
        loadChildren: () => import('./printers/printers.routes').then((m) => m.ROUTES),
      },
      {
        path: 'tables',
        title: 'HOME_TABLES',
        loadChildren: () => import('./tables/tables.routes').then((m) => m.TABLE_ROUTES),
      },
      {
        path: 'table-groups',
        title: 'HOME_TABLE_GROUPS',
        loadChildren: () => import('./tables/tables.routes').then((m) => m.TABLE_GROUP_ROUTES),
      },
      {
        path: 'products',
        title: 'HOME_PROD_ALL',
        loadChildren: () => import('./products/products.routes').then((m) => m.PRODUCT_ROUTES),
      },
      {
        path: 'product-groups',
        title: 'HOME_PROD_GROUPS',
        loadChildren: () => import('./products/products.routes').then((m) => m.PRODUCT_GROUP_ROUTES),
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
        loadChildren: () => import('../../components/statistics/statistics.module').then((m) => m.StatisticsModule),
      },
      {
        path: 'settings',
        title: 'SETTINGS',
        loadChildren: () => import('./settings/settings.routes').then((m) => m.EVENT_ROUTES),
      },
    ],
  },
];
