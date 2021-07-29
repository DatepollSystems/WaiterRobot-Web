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
      {path: '', pathMatch: 'full', loadChildren: () => import('./start/start.module').then((m) => m.StartModule), data: {preload: true}},
      {path: 'usettings', loadChildren: () => import('./user-settings/user-settings.module').then((m) => m.UserSettingsModule)},
      {path: 'organisations', loadChildren: () => import('./organisations/organisations.module').then((m) => m.OrganisationsModule)}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(homeRoutes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
