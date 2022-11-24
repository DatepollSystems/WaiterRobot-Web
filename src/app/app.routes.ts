import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {path: '', redirectTo: '/about', pathMatch: 'full'},
  {path: 'info', title: 'INFORMATION', loadChildren: () => import('./info/info.module').then((m) => m.InfoModule)},
  {path: 'about', loadChildren: () => import('./about/about.module').then((m) => m.AboutModule)},
  {path: 'home', loadChildren: () => import('./home/home.module').then((m) => m.HomeModule)},
  {
    path: 'mobile-link',
    loadChildren: () => import('./mobile-link/mobile-link.component').then((m) => m.MobileLinkModule),
  },
  {
    path: 'ml',
    loadChildren: () => import('./mobile-link/mobile-link.component').then((m) => m.MobileLinkModule),
  },
  {
    path: 'not-found',
    title: '404',
    loadComponent: () => import('./page-not-found/page-not-found.component').then((m) => m.PageNotFoundComponent),
  },
  {path: '**', redirectTo: '/not-found'},
];
