import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CustomPreloadStrategy} from './custom-preload.strategy';

const routes: Routes = [
  {path: '', redirectTo: '/about', pathMatch: 'full'},
  {path: '', loadChildren: () => import('./footer/footer.module').then((m) => m.FooterModule)},
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
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: CustomPreloadStrategy})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
