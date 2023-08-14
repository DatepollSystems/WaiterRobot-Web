import {Routes} from '@angular/router';

import {eventSelectedGuard} from '../../_shared/services/guards/event-selected-guard';
import {organisationSelectedGuard} from '../../_shared/services/guards/organisation-selected-guard';

export const ROUTES: Routes = [
  {
    path: '',
    canActivate: [organisationSelectedGuard, eventSelectedGuard],
    loadComponent: () => import('./products.component').then((c) => c.ProductsComponent),
    children: [
      {
        path: 'all',
        loadComponent: () => import('./all-products.component').then((c) => c.AllProductsComponent),
        canActivate: [eventSelectedGuard],
      },
      {
        path: ':id',
        loadComponent: () => import('./product-edit/product-edit.component').then((c) => c.ProductEditComponent),
        canActivate: [eventSelectedGuard],
      },
      {
        path: 'groups/all',
        loadComponent: () => import('./product-groups.component').then((c) => c.ProductGroupsComponent),
        canActivate: [eventSelectedGuard],
      },
      {
        path: 'groups/create',
        loadComponent: () => import('./product-group-edit/product-group-edit.component').then((c) => c.ProductGroupEditComponent),
        canActivate: [eventSelectedGuard],
      },
      {
        path: 'groups/products/:id',
        loadComponent: () => import('./product-group-by-id-products.component').then((c) => c.ProductGroupByIdProductsComponent),
        canActivate: [eventSelectedGuard],
      },
      {
        path: 'groups/:id',
        loadComponent: () => import('./product-group-edit/product-group-edit.component').then((c) => c.ProductGroupEditComponent),
        canActivate: [eventSelectedGuard],
      },
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
