import {Routes} from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./tables.layout').then((c) => c.TablesLayout),
    children: [
      {
        path: 'all',
        loadComponent: () => import('./tables.component').then((c) => c.TablesComponent),
      },
      {
        path: ':id',
        loadComponent: () => import('./table-edit/table-edit.component').then((c) => c.TableEditComponent),
      },
      {
        path: 'groups/all',
        loadComponent: () => import('./table-groups.component').then((c) => c.TableGroupsComponent),
      },
      {
        path: 'groups/create',
        loadComponent: () => import('./table-group-edit/table-group-edit.component').then((c) => c.TableGroupEditComponent),
      },
      {
        path: 'groups/tables/:id',
        loadComponent: () => import('./tables-by-group.component').then((c) => c.TablesByGroupComponent),
      },
      {
        path: 'groups/:id',
        loadComponent: () => import('./table-group-edit/table-group-edit.component').then((c) => c.TableGroupEditComponent),
      },
      {path: '', pathMatch: 'full', redirectTo: 'all'},
    ],
  },
];
