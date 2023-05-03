import {Routes} from '@angular/router';

import {eventSelectedGuard} from '../../_shared/services/guards/event-selected-guard';
import {organisationSelectedGuard} from '../../_shared/services/guards/organisation-selected-guard';
import {ProductGroupByIdProductsComponent} from './product-group-by-id-products.component';

export const ROUTES: Routes = [
  {
    path: '',
    canActivate: [organisationSelectedGuard, eventSelectedGuard],
    loadComponent: () => import('./products.component').then((c) => c.ProductsComponent),
    children: [
      {path: 'all', loadComponent: () => import('./all-products.component').then((c) => c.AllProductsComponent)},
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
      {path: 'groups/products/:id', component: ProductGroupByIdProductsComponent},
      {
        path: 'groups/:id',
        loadComponent: () => import('./product-group-edit/product-group-edit.component').then((c) => c.ProductGroupEditComponent),
      },
      {path: '', pathMatch: 'full', redirectTo: '/home/products/all'},
    ],
  },
];
