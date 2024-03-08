import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./products.layout').then((c) => c.ProductsLayout),
    children: [
      {
        path: 'all',
        loadComponent: () => import('./products.component').then((c) => c.ProductsComponent),
      },
      {
        path: ':id',
        loadComponent: () => import('./product-edit/product-edit.component').then((c) => c.ProductEditComponent),
      },
      {
        path: 'groups',
        children: [
          {
            path: 'all',
            loadComponent: () => import('./product-groups.component').then((c) => c.ProductGroupsComponent),
          },
          {
            path: 'create',
            loadComponent: () => import('./product-group-edit/product-group-edit.component').then((c) => c.ProductGroupEditComponent),
          },
          {
            path: 'products/:id',
            loadComponent: () => import('./products-by-group.component').then((c) => c.ProductsByGroupComponent),
          },
          {
            path: ':id',
            loadComponent: () => import('./product-group-edit/product-group-edit.component').then((c) => c.ProductGroupEditComponent),
          },
        ],
      },
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
