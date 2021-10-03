import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PageNotFoundComponent} from './page-not-found/page-not-found.component';

const routes: Routes = [
  {path: '', redirectTo: '/about', pathMatch: 'full'},
  {path: '', loadChildren: () => import('./about/about.module').then((m) => m.AboutModule)},
  {path: '', loadChildren: () => import('./footer/footer.module').then((m) => m.FooterModule)},
  {path: 'home', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule)},
  {path: 'not-found', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/not-found'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
