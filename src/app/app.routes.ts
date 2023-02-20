import {Routes} from '@angular/router';
import {ROUTES as ROUTES1} from './mobile-link/mobile-link.routes';

export const ROUTES: Routes = [
  {path: '', redirectTo: '/about', pathMatch: 'full'},
  {path: 'info', title: 'INFORMATION', loadChildren: () => import('./info/info.routes').then((m) => m.ROUTES)},
  {path: 'about', loadChildren: () => import('./about/about.routes').then((m) => m.ROUTES)},
  {path: 'home', loadChildren: () => import('./home/home.routes').then((m) => m.ROUTES)},
  {
    path: 'ml',
    loadChildren: () => import('./mobile-link/mobile-link.component').then((m) => ROUTES1),
  },
  {
    path: 'not-found',
    title: '404',
    loadComponent: () => import('./page-not-found.component').then((m) => m.PageNotFoundComponent),
  },
  {path: '**', redirectTo: '/not-found'},
];
