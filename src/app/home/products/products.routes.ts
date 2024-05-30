import {Routes} from '@angular/router';

export const PRODUCT_ROUTES: Routes = [
  {
    path: ':id',
    loadComponent: () => import('./products.layout').then((c) => c.ProductsLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./products.component').then((c) => c.ProductsComponent),
      },
    ],
  },
  {
    path: 'p/:id',
    loadComponent: () => import('./product-edit/product-edit.component').then((c) => c.ProductEditComponent),
  },
  {path: '', pathMatch: 'full', redirectTo: 'all'},
];

export const PRODUCT_GROUP_ROUTES: Routes = [
  {
    path: 'all',
    loadComponent: () => import('./product-groups.component').then((c) => c.ProductGroupsComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./product-group-edit/product-group-edit.component').then((c) => c.ProductGroupEditComponent),
  },
  {path: '', pathMatch: 'full', redirectTo: 'all'},
];
