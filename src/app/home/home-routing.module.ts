import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from './home.component';
import {AuthGuard} from '../_services/auth/auth-guard.service';

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
        loadChildren: () => import('./user-settings/user-settings.module').then((m) => m.UserSettingsModule),
      },
      {
        path: 'organisations',
        loadChildren: () => import('./organisations/organisations.module').then((m) => m.OrganisationsModule),
      },
      {path: 'events', loadChildren: () => import('./events/events.module').then((m) => m.EventsModule)},
      {path: 'printers', loadChildren: () => import('./printers/printers.module').then((m) => m.PrintersModule)},
      {path: 'tables', loadChildren: () => import('./tables/tables.module').then((m) => m.TablesModule)},
      {path: 'waiters', loadChildren: () => import('./waiters/waiters.module').then((m) => m.WaitersModule)},
      {path: 'users', loadChildren: () => import('./users/users.module').then((m) => m.UsersModule)},
      {path: 'products', loadChildren: () => import('./products/products.module').then((m) => m.ProductsModule)},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(homeRoutes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
