import {Routes} from '@angular/router';

export const PRODUCT_ROUTES: Routes = [
  {
    path: ':id',
    loadComponent: () => import('./products.layout').then((c) => c.ProductsLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./products.page').then((c) => c.ProductsPage),
      },
    ],
  },
  {
    path: 'p/:id',
    loadComponent: () => import('./product-edit.page').then((c) => c.ProductEditPage),
  },
  {path: '', pathMatch: 'full', redirectTo: 'all'},
];

export const PRODUCT_GROUP_ROUTES: Routes = [
  {
    path: 'all',
    loadComponent: () => import('./product-groups.page').then((c) => c.ProductGroupsPage),
  },
  {
    path: ':id',
    loadComponent: () => import('./product-group-edit.page').then((c) => c.ProductGroupEditPage),
  },
  {path: '', pathMatch: 'full', redirectTo: 'all'},
];
