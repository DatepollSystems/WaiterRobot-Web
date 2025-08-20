import {Routes} from '@angular/router';

export const RECYCLE_BIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./recycle-bin.layout').then((c) => c.RecycleBinLayout),
    children: [
      {
        path: 'products',
        loadComponent: () => import('./product-groups-recycle-bin.component').then((c) => c.ProductGroupsRecycleBinComponent),
      },
      {
        path: 'tables',
        loadComponent: () => import('./table-groups-recycle-bin.component').then((c) => c.TableGroupsRecycleBinComponent),
      },
      {
        path: 'waiters',
        loadComponent: () => import('./waiters-recycle-bin.component').then((c) => c.WaitersRecycleBinComponent),
      },
      {
        path: 'printers',
        loadComponent: () => import('./printers-recycle-bin.component').then((c) => c.PrintersRecycleBinComponent),
      },
      {path: '', pathMatch: 'full', redirectTo: 'products'},
    ],
  },
];
