import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: '/about', pathMatch: 'full'},
  {path: '', loadChildren: () => import('./about/about.module').then((m) => m.AboutModule)},
  {path: '', loadChildren: () => import('./footer/footer.module').then((m) => m.FooterModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
