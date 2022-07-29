import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../_services/auth/auth-guard.service';

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
      {
        path: 'usettings',
        title: 'Settings',
        loadChildren: () => import('./user-settings/user-settings.module').then((m) => m.UserSettingsModule),
      },
      {
        path: 'organisations',
        title: 'Organisations',
        data: {preload: true},
        loadChildren: () => import('./organisations/organisations.module').then((m) => m.OrganisationsModule),
      },
      {
        path: 'events',
        title: 'Events',
        data: {preload: true},
        loadChildren: () => import('./events/events.module').then((m) => m.EventsModule),
      },
      {
        path: 'printers',
        title: 'Printers',
        loadChildren: () => import('./printers/printers.module').then((m) => m.PrintersModule),
      },
      {
        path: 'tables',
        title: 'Tables',
        loadChildren: () => import('./tables/tables.module').then((m) => m.TablesModule),
      },
      {
        path: 'waiters',
        title: 'Waiters',
        loadChildren: () => import('./waiters/waiters.module').then((m) => m.WaitersModule),
      },
      {path: 'users', title: 'Users', loadChildren: () => import('./users/users.module').then((m) => m.UsersModule)},
      {
        path: 'products',
        title: 'Products',
        loadChildren: () => import('./products/products.module').then((m) => m.ProductsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(homeRoutes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
