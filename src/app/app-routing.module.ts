import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DfxPreloadStrategy} from 'dfx-helper';

const routes: Routes = [
  {path: '', redirectTo: '/about', pathMatch: 'full'},
  {path: 'info', title: 'Info', loadChildren: () => import('./info/info.module').then((m) => m.InfoModule)},
  {path: 'about', title: 'About', loadChildren: () => import('./about/about.module').then((m) => m.AboutModule)},
  {path: 'home', title: 'Home', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule)},
  {
    path: 'mobile-link',
    title: 'Mobile',
    loadChildren: () => import('./mobile-link/mobile-link.module').then((m) => m.MobileLinkModule),
  },
  {
    path: 'qrcode',
    loadChildren: () => import('./_shared/app-qr-code-view/app-qr-code-view.module').then((m) => m.AppQrCodeViewModule),
  },
  {
    path: 'not-found',
    title: 'Not found',
    loadChildren: () => import('./page-not-found/page-not-found.module').then((m) => m.PageNotFoundModule),
  },
  {path: '**', redirectTo: '/not-found'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: DfxPreloadStrategy})],
  exports: [RouterModule],
  providers: [DfxPreloadStrategy],
})
export class AppRoutingModule {}
