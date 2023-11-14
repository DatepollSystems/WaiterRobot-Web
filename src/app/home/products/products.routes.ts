import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./products.component').then((c) => c.ProductsComponent),
    children: [
      {
        path: 'all',
        loadComponent: () => import('./all-products.component').then((c) => c.AllProductsComponent),
      },
      {
        path: ':id',
        loadComponent: () => import('./product-edit/product-edit.component').then((c) => c.ProductEditComponent),
      },
      {
        path: 'groups/all',
        loadComponent: () => import('./product-groups.component').then((c) => c.ProductGroupsComponent),
      },
      {
        path: 'groups/create',
        loadComponent: () => import('./product-group-edit/product-group-edit.component').then((c) => c.ProductGroupEditComponent),
      },
      {
        path: 'groups/products/:id',
        loadComponent: () => import('./product-group-by-id-products.component').then((c) => c.ProductGroupByIdProductsComponent),
      },
      {
        path: 'groups/:id',
        loadComponent: () => import('./product-group-edit/product-group-edit.component').then((c) => c.ProductGroupEditComponent),
      },
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
