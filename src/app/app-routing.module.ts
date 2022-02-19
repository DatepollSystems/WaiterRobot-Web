import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: '/about', pathMatch: 'full'},
  {path: '', loadChildren: () => import('./footer/footer.module').then((m) => m.FooterModule)},
  {path: 'about', loadChildren: () => import('./about/about.module').then((m) => m.AboutModule)},
  {path: 'home', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule)},
  {path: 'mobile-link', loadChildren: () => import('./mobile-link/mobile-link.module').then((m) => m.MobileLinkModule)},
  {
    path: 'qrcode-view',
    loadChildren: () => import('./_shared/app-qr-code-view/app-qr-code-view.module').then((m) => m.AppQrCodeViewModule),
  },
  {
    path: 'not-found',
    loadChildren: () => import('./page-not-found/page-not-found.module').then((m) => m.PageNotFoundModule),
  },
  {path: '**', redirectTo: '/not-found'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
