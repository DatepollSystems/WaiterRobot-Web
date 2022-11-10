import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../_shared/services/auth/auth-guard.service';

import {HomeComponent} from './home.component';

const homeRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('./start/start.module').then((m) => m.StartModule),
      },
      {path: 'users', title: 'NAV_USERS', loadChildren: () => import('./users/users.module').then((m) => m.UsersModule)},
      {
        path: 'usettings',
        title: 'NAV_USER_SETTINGS',
        loadChildren: () => import('./user-settings/user-settings.module').then((m) => m.UserSettingsModule),
      },
      {
        path: 'qrcode/view',
        title: 'QR-Code',
        loadComponent: () => import('../_shared/ui/qr-code/app-qr-code.component').then((m) => m.AppQrCodeViewComponent),
      },
      {
        path: 'organisations',
        title: 'NAV_ORGANISATIONS',
        data: {preload: true},
        loadChildren: () => import('./organisations/organisations.module').then((m) => m.OrganisationsModule),
      },
      {
        path: 'events',
        title: 'NAV_EVENTS',
        data: {preload: true},
        loadChildren: () => import('./events/events.module').then((m) => m.EventsModule),
      },
      {
        path: 'printers',
        title: 'NAV_PRINTERS',
        loadChildren: () => import('./printers/printers.module').then((m) => m.PrintersModule),
      },
      {
        path: 'tables',
        title: 'NAV_TABLES',
        loadChildren: () => import('./tables/tables.module').then((m) => m.TablesModule),
      },
      {
        path: 'waiters',
        title: 'NAV_WAITERS',
        loadChildren: () => import('./waiters/waiters.module').then((m) => m.WaitersModule),
      },
      {
        path: 'products',
        title: 'NAV_PRODUCTS',
        loadChildren: () => import('./products/products.module').then((m) => m.ProductsModule),
      },
      {
        path: 'orders',
        title: 'NAV_ORDERS',
        loadChildren: () => import('./orders/orders.module').then((m) => m.OrdersModule),
      },
      {
        path: 'statistics',
        title: 'NAV_STATISTICS',
        loadChildren: () => import('./statistics/statistics.module').then((m) => m.StatisticsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(homeRoutes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
