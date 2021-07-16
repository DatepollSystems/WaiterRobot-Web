import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {IsAuthenticatedGuardService} from '../_services/auth/is-authenticated-guard.service';
import {AboutComponent} from './about.component';

const aboutRoutes: Routes = [{path: 'about', component: AboutComponent, canActivate: [IsAuthenticatedGuardService]}];

@NgModule({
  imports: [RouterModule.forChild(aboutRoutes)],
  exports: [RouterModule]
})
export class AboutRoutingModule {
}
